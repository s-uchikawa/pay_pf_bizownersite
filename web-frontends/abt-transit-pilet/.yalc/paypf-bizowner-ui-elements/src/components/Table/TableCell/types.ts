export type TableCellProps = HTMLTableCellElement & {
    component?:  'tb' | 'th';
    align?: 'center' | 'left' | 'right';
    variant?:'body' | 'footer' | 'head';
    padding?: 'none' | 'normal';
    sort?: undefined;
    sortDirection? :undefined
};

export type TableHeadCellProps = JSX.IntrinsicElements['th'] & {
    component?:  'tb' | 'th';
    align?: 'center' | 'left' | 'right';
    variant?:'body' | 'footer' | 'head';
    padding?: 'none' | 'normal';
    sort?: boolean;
    sortDirection? :'asc' | 'desc' | false;
};