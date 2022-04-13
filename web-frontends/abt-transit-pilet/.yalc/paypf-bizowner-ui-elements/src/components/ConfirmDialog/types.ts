import { ReactNode } from 'react';

export type ConfirmDialogButtonLabelProps = {
    // Yesボタンのラベル
    yes: string;
    // Noボタンのラベル
    no: string;
}

export type ConfirmDialogProps = {
    /**
     * 確認ダイアログのタイトル
     */
    title :string;

    /**
     * ボタンのラベル
     */
    label: ConfirmDialogButtonLabelProps;

    /**
     * Yes時イベント
     */
    onYes: () => void;
    
    /**
     * No時のクリックイベント
     */
    onNo: () => void;
    
    /**
     * ダイアログを閉じるイベント 
     */ 
    onClose: () => void;

    /**
     * trueにした場合Yesボタンにローディングアイコンを表示するとともにボタンをdisableにします。
     */
    isLoading?: boolean;
}