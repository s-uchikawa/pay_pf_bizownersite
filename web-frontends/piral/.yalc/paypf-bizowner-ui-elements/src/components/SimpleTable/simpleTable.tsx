import * as React from 'react';
import { SimpleTableProps, PaginationConf } from './types';
import { Table, TableHead, TableFooter, TableRow,TableCell,TableBody ,TableSortLabel, PaginationFooter } from '../Table';


export const SimpleTable: React.FC<SimpleTableProps> =({...props})=>{
  var header, rows, footer, option, pageCount;

  const {
    maxWidth,
    maxHeight,
    stickyHeader,
    stickyFooter,
    headerList,
    itemList,
    sortKey,
    sortDirection,
    pagination = false,
    paginationConf,
    onSort: handleSort,
    ...other
  } = props;

  const {
    rowsPerPage = 10,
    rowsPerPageOptions,
    page = 1,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
  } = paginationConf;

  // sort
  const onHeadCellClick =(event)=>{
    if (event.target instanceof HTMLTableCellElement || event.target instanceof HTMLSpanElement) {
      var sortItem = event.target.id;
      if (handleSort){
        handleSort(sortItem);
      }
    }
  }

  // ページ遷移
  const onPageChange = (event, value: any) => {
    if (handlePageChange){
      handlePageChange(value);
    }
  }

  // 表示行数変更
  const onRowsPerPageChange = (event) => {
    if (handleRowsPerPageChange) {
      handleRowsPerPageChange(Number(event.target.value));
    }
  }

  header = 
    <TableHead>
      <TableRow>
        { headerList.map((head) => {
          return(
            <TableCell variant={'head'} id={head.id} onClick={onHeadCellClick}>
                {head.label}
                <TableSortLabel sort={sortKey==head.id} direction={sortDirection} />
            </TableCell>
          )})}
      </TableRow>
    </TableHead>;

  rows = 
      <TableBody>
        {itemList
            .slice((page -1) * rowsPerPage, (page -1) * rowsPerPage + rowsPerPage)
            .map((item,i) => {
                return (
                    <TableRow tabIndex={-1} key={i}>
                      {item.map((value) => {
                        return (
                          <TableCell align={typeof value === 'number'? 'right':'left'}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                );
            })
        }
    </TableBody>;

  if (pagination){
    pageCount = Math.floor(itemList.length / rowsPerPage);
    console.log(pageCount+ "," + itemList.length / rowsPerPage + ","+ itemList.length)
    if (itemList.length % rowsPerPage>0){
      pageCount = pageCount +1
    }

    if (rowsPerPageOptions){
      option = (
        <span className="pbo-inline-flex pbo-pl-2">
          <label className="">Rows:</label> 
          <select className="pbo-border-b-2" id="rowsOption" name="rowsOption" defaultValue={String(rowsPerPage)} onChange={onRowsPerPageChange} >
              {rowsPerPageOptions.map((rows) =>{
                return(<option value={rows}>{rows}</option>)
              })}
          </select>
        </span>
      );
    }

    footer =
      <TableFooter >
        <tr>
        <TableCell colSpan={headerList.length}>
          <div className="pbo-text-center ">
          <span className="pbo-inline-flex">
            <PaginationFooter count={pageCount} boundaryCount={2} page={page}  onChange={onPageChange}/>
          </span>
          {option}
          </div>
        </TableCell>
        </tr>
      </TableFooter>;
  }
    
  return(
    <Table maxHeight={maxHeight} maxWidth={maxWidth} stickyHeader={stickyHeader} stickyFooter={stickyFooter}>
      {header}
      {rows}
      {footer}
    </Table>
  );
}