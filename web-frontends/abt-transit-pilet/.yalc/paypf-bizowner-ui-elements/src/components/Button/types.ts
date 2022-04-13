import { ReactNode } from "react";

export type ButtonProps = JSX.IntrinsicElements['button'] & {
    /**
     * アイコン
     */
    icon?: ReactNode;

    /**
     * 幅
     */
    wSize?: 'xs' | 'sm' | 'base'  | 'lg' | 'auto';

    /**
     * 利用不可の場合はtrue
     */
    disabled?: boolean;

    /**
     * テキスト部の左マージン
     */
    contentMarginLeft?: string; 

    /**
     * テキスト部の右マージン
     */
     contentMarginRight?: string; 

    /**
     * テキスト部の上マージン
     */
     contentMarginTop?: string; 

    /**
     * テキスト部の下マージン
     */
     contentMarginBottom?: string; 
};
