import * as React from 'react';
import { MenuProps } from './types';

const styles = {
  default   : "pbo-bg-white pbo-w-40     pbo-border pbo-border-gray-500 pbo-z-50",
  auto      : "pbo-bg-white pbo-w-auto   pbo-border pbo-border-gray-500 pbo-z-50",
  full      : "pbo-bg-white pbo-w-full   pbo-border pbo-border-gray-500 pbo-z-50",
} 

const Menu: React.FC<MenuProps> = ({ id, name, width, open, anchorReference, anchorEl, anchorPosition, ...props }) => {
  var style = styles.default;  
  var inlinestyle = null;

  if (width) {
    switch (width) {
      case 'auto':
        style = styles.auto;
        break;
      case 'full':
        style = styles.full;
        break;
    }
  }

  if (anchorReference && anchorReference == 'anchorEl' && anchorEl) {
      var offset = {
        top: anchorEl.offsetTop,
        left: anchorEl.offsetLeft,
        height: anchorEl.clientHeight,
        width: anchorEl.clientWidth
      };
      style = style + " pbo-absolute";
      
      var left = offset.left;
      var top = offset.top + offset.height;
     
      inlinestyle = { top: top + "px", left:  (left) + "px" }
  }
  if (anchorReference && anchorReference == 'anchorPosition' && anchorPosition) {
    style = style + " pbo-absolute";   
    inlinestyle = { top: anchorPosition.top + "px", left:  anchorPosition.left + "px" }
  }

  const {className, children, ...rest} = props;  

  if (open){
    return (
        <div className={style} id={id} style={inlinestyle}>
          {props.children}
        </div>
    );
  } else {
      return null;
  }
};

export { Menu };