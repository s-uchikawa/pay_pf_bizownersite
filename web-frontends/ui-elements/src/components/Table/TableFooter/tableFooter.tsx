import * as React from 'react';
import { TableFooterProps } from './types';

const styles = {
    default: "pbo-table-footer-group "
} 

export const TableFooter : React.FC<TableFooterProps>=({ ...props }) =>{
  var style = styles.default;  
  const {
    children,
    className,
    ...other
  } = props;

  return (
    <tfoot className={style} 
       {...other}
    >
        {props.children}
    </tfoot>
  );
};
