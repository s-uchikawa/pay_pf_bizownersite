import * as React from 'react';
import { Button } from '../Button';
import { LoadingIcon } from '../Icons';
import { ConfirmDialogProps } from './types';

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title,  onYes, onNo, onClose, label, isLoading, ...props}) => {
    /**
     * Yesクリックイベント
     */
    const handleYesClick = () => {
        onYes();
    }

    /**
     * Noクリックイベント
     */
    const handleNoClick = () => {
        onNo();
    }
    
    return (
        <div className="pbo-fixed pbo-z-10 pbo-inset-0 pbo-overflow-y-auto">
          <div className="pbo-flex pbo-items-end pbo-justify-center pbo-min-h-screen pbo-pt-4 pbo-px-4 pbo-pb-20 pbo-text-center sm:pbo-block sm:pbo-p-0">
            <div className="pbo-fixed pbo-inset-0 pbo-bg-gray-500 pbo-bg-opacity-75 pbo-transition-opacity"></div>    
            <span className="pbo-hidden sm:pbo-inline-block sm:pbo-align-middle sm:pbo-h-screen">&#8203;</span>
            <div className="pbo-inline-block pbo-align-bottom pbo-bg-white pbo-rounded-lg pbo-text-left pbo-overflow-hidden pbo-shadow-xl pbo-transform pbo-transition-all sm:pbo-my-8 sm:pbo-align-middle sm:pbo-max-w-lg sm:pbo-w-full">
              <div className="pbo-bg-white pbo-px-4 pbo-pt-5 pbo-pb-4 sm:pbo-p-6 sm:pbo-pb-4">
                <div className="sm:pbo-flex sm:pbo-items-start">
                  <div className="pbo-mx-auto pbo-flex-shrink-0 pbo-flex pbo-items-center pbo-justify-center pbo-h-12 pbo-w-12 pbo-rounded-full pbo-bg-red-100 sm:pbo-mx-0 sm:pbo-h-10 sm:pbo-w-10">
                    <svg className="pbo-h-6 pbo-w-6 pbo-text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="pbo-mt-3 pbo-text-center sm:pbo-mt-0 sm:pbo-ml-4 sm:pbo-text-left">
                    <h3 className="pbo-text-lg pbo-leading-6 pbo-font-medium pbo-text-gray-900" id="modal-title">
                      {title}
                    </h3>
                    <div className="pbo-mt-2">
                      <p className="pbo-text-sm pbo-text-gray-500">
                          {props.children}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pbo-bg-gray-50 pbo-px-4 pbo-py-3 sm:pbo-px-6 sm:pbo-flex sm:pbo-flex-row-reverse">
                <Button type={'button'} disabled={isLoading} icon={isLoading && <LoadingIcon />} onClick={() => handleNoClick()}>{label?.no ?? "No"}</Button>
                <Button type={'submit'} disabled={isLoading} icon={isLoading && <LoadingIcon />} onClick={() => handleYesClick()}>{label?.yes ?? "Yes"}</Button>
              </div>
            </div>
          </div>
        </div>
    )
}