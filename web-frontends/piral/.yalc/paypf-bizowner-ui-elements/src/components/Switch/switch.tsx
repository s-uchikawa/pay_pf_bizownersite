import * as React from 'react';
import { SwitchProps } from './types';

const styles={
    onBall:"pbo-absolute pbo-left-7 pbo-top-1 pbo-bg-white pbo-w-6 pbo-h-6 pbo-rounded-full pbo-translate-x-full",
    offBall:"pbo-absolute pbo-border-solid pbo-border-1 pbo-left-1 pbo-top-1 pbo-bg-white pbo-w-6 pbo-h-6 pbo-rounded-full",

    onBackground:"pbo-block pbo-w-14 pbo-h-8 pbo-rounded-full pbo-transition pbo-bg-blue-600",
    offBackground:"pbo-block  pbo-bg-gray-300 pbo-w-14 pbo-h-8 pbo-border-solid pbo-border-1 pbo-rounded-full pbo-transition",
} 

export const Switch: React.FC<SwitchProps> = ({ id, name, checked, disabled, formik, onChange, ...props}) => {
    let formikValue : boolean = false;
    if (formik) {
        formikValue = formik.values[id];
    }
    const [isCheckedStyle, setIsCheckedStyle] = React.useState<Boolean>(checked ?? formikValue);

    /**
     * 値を変更した時の処理
     */
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
        let checked: boolean = event.target.checked;

        if (formik) {
            formik.setFieldValue(id, checked);
        }
        if (onChange) {
            onChange(checked);
        }
        if (checked) {
            setIsCheckedStyle(true);
        } else {
            setIsCheckedStyle(false);
        }
    }

    const balls = isCheckedStyle ? styles.onBall : styles.offBall
    const background = isCheckedStyle ? styles.onBackground : styles.offBackground
    
    // valueが指定されておらずformikが指定されている場合はformikから値を取り出す
    if (checked == undefined && formik) {
        checked = formik.values[id];
    }

    return(       
        <div className="pbo-relative">
            <input id={id} name={name ?? id} type="checkbox" className="pbo-sr-only" disabled={disabled} checked={checked} onChange={handleChange}/>                        
            <label className={background} htmlFor={id}></label>
            <div className={balls}></div>
        </div>
    );
};