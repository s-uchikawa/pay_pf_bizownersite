import * as React from 'react';

export type OptionButtonMenuItem = {
    id: string;
    label: string;
    disable?: boolean;
};

export type OptionButtonProps = {
    /**
     * 無効化の時、true
     */
    disable?: boolean;

    /**
     * アイコンサイズ
     */
    iconSize?: number

    /**
     * メニューアイテム
     */
    items?: Array<OptionButtonMenuItem>;

    /**
     * ドロップダウンメニューを表示する位置
     */
    anchorOrigin?: 'bottom-left' | 'bottom-right';

    /**
     * メニューアイテムクリック時
     */
    onMenuItemClick?: (id: string) => void;
};
