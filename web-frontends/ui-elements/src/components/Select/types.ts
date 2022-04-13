import { ReactNode } from "react";

export type SelectProps = JSX.IntrinsicElements['select'] & {
    id: string;
    name?: string;
    label?: string;
    wSize?: string;
    defaultValue?: string | number;
    value?: string | number;
    formik?: any;

    /**
     * 利用不可の場合はtrue
     */
     disabled?: boolean;

    /**
     * アイテムを選択した時のアクション
     */
     onChange?: (value: string | number) => void
}