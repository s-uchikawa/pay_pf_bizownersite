export type InputProps = JSX.IntrinsicElements['input'] & {
    /**
     * input要素のid属性
     */
    id: string;
    /**
     * input要素のname属性
     */
    name?: string;
    /**
     * ラベル
     */
    label?: string;
    /**
     * 利用不可の場合はtrue
     */
     disabled?: boolean;
    /**
     * バリデーションを行うformikインスタンス
     */
    formik?: any;
    /**
     * formikのバリデーションエラーの表示/非表示(既定: visible)
     */
    formikErrorVisibility?: 'visible' | 'hidden';
};
