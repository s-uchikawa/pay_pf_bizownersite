import * as React from 'react';
import { MessageIds } from '../../../messages';
import { Input } from 'paypf-bizowner-ui-elements'
import { PlaceFilterState } from '../../../models/place-types'
import { PlaceCategory } from '../../../models/mloca-bff-types'
import { Region } from '../../../models/types'
import { PlaceCategorySelect } from '../elements/place-category-select';
import { PlaceIconSelect } from '../elements/place-icon-select';

export interface PlacePartsFilterFormProps {
  // 表示するデータ
  data: PlaceFilterState;
  // リージョン(jp or us)
  region: Region;
  // 多言語変換
  translate(key: MessageIds): string;
  // 地点カテゴリの一覧
  categories: PlaceCategory[];
  // 入力不可状態にする場合true
  disabled?: boolean;
  //  入力値が変更されたことを親コンポーネントに伝えるためのイベント
  onChange?: (newValue: PlaceFilterState) => void;
}

export const PlacePartsFilterForm: React.FC<PlacePartsFilterFormProps> = ({
    translate,
    data,
    categories,
    region,
    disabled,
    onChange
}) => {

    /**
     * 入力値が変更されたときの処理
     * @param newValue 変更後の値
     */
    const handleChange = (newValue: PlaceFilterState) => {
      if (onChange) {
        onChange(newValue);
      }
    }

    // データがNULLの場合初期値を設定
    if (data == undefined) {
      data = {
        address: "",
        categoryID: null,
        iconID: null,
        name: "",
      }
    }
    
    return (
      <div className="mpp-space-y-5">
        <div>{}</div>
        <PlaceCategorySelect 
          id="categoryId" 
          label={translate(MessageIds.labelCategory)} 
          data={categories} allowEmpty={true} 
          value={data.categoryID} disabled={disabled}
          onChange={(newValue) => handleChange({...data, categoryID: newValue})} />
        <Input id="name" label={translate(MessageIds.labelName)} type="text" 
          value={data?.name} disabled={disabled}
          onChange={(e) => handleChange({...data, name: e.target.value})}  />
        <PlaceIconSelect id="iconId" label={translate(MessageIds.labelIcon)} 
          value={data?.iconID} allowEmpty={true} disabled={disabled}
          onChange={(newValue) => handleChange({...data, iconID: newValue})} />
        <Input id="address" label={translate(MessageIds.labelAddress)} type="text" 
          value={data?.address} disabled={disabled}
          onChange={(e) => handleChange({...data, address: e.target.value})} />
        {/* <div className="flex space-x-2">
            <div className="flex-none">
                <Input id="geofenceDistance" 
                  label={translate(MessageIds.labelEntryExitJudgment)} 
                  type="number" min={0}
                  value={data?.geofenceDistance ?? ""} disabled={disabled}
                  onChange={(e) => handleChange({...data, geofenceDistance: e.target.value == "" ? null : parseInt(e.target.value)})} />
            </div>
            <div className="flex items-end">
                <label>{region == 'us' ? 'ft' : 'm'}</label>
            </div>
        </div> */}
      </div>
);
}