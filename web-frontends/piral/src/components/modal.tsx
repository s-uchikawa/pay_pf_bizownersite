import { ModalsDialogProps, ModalsHostProps, NotificationsHostProps, NotificationsToastProps } from 'piral';
import * as React from 'react';

/**
 * モーダルダイアログのレイアウト
 */
const ModalDialog: React.FC<ModalsDialogProps> = ({children, options}) => {
    return <div>{children}</div>;
}

/**
 * モーダルダイアログの表示場所
 */
 const ModalDialogHost: React.FC<ModalsHostProps> = ({children, open}) => {
    return open ? (
        <div className="flex z-50 items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-25">
            <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto">
                {children}
            </div>
        </div>
    ) : <></>;    
}

export { ModalDialog, ModalDialogHost };