export type PaginationFooterProps = {
    count?: number;
    boundaryCount?: number;
    page?: number;
    hidePrevButton?:boolean;
    hideNextButton?:boolean;
    align?:  'center' | 'left' | 'right';
    onChange?: (target,value) => void;
};