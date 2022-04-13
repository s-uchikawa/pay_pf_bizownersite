import * as React from 'react';
import { Button } from '../Button';
import { SimpleDialogProps } from './types';

export const SimpleDialog: React.FC<SimpleDialogProps> = ({ title, buttons, onClick, onClose, ...props }) => {
    let buttonElems = [];

    if (buttons) {
        buttons.forEach(btn => {
            buttonElems.push(
                <Button id={btn.id} key={btn.id} type={btn.type ?? 'button'} disabled={btn.disabled ?? false} icon={btn.icon} wSize={btn.wSize} onClick={() => onClick && onClick(btn.id)}>{btn.label}</Button>
            );         
        });
    }

    return (
        <div className="pbo-rounded-lg pbo-border pbo-border-gray-300 pbo-shadow-xl">
            <div className="pbo-flex pbo-flex-row pbo-justify-between pbo-p-6 pbo-bg-white border-b pbo-border-gray-200 pbo-rounded-tl-lg pbo-rounded-tr-lg">
                <p className="pbo-font-semibold pbo-text-gray-800">{title && title}</p>
                <svg onClick={() => onClose && onClose()}
                    className="pbo-w-6 pbo-h-6 pbo-cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
            
            <div className="pbo-flex pbo-flex-col pbo-px-6 pbo-py-5 pbo-bg-gray-50">
                {props.children}
            </div>

            <div className="pbo-flex pbo-flex-row pbo-items-center pbo-justify-end pbo-space-x-4 pbo-p-5 pbo-bg-white pbo-border-t pbo-border-gray-200 pbo-rounded-bl-lg pbo-rounded-br-lg">
                {buttonElems}
            </div>
        </div>
    );
};

