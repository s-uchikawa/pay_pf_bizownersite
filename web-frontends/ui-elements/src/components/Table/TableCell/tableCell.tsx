import * as React from 'react';
import { TableCellProps, TableHeadCellProps } from './types';

const styles = {
    head: "pbo-table-cell pbo-border-b pbo-border-gray-300 pbo-font-semibold pbo-bg-transparent",
    data: "pbo-table-cell pbo-border-b pbo-border-gray-300 pbo-font-normal pbo-bg-transparent",
} 

const TableCellRoot = (props) => {
  const {
      component,
      className,
      ownerState,
      ref,
      ...other
  } = props;

  var item;
  var style = className;

  switch (ownerState.align){
    case 'center':
      style = style + " pbo-text-center";
      break
    case 'right':
      style = style + " pbo-text-right";
      break
    case 'left':
    default:
      style = style + " pbo-text-left";
      break
  }

  switch (ownerState.padding){
    case 'none':
      style = style + " pbo-p-0";
      break
    case 'normal':
    default:
      style = style + " pbo-p-4";
      break
    }

  switch (component){
    case 'th':
      item = (<th className={style}  {...other}>
        {props.children}
      </th>);
      break;
    case 'td':
      item = (<td  className={style}  {...other}>
        {props.children}
      </td>);
      break;
  }

  return (
   <>
      {item}
    </>
  )
}

type Props = TableCellProps | TableHeadCellProps;

export const TableCell =  React.forwardRef(function TableCell(inProps :Props , ref){
  var style = styles.data;  
  var iconstyle = styles.data;  
  const props = inProps;

  const {
    align,
    className,
    component: componentProp,
    padding: paddingProp,
    sortDirection,
    variant,
    ...other
  } = props;

  const isHeadCell = variant && variant === 'head';
  //const isHeadCell = tablelvl2 && tablelvl2.variant === 'head';
  let component;
  if (componentProp) {
    component = componentProp;
  } else {
    component = isHeadCell ? 'th' : 'td';
  }

  const ownerState = {
    ...props,
    align,
    component,
    padding: paddingProp,
    sortDirection,
    variant,
  };

  
  if (component == 'th' || isHeadCell) {
    style = styles.head;
  } 

  return (
    <TableCellRoot 
      component={component}
      className={style} 
      ref={ref} 
      ownerState={ownerState}
      {...other}
     />
    //     {props.children}
    // </TableCellRoot>
  );
});
