import * as React from 'react';
import { SelectProps } from './types';

const styles = {
    base:"pbo-px-2 pbo-py-2 focus:pbo-outline-none focus:pbo-ring-2 focus:pbo-ring-offset-gray-100 focus:pbo-ring-indigo-300 ",
    m:"pbo-w-48 pbo-h-9 ",
    s:"pbo-w-24 pbo-h-9 ",
    xs:"pbo-w-12 pbo-h-9 ",
    default: "pbo-border pbo-border-gray-300 ",
    error: "pbo-border pbo-border-red-500 pbo-text-red-600 ",
}


export const Select:React.FC<SelectProps> = ({id, name, label, wSize, defaultValue, disabled, formik, onChange, ...props}) => {
    var style = styles.base;
    var error: Boolean = false;
    var errorMsg;
    var select;

    // 背景色
    if (disabled) {
        style += "pbo-bg-gray-100 ";
    } else {
        style += "pbo-bg-white ";
    }

    if (formik) {
        if (formik.touched[id] && Boolean(formik.errors[id])) {
            error = formik.touched[id] && formik.errors[id];
            errorMsg = formik.errors[id];
          }
    }

    const {className, onBlur, value, ...rest} = props;

    /**
     * 値を変更した時の処理
     */
    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    const handleBlur: React.FocusEventHandler<HTMLSelectElement> = (event: React.FocusEvent<HTMLSelectElement>) => {
        if (formik) {
            formik.handleBlur(event);
        }
        if (onBlur) {
            onBlur(event);
        }
    }

    if(wSize){
        switch(wSize){
            case "m":
                style += styles.m;
                break;
            case "s":
                style += styles.s;
                break;
            case "xs":
                style += styles.xs;
                break;
            default:
                break;
        }
    }
 
    style += (error ? styles.error : styles.default);

    select = <select className={style} id={id} name={name ?? id} defaultValue={defaultValue} onChange={handleChange} onBlur={handleBlur} disabled={disabled} {...rest} >{props.children}</select>; 

    return (
        <div className="pbo-flex pbo-flex-col pbo-space-y-2">
            { label ? <label htmlFor={id} className="pbo-text-gray-700 pbo-text-left pbo-text-lg pbo-select-none pbo-font-medium">{label}</label> : <></> }

            {select}   

            {error ? (
                <p className="pbo-text-left pbo-text-red-500 pbo-text-base pbo-font-medium pbo-italic">{errorMsg}</p>
            ) : null}
        </div>
    )
}