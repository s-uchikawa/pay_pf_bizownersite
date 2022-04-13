import * as React from 'react';
import { TextareaProps } from './types';

export const Textarea: React.FC<TextareaProps> = ({ id, name, label, formik, rows, value, disabled, ...props }) => {

    var error: Boolean = false;
    var errorMsg;

    if(formik){
        if (formik.touched[id] && Boolean(formik.errors[id])) {
            error = formik.touched[id] && formik.errors[id];
            errorMsg = formik.errors[id];
        }
    }

    if(!rows){
        rows = 1;
    }

    const {className, onChange, onBlur, ...rest} = props;

    /**
     * 値を変更した時の処理
     */
    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (formik) {
        formik.handleChange(event);
        }
        if (onChange) {
            onChange(event);
        }
    }

    /**
     * 値を変更した時の処理
     */
    const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (formik) {
            formik.handleBlur(event);
        }
        if (onBlur) {
            onBlur(event);
        }
    }    

    // valueが指定されておらずformikが指定されている場合はformikから値を取り出す
    if (value == undefined && formik && formik.values[id] != null) {
        value = formik.values[id] + '';
    }

    return(
        <div className="pbo-flex pbo-flex-col pbo-space-y-2">
            <label className="pbo-text-gray-700 pbo-text-left pbo-text-lg pbo-select-none pbo-font-medium">{label}</label> 
            <textarea rows={rows} id={id} name={name ?? id} disabled={disabled} onChange={handleChange} onBlur={handleBlur} value={value} className="pbo-px-2 pbo-py-2 pbo-border pbo-border-gray-300 focus:pbo-outline-none focus:pbo-ring-2 focus:pbo-ring-gray-200"></textarea>
            {error ? (
                <p className="pbo-text-left pbo-text-red-500 pbo-text-base pbo-font-medium pbo-italic">{errorMsg}</p>
            ) : null}     
        </div>
    );
};