import * as React from 'react';
import { IconProps } from './types';

export const Refresh: React.FC<IconProps> = (props) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ?? "24"}
        height={props.size ?? "24"}
        viewBox={"0 0 20 20"}>
        <title>Refresh</title>
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            fill="none" 
            stroke={props.color || "currentColor"} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"
            transform="translate(-3 -3)"/>
    </svg>
  )
}
