import * as React from 'react';
import { TableRowProps } from './types';

const styles = {
  default: "pbo-table-row pbo-align-middle pbo-bg-white hover:pbo-bg-gray-300",
  hover_none: "pbo-table-row pbo-align-middle pbo-bg-white"
} 

export const TableRow: React.FC<TableRowProps>=({ hover, ...props }) =>{
  var style = styles.default;  
  const {
    children,
    className,
    ...other
  } = props;

  return (
    <tr className={style} 
       {...other}
    >
        {props.children}
    </tr>
  );
};
