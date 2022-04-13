import { ReactNode } from "react";

export type AnchorPosition = {
    left: number;
    top: number;
};


export type MenuProps = JSX.IntrinsicElements['menu'] & {
    id: string;
    name?: string;
    
    width?: 'default' | 'auto' | 'full';
    
    /**
     * trueの時Menuが表示される
     */
    open: boolean;

    /**
     * 表示位置を設定するときに参照する位置が決まります。
     */
    anchorReference?: 'anchorEl' | 'anchorPosition' | 'none';

    /**
     * menuの対象となる要素です。anchorReferenceがanchorElの場合に有効です。
     */
     anchorEl?: HTMLElement;

    /**
     * menuの表示位置です。anchorReferenceがanchorPositionの場合に有効です。
     */
    anchorPosition?: AnchorPosition;
};
