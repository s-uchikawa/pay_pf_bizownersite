export type SimpleTableProps = {
    maxWidth?: number;
    maxHeight?: number;
    stickyHeader?: boolean;
    stickyFooter?: boolean;
    headerList: Array<TableColumn>;
    itemList: Array<Array<any>>;
    sortKey?: string;
    sortDirection?: "asc" | "desc";
    pagination?: boolean;
    paginationConf?: PaginationConf;
    onSort?: (sortItem) => void;
};

export type TableColumn = {
    id:string,
    label: string;
};

export interface  PaginationConf {
    count?: number;
    rowsPerPage?:number;
    rowsPerPageOptions?: Array<number>;
    page?: number;
    onPageChange?: (number) => void;
    onRowsPerPageChange?: (number) => void;
};