import * as React from 'react';
import { MessageIds } from '../../messages';
import { SimpleDialog, LoadingIcon } from 'paypf-bizowner-ui-elements'
import { PlaceFilterState } from '../../models/place-types'
import { PlaceCategory } from '../../models/mloca-bff-types'
import { PlacePartsFilterForm } from './parts/filter-form'
import { Region } from '../../models/types'
import { Filter } from '../../actions';

/**
 * 地点絞り込みダイアログコンポーネントのProps
 */
export interface PlaceDialogInfoProps {
  // 表示するデータ
  data: PlaceFilterState;
  // リージョン(jp or us)
  getRegion: () => Promise<Region>,
  // 多言語変換
  translate(key: MessageIds): string;
  // 地点カテゴリの一覧
  categories: PlaceCategory[];
  // 絞り込みアクション
  filter: Filter;
  // 絞り込みアクション処理中かどうか
  isFiltering?: boolean;
  // 閉じる要求を親コンポーネントに伝えるためのイベント
  onClose(): void;  
}

/**
 * 地点絞り込みダイアログコンポーネント
 */
export const PlaceDialogFilter: React.FC<PlaceDialogInfoProps> = ({ getRegion, onClose, translate, data, categories, filter, isFiltering }) => {
  const [region, setRegion] = React.useState<Region>('none');
  const [currentValue, setCurrentValue] = React.useState<PlaceFilterState>(data);
  const [isLoading, setIsLoading] = React.useState<boolean>(isFiltering ?? false);

  React.useEffect(() => {
    if (region == "none") {
      getRegion().then(value => {
        setRegion(value);
      });
    }
  });

  const handleButtonClick = (id: string) => { 
    switch (id) 
    {
      case "clear" :
        setCurrentValue({categoryID: null, name: "", address: "", iconID: null});
        break;
      case "submit" :
        setIsLoading(true);
        // 絞り込みアクション実行
        filter(currentValue, () => {
          setIsLoading(false);
          // 成功時は、ダイアログを閉じる
          onClose();
        }, () => {
          // 失敗時
          setIsLoading(false);
        });
        break;
      case "cancel" :
        onClose();
        break;
      }
  }

  /**
   * 入力値が変更されたときの処理
   * @param newValue 変更後の値
   */
  const handleChange = (newValue: PlaceFilterState) => {
    setCurrentValue(newValue);
  }

  // 処理中は、絞り込みボタンにローディングアニメを表示
  let submitButtonIcon: React.ReactNode = null;
  if (isLoading) {
    submitButtonIcon = <LoadingIcon size={20} />;
  }
  let disabled: boolean = (isLoading == true);

  return (
    <SimpleDialog 
      title={translate(MessageIds.labelFilterDialogTitle)}
      onClose={() => onClose()}
      buttons={[
        { id: "clear", label: translate(MessageIds.labelClear), type: "reset", disabled },
        { id: "submit", label: translate(MessageIds.labelFilter), type: "submit", icon: submitButtonIcon, disabled },
        { id: "cancel", label: translate(MessageIds.labelClose), type: "button" }
      ]}
      onClick={handleButtonClick}>

      <PlacePartsFilterForm data={currentValue} disabled={disabled} categories={categories} translate={translate} region={region} onChange={handleChange} />
    </SimpleDialog>
  );
}