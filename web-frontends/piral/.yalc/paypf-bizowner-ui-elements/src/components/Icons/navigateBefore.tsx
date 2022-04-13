import * as React from 'react';
import { IconProps } from './types';

export const NavigateBefore: React.FC<IconProps> = (props) => {
  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size ?? "24"}
    height={props.size ?? "24"}
    viewBox={"0 0 24 24"} 
    fill={props.color || "currentColor"}
    >
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z"/>
    </svg>
   
  )
}