import * as React from 'react';
import { IconProps } from './types';

export const Plus: React.FC<IconProps> = (props) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ?? "24"}
        height={props.size ?? "24"}
        viewBox={"0 0 20 20"}>
        <title>Plus</title>
        <path d="M13,4V22m9-9H4" 
            fill="none" 
            stroke={props.color || "currentColor"} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"
            transform="translate(-3 -3)"/>
    </svg>
  )
}
