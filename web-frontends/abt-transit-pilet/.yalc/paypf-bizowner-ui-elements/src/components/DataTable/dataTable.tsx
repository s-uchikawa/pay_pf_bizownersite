import * as React from 'react';
import { DataTableProps } from './types';
import { PaginationFooter, TableSortLabel } from '../Table'
import { LoadingIcon } from '../Icons';

export const DataTable: React.FC<DataTableProps> = ({ columns, rows, pageCount, currentPage, sort, onPageChange, onSort, isLoading, loadingIconColor, ...props }) => {
    const headerHeight: number = 42;
    const sortIconHeight: number = 26;
    const container = React.useRef<HTMLDivElement>(null);
    const tableBodySection = React.useRef<HTMLTableSectionElement>(null);
    const headerInnerBlock = React.useRef<HTMLDivElement>(null);
    const headerBlock = React.useRef<HTMLDivElement>(null);
    const bodyBlock = React.useRef<HTMLDivElement>(null);
    const footerBlock = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        resizeBody();

        // リサイズを監視
        var observer = new ResizeObserver((entries) => {
            if (!(headerInnerBlock.current && tableBodySection.current)) {
                return;
            }

            // ボディの高さを設定
            resizeBody();

            let firstRow: any;
            if (tableBodySection.current.children.length > 0) {
                firstRow = tableBodySection.current.children[0];
            }                
            // ボディのカラム幅に合わせてヘッダの幅を変更
            if (firstRow) {
                for (var i = 0; i < firstRow.children.length; i++) {
                    let firstRowCol = firstRow.children[i];
                    let headerCol: any = headerInnerBlock.current.children[i];
                    headerCol.style.width = firstRowCol.clientWidth + "px";
                }
            }
            // styleにmin-width設定しても効かないのでmin-width以下になった場合はWidthの指定がないカラムはwidthを明示的に指定
            for (var i = 0; i < headerInnerBlock.current.children.length; i++) {
                if (columns[i] && columns[i].width == null && columns[i].minWidth) {
                    let minWidth: number = Number(columns[i].minWidth.replace('px', ''));
                    let headerCol: any = headerInnerBlock.current.children[i];

                    if (minWidth > headerCol.clientWidth) {
                        headerCol.style.width = minWidth + "px";
                    } else {
                        headerCol.style.width = undefined;
                    }

                    if (firstRow) {
                        let firstRowCol = firstRow.children[i];
                        if (minWidth > firstRowCol.clientWidth) {
                            firstRowCol.style.width = minWidth + "px";
                        } else {
                            firstRowCol.style.width = undefined;
                        }
                    }
                }
            }                
        });     
        observer.observe(container.current);   
    });

    /**
     * ボディ部の横スクロールイベントを拾って、ヘッダ部も同じように横にスクロールさせる
     */
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        headerInnerBlock.current.style.left = (bodyBlock.current.scrollLeft * -1) + "px";
    }

    /**
     * ボディの高さを調整します
     */
    const resizeBody = () => {
        let bodyHeight = container.current.clientHeight - headerBlock.current.clientHeight - footerBlock.current.clientHeight;
        if (bodyHeight < 100) {
            bodyHeight = 100;
        }
        bodyBlock.current.style.height = bodyHeight + "px";
    }

    /**
     * PaginationFooterのchangeイベント
     */
    const handlePageChange = (target, value) => {
        if(isLoading){
            // ローディング中はページ切り替えしない
            return;
        }
        if (currentPage != value && onPageChange) {
            onPageChange(value);
        }
    }

    /**
     * 列ヘッダのクリックイベント
     */
    const handleColHeaderClick = (colIdx: number) => {
        // ローディング中はソートしない
        if(isLoading){
            return;
        }
        // ソート可能項目の場合、ソートイベントを通知
        if (columns[colIdx].sortable && onSort) {
            if (sort) {
                if (sort.column == colIdx) {
                    if (sort.direction == "asc") {
                        onSort(sort.column, "desc");
                    } else {
                        onSort(sort.column, "asc");
                    }
                    return;
                }
            }
            onSort(colIdx, "asc");
        }
    }

    // 指定なしの場合は黒指定
    if(!loadingIconColor){
        loadingIconColor = '#000000';
    }

    return (
        <div ref={container} className="pbo-w-full pbo-h-full pbo-flex pbo-flex-col">
            <div className="pbo-w-full pbo-flex-grow pbo-flex pbo-flex-col pbo-overflow-y-hidden pbo-overflow-x-hidden">
                {/* ヘッダ */}
                <div ref={headerBlock} className="pbo-w-full pbo-flex-none" style={{height: headerHeight + "px"}}>
                    <div ref={headerInnerBlock} className="pbo-w-full pbo-absolute pbo-flex">
                        {columns.map((col, idx) => {
                            let headerAlign = "pbo-text-center";
                            if (col.align) {
                                switch (col.align) {
                                    case 'left':
                                        headerAlign = "pbo-text-left";
                                        break;
                                    case 'right':
                                        headerAlign = "pbo-text-right";
                                        break;    
                                }
                            }
                            let cursor: string = "";
                            // ソート可能列はマウスカーソルをポインタに変更
                            if (col.sortable) {
                                cursor = "pbo-cursor-pointer";
                            }
                            return (
                                <div key={idx} className={"pbo-relative pbo-flex-none pbo-px-4 pbo-py-2 pbo-border-b-2 pbo-border-gray-200 pbo-bg-gray-100 " + cursor} style={{width: col.width}} onClick={() => handleColHeaderClick(idx)}>
                                    <p className={"pbo-font-semibold " + headerAlign} style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{col.header}</p>

                                    {col.sortable && sort && sort.column == idx &&
                                        <div className="pbo-absolute pbo-right-0" style={{top: ((headerHeight - sortIconHeight) / 2) + "px"}}>
                                            <TableSortLabel sort={true} direction={sort.direction} />
                                        </div>
                                    }
                                </div>);
                        })}
                    </div>
                </div>

                {/* ボディ */}
                {/* ローディング中表示 */}
                {isLoading &&
                    <div className="pbo-absolute pbo-w-full pbo-h-full pbo-flex pbo-justify-center pbo-items-center pbo-bg-gray-100 pbo-opacity-70 pbo-z-10">
                        <div className="pbo-w-auto pbo-h-10 pbo-px-4 pbo-py-2">
                            <LoadingIcon size={25} color={loadingIconColor}/>
                        </div>
                    </div>
                }
                <div ref={bodyBlock} className="pbo-w-full pbo-flex-grow pbo-overflow-y-auto pbo-overflow-x-auto pbo-bg-white" style={{height: "100px"}} onScroll={handleScroll}>
                    <table className="pbo-table-fixed pbo-w-full">
                        <tbody ref={tableBodySection}>
                            {rows.map((row, rowIdx) => {
                                return (
                                    <tr key={rowIdx}>
                                        {row.cells.map((cell, colIdx) => {
                                            let cellWidth: string;
                                            if (rowIdx == 0 && columns[colIdx]) {
                                                cellWidth = columns[colIdx].width;
                                            }
                                            return (<td key={rowIdx + "_" + colIdx} align={cell.align} className="pbo-px-4 pbo-py-2 pbo-border-b pbo-border-gray-200" style={{width: cellWidth, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{cell.component}</td>);
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* フッター */}
            <div ref={footerBlock} className="pbo-w-full pbo-flex-none">
                <PaginationFooter count={pageCount} align={'center'} page={currentPage} boundaryCount={2} onChange={handlePageChange} />
            </div>
        </div>
    );
};
