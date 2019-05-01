import React from 'react';
import { mountWithContexts } from '../enzymeHelpers';
import DataListToolbar from '../../src/components/DataListToolbar';

describe('<DataListToolbar />', () => {
  let toolbar;

  afterEach(() => {
    if (toolbar) {
      toolbar.unmount();
      toolbar = null;
    }
  });

  test('it triggers the expected callbacks', () => {
    const columns = [{ name: 'Name', key: 'name', isSortable: true }];

    const search = 'button[aria-label="Search"]';
    const searchTextInput = 'input[aria-label="Search text input"]';
    const selectAll = 'input[aria-label="Select all"]';
    const sort = 'button[aria-label="Sort"]';

    const onSearch = jest.fn();
    const onSort = jest.fn();
    const onSelectAll = jest.fn();

    toolbar = mountWithContexts(
      <DataListToolbar
        isAllSelected={false}
        showExpandCollapse
        sortedColumnKey="name"
        sortOrder="ascending"
        columns={columns}
        onSearch={onSearch}
        onSort={onSort}
        onSelectAll={onSelectAll}
        showSelectAll
      />
    );

    toolbar.find(sort).simulate('click');
    toolbar.find(selectAll).simulate('change', { target: { checked: false } });

    expect(onSelectAll).toHaveBeenCalledTimes(1);
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort).toBeCalledWith('name', 'descending');

    expect(onSelectAll).toHaveBeenCalledTimes(1);
    expect(onSelectAll.mock.calls[0][0]).toBe(false);

    toolbar.find(searchTextInput).instance().value = 'test-321';
    toolbar.find(searchTextInput).simulate('change');
    toolbar.find(search).simulate('click');

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toBeCalledWith('test-321');
  });

  test('dropdown items sortable columns work', () => {
    const sortDropdownToggleSelector = '.pf-l-toolbar__group.sortDropdownGroup .pf-l-toolbar__item button';
    const sortDropdownItemsSelector = '.pf-l-toolbar__group.sortDropdownGroup button.pf-c-dropdown__menu-item';
    const searchDropdownToggleSelector = '.pf-c-dropdown.searchKeyDropdown .pf-c-dropdown__toggle';
    const searchDropdownItemsSelector = '.pf-c-dropdown.searchKeyDropdown button.pf-c-dropdown__menu-item';

    const multipleColumns = [
      { name: 'Foo', key: 'foo', isSortable: true },
      { name: 'Bar', key: 'bar', isSortable: true },
      { name: 'Bakery', key: 'bakery', isSortable: true },
      { name: 'Baz', key: 'baz' }
    ];

    const onSearch = jest.fn();
    const onSort = jest.fn();
    const onSelectAll = jest.fn();

    toolbar = mountWithContexts(
      <DataListToolbar
        isAllSelected={false}
        sortedColumnKey="foo"
        sortOrder="ascending"
        columns={multipleColumns}
        onSearch={onSearch}
        onSort={onSort}
        onSelectAll={onSelectAll}
      />
    );
    const sortDropdownToggle = toolbar.find(sortDropdownToggleSelector);
    expect(sortDropdownToggle.length).toBe(2);
    sortDropdownToggle.at(1).simulate('click');
    sortDropdownToggle.at(0).simulate('click');
    toolbar.update();

    const sortDropdownItems = toolbar.find(sortDropdownItemsSelector);
    expect(sortDropdownItems.length).toBe(2);

    const mockedSortEvent = { target: { innerText: 'Bar' } };
    sortDropdownItems.at(0).simulate('click', mockedSortEvent);
    toolbar = mountWithContexts(
      <DataListToolbar
        isAllSelected={false}
        sortedColumnKey="foo"
        sortOrder="descending"
        columns={multipleColumns}
        onSearch={onSearch}
        onSort={onSort}
        onSelectAll={onSelectAll}
      />
    );
    toolbar.update();

    const sortDropdownToggleDescending = toolbar.find(sortDropdownToggleSelector);
    expect(sortDropdownToggleDescending.length).toBe(2);
    sortDropdownToggleDescending.at(1).simulate('click');
    sortDropdownToggleDescending.at(0).simulate('click');
    toolbar.update();

    const sortDropdownItemsDescending = toolbar.find(sortDropdownItemsSelector);
    expect(sortDropdownItemsDescending.length).toBe(2);

    const mockedSortEventDescending = { target: { innerText: 'Bar' } };
    sortDropdownItems.at(0).simulate('click', mockedSortEventDescending);
    toolbar.update();

    const searchDropdownToggle = toolbar.find(searchDropdownToggleSelector);
    expect(searchDropdownToggle.length).toBe(1);
    searchDropdownToggle.at(0).simulate('click');
    toolbar.update();

    const searchDropdownItems = toolbar.find(searchDropdownItemsSelector);
    expect(searchDropdownItems.length).toBe(3);

    const mockedSearchEvent = { target: { innerText: 'Bar' } };
    searchDropdownItems.at(0).simulate('click', mockedSearchEvent);
  });

  test('it displays correct sort icon', () => {
    const downNumericIconSelector = 'SortNumericDownIcon';
    const upNumericIconSelector = 'SortNumericUpIcon';
    const downAlphaIconSelector = 'SortAlphaDownIcon';
    const upAlphaIconSelector = 'SortAlphaUpIcon';

    const numericColumns = [{ name: 'ID', key: 'id', isSortable: true, isNumeric: true }];
    const alphaColumns = [{ name: 'Name', key: 'name', isSortable: true, isNumeric: false }];
    const onSearch = jest.fn();
    const onSort = jest.fn();
    const onSelectAll = jest.fn();

    toolbar = mountWithContexts(
      <DataListToolbar
        isAllSelected={false}
        sortedColumnKey="id"
        sortOrder="descending"
        columns={numericColumns}
        onSearch={onSearch}
        onSort={onSort}
        onSelectAll={onSelectAll}
        showDelete
      />
    );

    const downNumericIcon = toolbar.find(downNumericIconSelector);
    expect(downNumericIcon.length).toBe(1);

    toolbar = mountWithContexts(
      <DataListToolbar
        isAllSelected={false}
        sortedColumnKey="id"
        sortOrder="ascending"
        columns={numericColumns}
        onSearch={onSearch}
        onSort={onSort}
        onSelectAll={onSelectAll}
      />
    );

    const upNumericIcon = toolbar.find(upNumericIconSelector);
    expect(upNumericIcon.length).toBe(1);

    toolbar = mountWithContexts(
      <DataListToolbar
        isAllSelected={false}
        sortedColumnKey="name"
        sortOrder="descending"
        columns={alphaColumns}
        onSearch={onSearch}
        onSort={onSort}
        onSelectAll={onSelectAll}
      />
    );

    const downAlphaIcon = toolbar.find(downAlphaIconSelector);
    expect(downAlphaIcon.length).toBe(1);

    toolbar = mountWithContexts(
      <DataListToolbar
        isAllSelected={false}
        sortedColumnKey="name"
        sortOrder="ascending"
        columns={alphaColumns}
        onSearch={onSearch}
        onSort={onSort}
        onSelectAll={onSelectAll}
      />
    );

    const upAlphaIcon = toolbar.find(upAlphaIconSelector);
    expect(upAlphaIcon.length).toBe(1);
  });

  test('trash can button triggers correct function', () => {
    const columns = [{ name: 'Name', key: 'name', isSortable: true }];
    const onOpenDeleteModal = jest.fn();
    const openDeleteModalButton = 'button[aria-label="Delete"]';

    toolbar = mountWithContexts(
      <DataListToolbar
        columns={columns}
        onOpenDeleteModal={onOpenDeleteModal}
        showDelete
        disableDeleteIcon={false}
      />
    );
    toolbar.find(openDeleteModalButton).simulate('click');
    expect(onOpenDeleteModal).toHaveBeenCalled();
  });

  test('Tooltip says "Select a row to delete" when trash can icon is disabled', () => {
    toolbar = mountWithContexts(
      <DataListToolbar
        columns={[{ name: 'Name', key: 'name', isSortable: true }]}
        showDelete
        deleteTooltip="Select a row to delete"
      />
    );

    const toolTip = toolbar.find('.pf-c-tooltip__content');
    toolTip.simulate('mouseover');
    expect(toolTip.text()).toBe('Select a row to delete');
  });

  test('Delete Org tooltip says "Delete" when trash can icon is enabled', () => {
    toolbar = mountWithContexts(
      <DataListToolbar
        columns={[{ name: 'Name', key: 'name', isSortable: true }]}
        showDelete
        deleteTooltip="Delete"
      />
    );
    const toolTip = toolbar.find('.pf-c-tooltip__content');
    toolTip.simulate('mouseover');
    expect(toolTip.text()).toBe('Delete');
  });
});
