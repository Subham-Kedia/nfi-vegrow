import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import _get from 'lodash/get';
import _omit from 'lodash/omit';

import { StyledTableRow, useStyles } from './style';

export const TableHeader = ({
  columns,
  totalRows,
  numSelected,
  onSelectAll,
  isSelection,
  classes,
}) => {
  const { headerCellWrapper } = classes;
  return (
    <TableHead>
      <TableRow>
        {isSelection && (
          <TableCell padding="checkbox" className={headerCellWrapper}>
            {onSelectAll && (
              <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < totalRows}
                checked={totalRows > 0 && numSelected === totalRows}
                onChange={onSelectAll}
                inputProps={{ 'aria-label': 'Select All' }}
              />
            )}
          </TableCell>
        )}
        {columns.map(({ key, header, subHeader, ...restProps }) => (
          <TableCell
            variant="head"
            key={key}
            {..._omit(restProps, 'render')}
            className={headerCellWrapper}
          >
            {header}
            {subHeader && (
              <Typography
                variant="caption"
                component="div"
                className="disabled-text"
                color="textPrimary"
              >
                {subHeader}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export const TableFooterRow = ({ columns, footerSummarydata }) => {
  return (
    <TableFooter>
      <TableRow>
        {columns.map(({ key, footer, ...restProps }) => (
          <TableCell variant="head" key={key} {..._omit(restProps, 'render')}>
            {typeof footerSummarydata[footer] !== 'undefined'
              ? footerSummarydata[footer]
              : footer}
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );
};

export const TableBodyRow = ({
  columns,
  rowData,
  rowProps,
  cellProps,
  onSelect,
  isSelection,
  selected,
  dataKey,
}) => {
  const rowProp = rowProps ? rowProps(rowData) : {};
  return (
    <StyledTableRow {...rowProp}>
      {isSelection && (
        <TableCell padding="checkbox">
          {onSelect && (
            <Checkbox
              color="primary"
              value={_get(rowData, dataKey)}
              onChange={onSelect}
              checked={selected?.includes(_get(rowData, dataKey))}
              inputProps={{ 'aria-labelledby': 'Select' }}
            />
          )}
        </TableCell>
      )}
      {columns.map(({ key, render, ...restProps }) => {
        const cellData = _get(rowData, key);
        const cellProp = cellProps
          ? cellProps({ data: cellData, key, rowData })
          : {};
        return (
          <TableCell key={key} {...restProps}>
            {render
              ? render({ data: cellData, props: cellProp, rowData })
              : cellData}
          </TableCell>
        );
      })}
    </StyledTableRow>
  );
};

const CustomTable = ({
  header,
  columns,
  size,
  data,
  dataKey,
  sticky,
  rowProps,
  cellProps,
  rowsPerPage,
  totalRows,
  onSelectAll,
  onSelect,
  selected,
  currentPage,
  onChangePage,
  isSelection,
  className,
  isFooter,
  footerSummarydata,
  footerComponent: Footer,
  showFooterComponent,
  ...props
}) => {
  const [tableData, setTableData] = useState(data);
  const classes = useStyles();

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <Paper className={clsx(classes.root, className)}>
      <TableContainer className={classes.container}>
        <Table size={size} stickyHeader={sticky} {...props}>
          {header && (
            <TableHeader
              columns={columns}
              totalRows={totalRows}
              numSelected={selected?.length || 0}
              onSelectAll={onSelectAll}
              isSelection={isSelection}
              classes={classes}
            />
          )}
          <TableBody>
            {tableData.map((row) => {
              return (
                <TableBodyRow
                  columns={columns}
                  key={_get(row, dataKey)}
                  dataKey={dataKey}
                  rowData={row}
                  rowProps={rowProps}
                  cellProps={cellProps}
                  selected={selected}
                  onSelect={onSelect}
                  isSelection={isSelection}
                />
              );
            })}
          </TableBody>
          {isFooter && (
            <TableFooterRow
              columns={columns}
              footerSummarydata={footerSummarydata}
            />
          )}
        </Table>
        {showFooterComponent && <Footer data={footerSummarydata} />}
      </TableContainer>
      {totalRows > 0 && onChangePage && (
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={onChangePage}
        />
      )}
    </Paper>
  );
};

CustomTable.defaultProps = {
  columns: [],
  data: [],
  dataKey: 'id',
  isSelection: false,
  rowsPerPage: 25,
  header: true,
  isFooter: false,
  footerSummarydata: [],
  cellProps: false,
  rowProps: false,
  sticky: false,
  size: 'small',
};

export const TableElements = Table;

export default CustomTable;
