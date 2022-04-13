import * as React from 'react';
import { ProgressProps } from './types';

const styles = {
    base:"pbo-flex pbo-flex-col pbo-px-4 pbo-py-4 pbo-m-0-auto ",
    left:"pbo-text-left ",
    right:"pbo-text-right ",
    center:"pbo-text-center ",
    orderTop:"pbo-order-1 ",
    orderBottom:"pbo-order-2 ",
    half:"pbo-w-6/12 ",
    quarter:"pbo-w-3/12 ",
};

const Progress: React.FC<ProgressProps> = ({
  percent,
  text,
  size,
  horizontalTextLayout,
  verticalTextLayout,
}) => {
    var style = styles.base;  
    if(horizontalTextLayout){
        switch(horizontalTextLayout){
            case 'left':
                style += styles.left;
                break;
            case 'right':
                style += styles.right;
                break;
            case 'center':
                style += styles.center;
                break;
            default:
                style += styles.left;
                break;
        };
    }
    else{
        style += styles.left;
    }
    
    var styleProgress = "pbo-relative ";  
    var stylelabel = "";  
    if(verticalTextLayout){
        switch(verticalTextLayout){
            case 'top':
                stylelabel += styles.orderTop;
                styleProgress += styles.orderBottom;
                break;
            case 'bottom':
                stylelabel += styles.orderBottom;
                styleProgress += styles.orderTop;
                break;
            default:
                stylelabel += styles.orderTop;
                styleProgress += styles.orderBottom;
                break;
        };
    }
    else{
        stylelabel += styles.orderTop;
        styleProgress += styles.orderBottom;
    }
    
    if(size){
        switch(size){
            case 'half':
                style += styles.half;
                break;
            case 'quarter':
                style += styles.quarter;
                break;
            default:
                break;
        };
    }
        
    return (
        <div className={style}>
            <span className={stylelabel}>
                {text}{percent}%
            </span>
            <div className={styleProgress}>
                <div className="pbo-overflow-hidden pbo-h-2 pbo-text-xs pbo-flex pbo-rounded pbo-bg-gray-500">
                    <div style={{ width: percent + '%' }} className='pbo-shadow-none pbo-flex pbo-flex-col pbo-text-center pbo-whitespace-nowrap pbo-text-white pbo-justify-center pbo-bg-blue-500'></div>
                </div>
            </div>
        </div>
    );
};

Progress.displayName = 'Progress';

export default Progress;