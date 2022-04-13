import * as React from 'react';
import { Select } from 'paypf-bizowner-ui-elements'
import {PlaceCategory} from '../../../models/mloca-bff-types'

/**
 * 地点カテゴリ選択コンポーネントのProps
 */
export interface PlaceCategorySelectProps {
  // HTML要素のID
  id: string;
  // ラベル
  label: string;
  // カテゴリID
  value?: number;
  // 表示するデータ
  data: PlaceCategory[];
  // Formik
  formik?: any;
  // 空を許容するかどうか
  allowEmpty? : boolean;
  // 入力不可状態にする場合true
  disabled?: boolean;
  // 変更イベント
  onChange?: (value?: number) => void;
}

/**
 * 地点カテゴリ選択コンポーネント
 */
export const PlaceCategorySelect: React.FC<PlaceCategorySelectProps> = ({ id, label, value, data, allowEmpty, disabled, formik, onChange }) => {
  let items = [];
  if (allowEmpty == true) {
    if (value == null) {
      items.push(<option key={"-1"} value={null} selected></option>);
    } else {
      items.push(<option key={"-1"} value={null}></option>);
    }
  }

  // valueが指定されておらずformikが指定されている場合はformikから値を取り出す
  if (value == undefined && formik) {
    value = formik.values[id];
  }

  if (data) {
    data.forEach(d => {
      items.push(<option key={d.id} value={d.id}>{d.name}</option>);
    });  
  }

  const handleChange = (newValue?: string) => {
    let val: number = null;

    if (newValue && newValue.length > 0) {
      val = Number(newValue);
    }

    if (formik) {
      formik.setFieldValue(id, val);
    }
    if (onChange) {
        onChange(val);
    }
  }

  return (
    <Select 
      id={id} 
      label={label} 
      defaultValue={value} 
      formik={formik} 
      disabled={disabled} 
      onChange={(e) => handleChange(e.target.value)}>
      
      {items}
    </Select>
  );
}