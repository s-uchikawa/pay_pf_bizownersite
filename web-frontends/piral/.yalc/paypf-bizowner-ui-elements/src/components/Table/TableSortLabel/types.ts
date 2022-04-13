import { ReactNode } from "react";

export type TableSortLabelProps = JSX.IntrinsicElements['span'] & {
    sort?: boolean;
    direction?: 'asc' | 'desc';
    hideSortIcon? : boolean;
};