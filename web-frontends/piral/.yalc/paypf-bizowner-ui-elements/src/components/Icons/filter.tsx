import * as React from 'react';
import { IconProps } from './types';

export const Filter: React.FC<IconProps> = (props) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ?? "24"}
        height={props.size ?? "24"}
        viewBox={"0 0 20 20"}>
        <title>Filter</title>
        <path d="M3,4A1,1,0,0,1,4,3H20a1,1,0,0,1,1,1V6.586a1,1,0,0,1-.293.707l-6.414,6.414a1,1,0,0,0-.293.707V17l-4,4V14.414a1,1,0,0,0-.293-.707L3.293,7.293A1,1,0,0,1,3,6.586Z" 
            fill={props.fillColor || "none"} 
            transform="translate(-2 -2)" 
            stroke={props.color || "currentColor"} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"/>
    </svg>
  )
}