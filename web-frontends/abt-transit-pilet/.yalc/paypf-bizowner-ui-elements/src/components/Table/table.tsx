import * as React from 'react';
import { TableProps } from './types';

const styles = {
  tableContainer: "pbo-overflow-y-auto pbo-border",
  default: "pbo-table pbo-table-fixed pbo-w-full",
} 

export const Table: React.FC<TableProps> = ({ maxWidth, maxHeight, stickyHeader, stickyFooter, overflowX, ...props }) => {
  var style = styles.default;  
  var tableContainerStyle = styles.tableContainer;  

  var inlinestyle = {
    maxWidth:'none',
    maxHeight: 'none',
  };

  if (maxWidth){
    inlinestyle.maxWidth = maxWidth + "px";
  }
  if (maxHeight){
    inlinestyle.maxHeight = maxHeight + "px";
  }
  if (overflowX){
    tableContainerStyle = tableContainerStyle + " pbo-overflow-x-auto";
  }

  if (stickyHeader){
    //style = style + " sticky top-0 left-0 bg-white";
    style = style + " pbo-sticky-header";
  }

  if (stickyFooter){
    //style = style + " sticky top-0 left-0 bg-white";
    style = style + " pbo-sticky-footer";
  }

  return (
    <div style={inlinestyle} className={tableContainerStyle}>
      <table className={style} style={props.style}>
        {props.children}
      </table>
    </div>
  );
};
