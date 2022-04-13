import * as React from 'react';

export type DataTableColumn = {
    // 列ヘッダ
    header: string | React.ReactNode;
    // 列幅
    width?: string; 
    // 列の最小サイズ
    minWidth?: string;
    // ソート可能かどうか
    sortable?: boolean;
    // 水平方向の配置
    align?: 'center' | 'left' | 'right';
};

export type DataTableRow = {
    // セル
    cells: DataTableCell[];
};

export type DataTableCell = {
    // セルのコンポーネント
    component: string | React.ReactNode;
    // 水平方向の配置
    align?: 'center' | 'left' | 'right';
};

export type DataTableSort = {
    // ソートカラムのインデックス
    column: number;
    // ソート方向
    direction: 'asc' | 'desc';
};

export type DataTableProps = {    
    // テーブル列
    columns: DataTableColumn[];
    // テーブル行
    rows: DataTableRow[];
    // ページ数
    pageCount: number;
    // 現在のページ番号
    currentPage: number;
    // ソート情報
    sort?: DataTableSort;
    // データの読み込み中かどうか
    isLoading?: boolean;
    // ローディングアイコン色(指定なし時は黒)
    loadingIconColor?:string;
    // ページ番号の変更イベント
    onPageChange?: (page: number) => void;
    // ソートイベント
    onSort?: (column: number, direction: 'asc' | 'desc') => void;
};
