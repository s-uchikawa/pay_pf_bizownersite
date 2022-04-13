import * as React from 'react';
import { IconProps } from './types';

export const Download: React.FC<IconProps> = (props) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ?? "24"}
        height={props.size ?? "24"}
        viewBox={"0 0 20 20"}>
        <title>Download</title>
        <path d="M4,17.5v1.125A3.375,3.375,0,0,0,7.375,22h11.25A3.375,3.375,0,0,0,22,18.625V17.5M17.5,13,13,17.5m0,0L8.5,13M13,17.5V4" 
            fill="none" 
            stroke={props.color || "currentColor"} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"
            transform="translate(-3 -3)"/>
    </svg>
  )
}

