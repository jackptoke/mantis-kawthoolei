import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useFilters, useRowSelect, useTable, usePagination } from 'react-table';

// project import
import Layout from 'layout';
import Page from 'components/Page';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { CSVExport, IndeterminateCheckbox, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';

import makeData from 'data/react-table';
import SyntaxHighlight from 'utils/syntax-highlight';
import { renderFilterTypes } from 'utils/react-table';

// ==============================|| REACT TABLE ||============================== //

const SelectionHeader = ({ getToggleAllPageRowsSelectedProps }) => (
  <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
);
const SelectionCell = ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />;

SelectionHeader.propTypes = {
  getToggleAllPageRowsSelectedProps: PropTypes.func
};

SelectionCell.propTypes = {
  row: PropTypes.object
};

function ReactTable({ columns, data }) {
  const theme = useTheme();
  const filterTypes = useMemo(() => renderFilterTypes, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { selectedRowIds, pageIndex, pageSize },
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, selectedRowIds: { 0: true, 5: true, 7: true } }
    },
    useFilters,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((cols) => [
        {
          id: 'row-selection-chk',
          accessor: 'Selection',
          Header: SelectionHeader,
          Cell: SelectionCell
        },
        ...cols
      ]);
    }
  );

  return (
    <>
      <MainCard
        title="Row Selection (Pagination)"
        content={false}
        secondary={
          <CSVExport
            data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original) : data}
            filename={'row-selection-table.csv'}
          />
        }
      >
        <ScrollX>
          <TableRowSelection selected={Object.keys(selectedRowIds).length} />
          <Stack spacing={3}>
            <Table {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup, i) => (
                  <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                    {headerGroup.headers.map((column, index) => (
                      <TableCell key={index} {...column.getHeaderProps([{ className: column.className }])}>
                        {column.render('Header')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <TableRow
                      key={i}
                      {...row.getRowProps()}
                      onClick={() => {
                        row.toggleRowSelected();
                      }}
                      sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                    >
                      {row.cells.map((cell, index) => (
                        <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                          {cell.render('Cell')}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell sx={{ p: 2, pb: 0 }} colSpan={8}>
                    <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <SyntaxHighlight>
              {JSON.stringify(
                {
                  selectedRowIndices: selectedRowIds,
                  'selectedFlatRows[].original': selectedFlatRows.map((d) => d.original)
                },
                null,
                2
              )}
            </SyntaxHighlight>
          </Stack>
        </ScrollX>
      </MainCard>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| REACT TABLE - ROW SELECTION ||============================== //

const statusCell = ({ value }) => {
  switch (value) {
    case 'Complicated':
      return <Chip color="error" label="Complicated" size="small" variant="light" />;
    case 'Relationship':
      return <Chip color="success" label="Relationship" size="small" variant="light" />;
    case 'Single':
    default:
      return <Chip color="info" label="Single" size="small" variant="light" />;
  }
};

statusCell.propTypes = {
  value: PropTypes.string
};
const ProgressCell = ({ value }) => <LinearWithLabel value={value} sx={{ minWidth: 75 }} />;

ProgressCell.propTypes = {
  value: PropTypes.number
};

const RowSelectionTable = () => {
  const data = useMemo(() => makeData(2000), []);
  const columns = useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName'
      },
      {
        Header: 'Last Name',
        accessor: 'lastName'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Age',
        accessor: 'age',
        className: 'cell-right'
      },
      {
        Header: 'Visits',
        accessor: 'visits',
        className: 'cell-right'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: statusCell
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
        Cell: ProgressCell
      }
    ],
    []
  );

  return (
    <Page title="Row-Selection">
      <ReactTable columns={columns} data={data} />;
    </Page>
  );
};

RowSelectionTable.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default RowSelectionTable;
