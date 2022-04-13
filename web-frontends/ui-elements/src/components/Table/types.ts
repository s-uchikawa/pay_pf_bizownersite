export type TableProps = JSX.IntrinsicElements['table'] & {
    maxWidth?: number;
    maxHeight?: number;
    stickyHeader?: boolean;
    stickyFooter?: boolean;
    overflowX?: 'none' | 'auto' | 'hidden';
};
