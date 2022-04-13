import { ReactNode } from "react";
import { MenuItem } from './menuItem';

export type MenuItemProps = {
    id: string;
    name?: string;
    value?: string | number;
    selected?: boolean;
     
    /**
     * アイコン
     */
     icon?: ReactNode;

    onClick?: (target) => void
};
