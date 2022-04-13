import * as React from 'react';
import { IconProps } from './types';

export const Search: React.FC<IconProps> = (props) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={props.size ?? "24"}
        height={props.size ?? "24"}
        viewBox={"0 0 24 24"}>
        <title>Search</title>
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            fill="none" 
            stroke={props.color || "currentColor"} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"/>
    </svg>
  )
}
