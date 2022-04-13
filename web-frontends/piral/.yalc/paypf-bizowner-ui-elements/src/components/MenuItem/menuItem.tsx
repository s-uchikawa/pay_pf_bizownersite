import * as React from 'react';
import { MenuItemProps } from './types';
import { useField, useFormikContext, FieldInputProps, FieldMetaProps, connect } from "formik";

const styles = {
  default   : "pbo-w-full pbo-text-left pbo-px-4 pbo-py-2 pbo-block pbo-cursor-pointer hover:pbo-bg-gray-200 focus:pbo-bg-gray-200",
  selected   : "pbo-w-full pbo-text-left pbo-px-4 pbo-py-2 pbo-block pbo-cursor-pointer pbo-bg-blue-100 hover:pbo-bg-blue-200 focus:pbo-bg-blue-200",
} 

export const MenuItem: React.FC<MenuItemProps> = ({ id, name, value, selected, icon, onClick, ...props }) => {
  var style = styles.default;  

  var error: Boolean = false;

  if (selected){
    style = styles.selected; 
  }

  if (icon) {
    style = style + " pbo-inline-flex";
  }

  const handleClick = (event: React.MouseEvent) => {
    if (event.target instanceof HTMLSpanElement) {
      onClick(event.currentTarget.parentElement);
    }

    if (event.target instanceof HTMLButtonElement) {
      onClick(event.currentTarget);
   }
  }

  return (
    <button className={style} name={name} id={id} value={value} onClick={(event) => handleClick(event)}>
      {icon && <span className="pbo-mr-1.5">{icon}</span>}
      <span>{props.children}</span>
    </button>
  ); 

};