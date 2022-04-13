import * as React from 'react';
import { OptionButtonProps } from './types';
import { DotsHorizontalIcon } from '../Icons';

export const OptionButton: React.FC<OptionButtonProps> = ({ disable, iconSize, items, anchorOrigin, onMenuItemClick, ...props }) => {
  const containerEl = React.useRef<HTMLDivElement>(null);
  const dropdownEl = React.useRef<HTMLDivElement>(null);
  const buttonEl = React.useRef<HTMLDivElement>(null);

  let imgSize = 16;
  if (iconSize) {
    imgSize = iconSize;
  }

  let dropdownMenuItems = [];

  /**
   * クリックされるとドロップダウンメニューを開きフォーカスを移す(フォーカスを移すのでtabindexが必要)
   */
  const handleClick = () => {
    dropdownEl.current.hidden = false;
    dropdownEl.current.style.minWidth = containerEl.current.clientWidth + "px";

    const containerRect: DOMRect = containerEl.current.getBoundingClientRect();
    switch (anchorOrigin) {
      case 'bottom-left':
        dropdownEl.current.style.top = (containerRect.top + containerEl.current.clientHeight) + "px";
        dropdownEl.current.style.left = (containerRect.left) + "px";
        break;
      case 'bottom-right':
        dropdownEl.current.style.top = (containerRect.top + containerEl.current.clientHeight) + "px";
        dropdownEl.current.style.left = (containerRect.left + containerEl.current.clientWidth - dropdownEl.current.clientWidth) + "px";
        break;
    }
    containerEl.current.focus();

    // フォーカスが外れるとドロップダウンメニューを閉じれるようにイベントをリッスン
    window.addEventListener("wheel", handleWheel);
  }

  /**
   * マウスホイール時にメニューを非表示にする
   */
  const handleWheel = (ev: WheelEvent) => {
    closeDropdownMenu();
  }

  /**
   * フォーカスが外れるとドロップダウンメニューを閉じる
   */
  const handleContainerBlur = () => {
    closeDropdownMenu();
  }

  /**
   * ドロップダウンメニュー項目クリック時
   */
   const handleMenuItemClick = (menuItemId) => {
    closeDropdownMenu();

    if (onMenuItemClick) {
      onMenuItemClick(menuItemId);
    }
  }

  /**
   * ドロップダウンメニューを閉じる
   */
  const closeDropdownMenu = () => {
    dropdownEl.current.hidden = true;
    window.removeEventListener("wheel", handleWheel)
  }

  // ドロップダウンメニュー項目の作成
  if (items) {
    for (var i = 0; i < items.length; i++) {
      let menuItemId = items[i].id;
      dropdownMenuItems.push(
        <li key={menuItemId} className="pbo-text-gray-700 pbo-block pbo-px-4 pbo-py-2 pbo-text-sm pbo-whitespace-nowrap hover:pbo-bg-blue-500 hover:pbo-text-white"
            onClick={() => handleMenuItemClick(menuItemId)}>
              {items[i].label}
        </li>
      )
    }  
  }

  let style = "pbo-px-4 pbo-py-2 pbo-h-full focus:pbo-outline-none pbo-transition pbo-text-gray-600 hover:pbo-bg-gray-50 active:pbo-bg-gray-100 pbo-flex pbo-justify-center pbo-items-center";

  if (disable == true) {
      style += " pbo-pointer-events-none pbo-opacity-60";
  }

  let dropdownClassName = "pbo-fixed pbo-py-1 pbo-z-50 pbo-mt-2 pbo-rounded-md pbo-shadow-lg pbo-bg-white pbo-ring-1 pbo-ring-black pbo-ring-opacity-5 focus:pbo-outline-none";

  return (
    <div ref={containerEl} onBlur={handleContainerBlur} className="pbo-h-full" tabIndex={0}>
      <div ref={buttonEl} onClick={handleClick}
           className={style}>
            <DotsHorizontalIcon size={imgSize} />
      </div>
      <div ref={dropdownEl} hidden={true} className={dropdownClassName}>
        <div className="pbo-py-1">
          <ul onClick={(e) => e.stopPropagation()}>
              {dropdownMenuItems}
          </ul>
        </div>
      </div>
    </div>
  );  
};
