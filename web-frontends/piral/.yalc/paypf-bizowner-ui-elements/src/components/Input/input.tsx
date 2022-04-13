import * as React from 'react';
import { InputProps } from './types';
import { SearchIcon } from '../Icons';

const styles = {
  default: "pbo-px-2 pbo-py-2 pbo-border pbo-border-gray-300 focus:pbo-outline-none focus:pbo-ring-2 focus:pbo-ring-gray-200",
  error: "pbo-px-2 pbo-py-2 pbo-border pbo-border-red-500 pbo-text-red-600 pbo-placeholder-red-600 focus:pbo-outline-none focus:pbo-ring-2 focus:pbo-ring-red-200"
} 

export const Input: React.FC<InputProps> = ({ id, name, label, disabled, formik, formikErrorVisibility, ...props }) => {
  var input;
  var innerInput;
  var error: Boolean = false;
  var errorMsg;
  var icon;
  var withIconStyle;
  var defaultStyle = styles.default;
  var errorStyle = styles.error;

  if (props.type) {
    if (props.type == "search") {
      icon = <SearchIcon />
    }
  }

  if (icon) {
    withIconStyle = " pbo-pl-10 pbo-w-full";
  }

  // 背景色
  if (disabled) {
    defaultStyle += "pbo-bg-gray-100 ";
    errorStyle += "pbo-bg-gray-100 ";
  } else {
    defaultStyle += "pbo-bg-white ";
    errorStyle += "pbo-bg-white ";
  }  

  const {className, onChange, onBlur, autoComplete, value, ...rest} = props;
  
  // オートコンプリートを既定でOFFにする
  let autoCompleteValue: string = autoComplete ?? "off";

  /**
   * 値を変更した時の処理
   */
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event: React.FocusEvent<HTMLInputElement>) => {
      if (formik) {
        formik.handleBlur(event);
      }
      if (onBlur) {
        onBlur(event);
      }
  }
  
  if (formik) {
    if (formik.touched[id] && Boolean(formik.errors[id])) {
      error = formik.touched[id] && formik.errors[id];
      errorMsg = formik.errors[id];
    }
    var style = (error ? errorStyle : defaultStyle) + withIconStyle;
    innerInput = <input id={id} name={name ?? id} className={style} disabled={disabled} autoComplete={autoCompleteValue} onChange={handleChange} onBlur={handleBlur} value={formik.values[id]} {...rest} />;
  } else {
    var style = (error ? errorStyle : defaultStyle) + withIconStyle;
    innerInput = <input id={id} name={name ?? id} className={style} disabled={disabled} autoComplete={autoCompleteValue} onChange={handleChange} onBlur={handleBlur} value={value} {...rest} />;  
  }

  if (icon) {
    input = (
      <div className="pbo-relative">
        {innerInput}
        <span className="pbo-absolute pbo-inset-y-0 pbo-left-0 flex pbo-items-center pbo-pl-2">
          {icon}
        </span>        
      </div>
    );
  } else {
    input = innerInput;
  }

  // formikのバリデーションエラーメッセージは既定で表示
  if (formikErrorVisibility == null) {
    formikErrorVisibility = 'visible';
  }

  return (
    <div className="pbo-flex pbo-flex-col pbo-space-y-2">
      { label ? <label htmlFor={id} className="pbo-text-gray-700 pbo-text-left pbo-text-lg pbo-select-none pbo-font-medium">{label}</label> : <></> }

      {input}
      
      {error && formikErrorVisibility == 'visible' ? (
          <p className="pbo-text-left pbo-text-red-500 pbo-text-base pbo-font-medium pbo-italic">{errorMsg}</p>
      ) : null}
    </div>
  );
};
