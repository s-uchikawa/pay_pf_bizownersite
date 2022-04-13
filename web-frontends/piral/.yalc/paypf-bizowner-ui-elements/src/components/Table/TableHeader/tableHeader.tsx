import * as React from 'react';
import { TableHeadProps } from './types';

const styles = {
    default: "pbo-table-header-group "
} 

export const TableHead: React.FC<TableHeadProps>=({ ...props }) =>{
  var style = styles.default;  
  const {
    children,
    className,
    ...other
  } = props;

  return (
    <thead className={style} 
       {...other}
    >
        {props.children}
    </thead>
  );
};
