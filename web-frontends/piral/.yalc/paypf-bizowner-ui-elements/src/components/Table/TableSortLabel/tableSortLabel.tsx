import * as React from 'react';
import { TableSortLabelProps } from './types';

const styles = {
  desc: "pbo-inline-flex pbo-transform pbo-right-0",
} 

const TableSortLabelRoot = (props) => {
    const {
        className,
        ownerState,
        ref,
        ...other
    } = props;

    var style = "right-0"

    return (
     <span {...other} className="">
        {ownerState.children}
        {ownerState.sort && ownerState.icon}
        <span ref={ref}/>
      </span>
    )
  }

export const TableSortLabel =  React.forwardRef(function TableSortLabel(inProps :TableSortLabelProps , ref){
  var style = styles.desc;  
  const props = inProps;
 
  const {
    sort = false,
    children,
    className,
    direction = 'asc',
    hideSortIcon = false,
    ...other
  } = props;
  
  if (props.direction == 'asc'){
    style = style + " pbo-rotate-180"
  }
  
  var icon = (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor" 
        className={style}
        >
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M7 10l5 5 5-5H7z"/>
        </svg>
    )

  var iconNone = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor" 
      className={style}
      >
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M7 10l5 5 5-5H7z" fill="none"/>
    </svg>
  )

  const ownerState = {
    ...props,
    sort,
    direction,
    hideSortIcon,
    icon,
    iconNone,
    children
  };

  return (
    <TableSortLabelRoot className={style} 
        ownerState={ownerState}
        ref={ref}
       {...other}
    />
  );
});
