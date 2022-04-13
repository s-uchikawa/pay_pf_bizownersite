export type TextareaProps = JSX.IntrinsicElements['textarea'] & {
    id:string;
    name?:string;
    label?: string;
    formik?: any;
    rows?: number;
    value?: string;
    disabled?: boolean;
};