import React from 'react';
import {DataTable, DataTableProps, DataTableRow, DataTableColumn, DataTableCell, DataTableSort} from 'paypf-bizowner-ui-elements'

function DataTableSample() {
  const [sort, setSort] = React.useState<DataTableSort>({column: 0, direction: "asc"});

  let cols: DataTableColumn[] = [
    {header: "1", width: "100px", align: "left", sortable: true}, 
    {header: "2", minWidth: "300px", align: "left"},
    {header: "3", width: "100px", align: "center", sortable: true} 
  ];

  let rows: DataTableRow[] = [
    
  ];

  for (var i = 0; i < 100; i++) {
    let cells: DataTableCell[] = [
      {component: "a", align: "center"},
      {component: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"},
      {component: "c"}
    ];
    rows.push({ cells: cells });
  }

  const handleSort = (column: number, direction: "asc" | "desc") => {
    setSort({column: column, direction: direction});
  }

  return (
    <div style={{height: "500px", width: "100%"}}>
      <DataTable columns={cols} rows={rows} pageCount={10} currentPage={2} sort={sort} onSort={handleSort}/>
    </div>
  );
}

export default DataTableSample;
