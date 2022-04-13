
export type SwitchProps = {
    /**
     * 要素のID
     */
    id: string;

    /**
     * 要素のname
     */
    name?: string;

    checked?: boolean;
    onChange?: (checked: boolean)=>void;

    /**
     * 利用不可の場合はtrue
     */
    disabled?: boolean;

    /**
     * バリデーションを行うformikインスタンス
     */
     formik?: any;
};