import { ReactNode } from "react";

export type SimpleDialogButton = {
    /**
     * ボタン要素のID
     */
    id: string;

    /**
     * ボタンに表示するラベル
     */
    label: string;
    
    /**
     * ボタンのタイプ
     */
    type?: 'button' | 'submit' | 'reset';

    /**
     * アイコン
     */
    icon?: ReactNode;

     /**
      * 幅
      */
    wSize?: 'xs' | 'sm' | 'base'  | 'lg' | 'auto';
 
     /**
      * button要素のdisabled属性
      */
    disabled?: boolean;
};

export type SimpleDialogProps = {
    title?: string;
    buttons?: Array<SimpleDialogButton>;
    onClick?: (id: string) => void;    
    onClose: () => void;
};
