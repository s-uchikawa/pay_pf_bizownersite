import * as React from 'react';
import { placeIconAtras, placeIconMapping } from '../../../assets'

/**
 * 地点アイコンコンポーネントのProps
 */
export interface PlaceIconSelectProps {
  // HTML要素のID
  id: string;
  // ラベル
  label: string;
  // アイコンID
  value?: number;
  // Formik
  formik?: any;
  // 空を許容するかどうか
  allowEmpty? : boolean;
  // 入力不可状態にする場合true
  disabled?: boolean;
  // z-index
  zIndex?: number;
  // 変更イベント
  onChange?: (value: number) => void;
}

/**
 * 地点アイコン選択コンポーネント
 */
export const PlaceIconSelect: React.FC<PlaceIconSelectProps> = ({ id, label, value, allowEmpty, disabled, formik, zIndex, onChange }) => {  
  // valueが指定されておらずformikが指定されている場合はformikから値を取り出す
  let formikValue: number = null;
  if (formik) {
    formikValue = formik.values[id];
  }
  const selectedValue = value ?? formikValue;

  var error: Boolean = false;
  var errorMsg;

  const containerEl = React.useRef<HTMLDivElement>(null);
  const dropdownEl = React.useRef<HTMLUListElement>(null);

  let items = [];
  var iconCount = Object.keys(placeIconMapping).length
  let selectedIconMapping: any;

  /**
   * クリックされるとドロップダウンメニューを開きフォーカスを移す(フォーカスを移すのでtabindexが必要)
   */
  const handleClick = () => {
    if (disabled == true) {
      return;
    }
    dropdownEl.current.hidden = false;
    dropdownEl.current.style.width = containerEl.current.clientWidth + "px";
    if (zIndex) {
      dropdownEl.current.style.zIndex = zIndex + "";
    }
    containerEl.current.focus();
  }

  /**
   * フォーカスが外れるとドロップダウンメニューを閉じる
   */
  const handleContainerBlur = () => {
    dropdownEl.current.hidden = true;
  }

  /**
   * ドロップダウンメニュー項目クリック時
   */
  const handleMenuItemClick = (iconId) => {
    dropdownEl.current.hidden = true;

    if (formik) {
      formik.setFieldValue(id, iconId);
    }

    if (onChange) {
      onChange(iconId);
    }
  }

  // ドロップダウンメニュー項目の作成
  if (allowEmpty == true) {
    items.push(
      <li key={"place-icon-0"} className="mpp-px-2 hover:mpp-bg-blue-500"
          onClick={() => handleMenuItemClick(null)}>
        <div style={{ width: "32px", height: "32px"}}></div>
      </li>
    )
  }

  for (var i = 0; i < iconCount; i++) {
    let iconId = i + 1;
    let iconMapping = placeIconMapping["marker-" + iconId];
    items.push(
      <li key={"place-icon-" + iconId} className="mpp-px-2 hover:mpp-bg-blue-500" style={{height: "48px"}}
          onClick={() => handleMenuItemClick(iconId)}>
        <div style={{width: "64px", height: "64px", transform: "scale(0.5, 0.5)  translate(-32px, -16px)"}}>
          <img src={placeIconAtras}
            style={{ 
              width: iconMapping.width + "px", 
              height: iconMapping.height + "px", 
              objectFit: "none", 
              objectPosition: (iconMapping.x * -1) + "px" + " " + (iconMapping.y * -1) + "px" 
            }} />
        </div>
      </li>
    )
    if (iconId == selectedValue) {
      selectedIconMapping = iconMapping;
    }
  }

  return (
    <div className="mpp-space-y-2" style={{zIndex: zIndex}}>
      { label ? <label htmlFor={id} className="mpp-text-gray-700 mpp-text-left mpp-text-lg mpp-select-none mpp-font-medium">{label}</label> : <></> }

      <div ref={containerEl} className="mpp-relative" onBlur={handleContainerBlur} tabIndex={0}>
        <div style={{height: "42px"}} onClick={handleClick}
            className={"mpp-flex mpp-items-center mpp-border mpp-border-gray-300 focus:mpp-outline-none focus:mpp-ring-2 focus:mpp-ring-offset-gray-100 focus:mpp-ring-indigo-300 " + (disabled == true ? "mpp-bg-gray-100" : "mpp-bg-white")}>
          <div className="mpp-flex-grow mpp-px-2">

            { selectedIconMapping &&  
                <div style={{width: "64px", height: "64px", transform: "scale(0.5, 0.5) translate(-32px)"}}>
                  <img src={placeIconAtras} 
                      style={{ 
                        width: selectedIconMapping.width + "px", 
                        height: selectedIconMapping.height + "px", 
                        objectFit: "none", 
                        objectPosition: (selectedIconMapping.x * -1) + "px" + " " + (selectedIconMapping.y * -1) + "px"}} />
                </div>}
          </div>

          <div>
            <svg className="mpp-h-5 mpp-w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {error ? (
            <p className="mpp-text-left mpp-text-red-500 mpp-text-base mpp-font-medium mpp-italic">{errorMsg}</p>
          ) : null}

        <ul ref={dropdownEl} hidden={true} onClick={(e) => e.stopPropagation()}
            className="mpp-absolute mpp-bg-white mpp-border mpp-border-gray-300 mpp-overflow-y-auto mpp-h-60">
            {items}
        </ul>
      </div>
    </div>
  );
}