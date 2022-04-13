import * as React from 'react';
import { TableBodyProps } from './types';

const styles = {
    default: "pbo-table-row-group"
} 

export const TableBody: React.FC<TableBodyProps>=({ ...props }) =>{
  var style = styles.default;  
  const {
    children,
    className,
    ...other
  } = props;

  return (
    <tbody className={style} 
       {...other}
    >
        {props.children}
    </tbody>
  );
};
