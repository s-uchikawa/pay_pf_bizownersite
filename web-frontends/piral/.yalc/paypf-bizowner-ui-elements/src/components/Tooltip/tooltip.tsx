import * as React from 'react';
import { TooltipProps } from './types';

export const Tooltip: React.FC<TooltipProps> = ({ title, open, position, zIndex, ...props }) => {
    if (!position) {
        position = "relative";
    }

    if (!zIndex) {
        zIndex = 1;
    }

    if (open) {
        return (
            <div style={{position: position, zIndex: zIndex}} 
                 className="pbo-pointer-events-none pbo-bg-white pbo-border-0 pbo-mb-3 pbo-block pbo-font-normal pbo-leading-normal pbo-text-sm pbo-max-w-xs pbo-text-left pbo-no-underline pbo-break-words pbo-rounded-lg">
                <div>
                    <div className="pbo-bg-white pbo-text-gray pbo-opacity-75 pbo-p-3 pbo-mb-0 pbo-border pbo-border-solid pbo-uppercase pbo-rounded">
                        {title}
                    </div>
                </div>
            </div>
        );    
    } else {
        return (<></>);
    }
};