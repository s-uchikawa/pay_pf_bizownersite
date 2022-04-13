import * as React from 'react';
import { IconProps } from './types';

export const DotsHorizontal: React.FC<IconProps> = (props) => {
  return (
    <svg
      width={props.size ?? "24"}
      height={props.size ?? "24"}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z">
        </path>
    </svg>
  )
}

