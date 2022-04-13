import * as React from 'react';
import { PaginationFooterProps } from './types';
import { NavigateBeforeIcon,NavigateNextIcon } from '../../Icons';

const styles = {
  defaultnav: "pbo-flex pbo-items-center pbo-list-none pbo-p-4 pbo-bg-white ",
  defaultul: "pbo-flex pbo-text-center pbo-items-center pbo-list-none ",
  item: "pbo-inline-flex pbo-items-center pbo-justify-center pbo-relative pbo-align-middle pbo-border pbo-border-gray-200 pbo-h-8 pbo-w-8 pbo-rounded pbo-mr-2",
  ellipsis: "pbo-inline-flex pbo-items-center pbo-justify-center pbo-relative pbo-align-middle pbo-h-8 pbo-w-8"
} 

export const PaginationFooter : React.FC<PaginationFooterProps>=({  ...props }) =>{
  const {
    children,
    boundaryCount = 1,
    count = 1,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page: page,
    align: align,
    ...other
  } = props;
  

  // const [page, setPageState] = React.useState(1); // 規定値：1
  // if (pageProp){
  //   setPageState(() => pageProp)
  // }

  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const siblingCount = 1;
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(
      page - siblingCount,
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      page + siblingCount,
      boundaryCount + siblingCount * 2 + 2,
    ),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  const itemList = [
    ...(hidePrevButton ? [] : ['previous']),
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis']
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['end-ellipsis']
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),

    ...endPages,
    ...(hideNextButton ? [] : ['next']),
  ];


  const items = itemList.map((item) => {
    var itemStyle = styles.item;  

    if(typeof item === 'number')
    {
      if (item == page){
        itemStyle = itemStyle + " pbo-bg-gray-100"
      }
      return (
      <li key={'page' + item}>
        <button className={itemStyle} onClick={(event) => { handleClick(event,item) }}>{item}</button>
      </li>
      )
    } 
    else if (item.indexOf('ellipsis') > 1){
      var ellipsisStyle = styles.ellipsis;  
      return(
        <li key={'page' + item}>
          <button className={ellipsisStyle} >
            ...
          </button>
        </li>
      )
    }
    else {
      
      var disabled = (item.indexOf('ellipsis') === -1 && (item === 'next' ? page >= count : page <= 1));
      var color = disabled? "#E5E7EB":"#6B7280"
      var icon = item === 'next' ? <NavigateNextIcon color={color}/> : <NavigateBeforeIcon color={color}/> 

      return(
        <li key={'page' + item}>
          <button className={itemStyle} onClick={(event) => { handleClick(event, buttonPage(item)) }}　disabled={disabled} >
            {icon}
          </button>
        </li>
      )
    }
  });

  const handleClick = (target, value) => {
    if (handleChange) {
      handleChange(target, value);
    }
  };

  const buttonPage = (type) => {
    switch (type) {
      case 'first':
        return 1;
      case 'previous':
        return page - 1;
      case 'next':
        return page + 1;
      case 'last':
        return count;
      default:
        return null;
    }
  };


  var style = styles.defaultnav;  
  var styleul = styles.defaultul;  

  switch (align){
    case 'left':
      styleul = styleul + " pbo-mr-auto";
      break;
    case 'right':
      styleul = styleul + " pbo-ml-auto";
      break;
    case 'center':
    default:
      styleul = styleul + " pbo-ml-auto pbo-mr-auto";
      break;
  }

  return (
    <nav className={style} >
      <ul className={styleul} >
        {items}
      </ul>
    </nav>
  );
};
