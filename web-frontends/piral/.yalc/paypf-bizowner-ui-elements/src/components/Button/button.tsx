import * as React from 'react';
import { ButtonProps } from './types';

const styles = {
  button: "disabled:pbo-opacity-75 pbo-px-4 pbo-py-2 pbo-rounded pbo-text-sm pbo-font-medium pbo-transition pbo-text-gray-600 pbo-flex pbo-items-center pbo-justify-center",
  buttonEnabled: "focus:pbo-outline-none focus:pbo-ring focus:pbo-ring-gray-300 hover:pbo-bg-gray-50 active:pbo-bg-gray-100",
  reset: "disabled:pbo-opacity-75 pbo-px-4 pbo-py-2 pbo-rounded pbo-text-sm pbo-font-medium pbo-border pbo-transition pbo-text-gray-600 pbo-border-gray-600 pbo-flex pbo-items-center pbo-justify-center",
  resetEnabled: "focus:pbo-outline-none focus:pbo-ring focus:pbo-ring-gray-300 hover:pbo-text-white hover:pbo-bg-gray-600 active:pbo-bg-gray-700",
  submit: "disabled:pbo-opacity-75 pbo-px-4 pbo-py-2 pbo-rounded pbo-text-sm pbo-font-medium pbo-transition pbo-text-white pbo-bg-blue-500 pbo-border-0 pbo-flex pbo-items-center pbo-justify-center",
  submitEnabled: "focus:pbo-outline-none focus:pbo-ring focus:pbo-ring-blue-300 hover:pbo-bg-blue-600 active:pbo-bg-blue-700"
}

export const Button: React.FC<ButtonProps> = ({ icon, wSize, disabled, contentMarginLeft, contentMarginRight, contentMarginTop, contentMarginBottom, ...props }) => {

  var clazz = styles.button;
  if (disabled != true) {
    clazz += " " + styles.buttonEnabled;
  }

  // 指定できるpropsのみ取り出す
  const {className, style, ...rest} = props;  

  if (props.type) {
    switch (props.type) {
      case 'submit':
        clazz = styles.submit;
        if (disabled != true) {
          clazz += " " + styles.submitEnabled;
        }
        break;
      case 'reset':
        clazz = styles.reset;
        if (disabled != true) {
          clazz += " " + styles.resetEnabled;
        }
        break;
    }
  }

  var width = "pbo-w-32";
  if (wSize) {
    switch (wSize) {
      case 'auto' :
        width = 'pbo-w-auto';
        break;
      case 'xs' :
          width = 'pbo-w-20';
          break;
      case 'sm' :
        width = 'pbo-w-24';
        break;
      case 'lg' :
          width = 'pbo-w-40';
          break;
      }
  }
  clazz = clazz + " " + width;

  if (icon) {
    clazz = clazz + " pbo-inline-flex";
  }

  let customStyle = {
    opacity: disabled == true ? "50%" : "100%"
  };

  // テキスト部のマージン
  var contentMargin = {
    marginLeft: contentMarginLeft ?? "0px",
    marginRight: contentMarginRight ?? "0px",
    marginTop: contentMarginTop ?? "0px",
    marginBottom: contentMarginBottom?? "0px",
  }; 
  if (icon) {
    // アイコン付きの場合は左マージンを設定
    contentMargin.marginLeft = contentMarginLeft ?? "0.375rem";
  }

  return (
    <button className={clazz} style={customStyle} disabled={disabled} {...rest}>
      {icon}
      <span style={{marginLeft: contentMargin.marginLeft, marginRight: contentMargin.marginRight, marginBottom: contentMargin.marginBottom, marginTop: contentMargin.marginTop}}>
        {props.children}
      </span>
    </button>
  );  
};
