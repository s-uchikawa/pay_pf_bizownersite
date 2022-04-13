import * as React from 'react';
import { MessageIds } from '../../messages';
import { PlacePartsInfoForm } from './parts/info-form';
import { PlacePartsInfoMap } from './parts/info-map';
import { PlaceCategory, PlaceDetailInfo } from '../../models/mloca-bff-types';
import { Region } from '../../models/types';
import { CreatePlace, LoadDetail, UpdatePlace } from '../../actions';
import { PlaceInfoState } from '../../models/place-types';

/**
 * 地点情報 表示/編集コンポーネントのProps
 */
export interface PlaceViewInfoProps {
  // 成功や失敗時の通知
  showNotification(type: "info" | "success" | "warning" | "error", title: string, content: any): void,
  // 非表示にする場合true
  hidden?: boolean;
  // 編集可能かどうか
  canEdit: boolean;
  // ジオフェンス機能を夕刻化するかどうか
  geofenceEnabled: boolean;
  // 多言語変換
  translate(key: MessageIds,variable?): string;
  // 地点カテゴリ
  categories: PlaceCategory[];
  // リージョン
  region: Region;
  // 地点ID. nullの場合、新規作成とみなします
  placeId?: number;
  // 新規作成時に使用する初期緯度
  initialLatitude?: number;
  // 新規作成時に使用する初期経度
  initialLongitude?: number;
  // 初期ズーム
  initialZoom?: number;
  // キャンセル時のイベント
  onCancel: () => void;
  // 地点詳細情報のフェッチアクション
  loadDetail: LoadDetail;
  // 地点の新規登録アクション
  createPlace: CreatePlace;
  // 地点情報更新アクション
  updatePlace: UpdatePlace;
}

/**
 * 地点情報 表示/編集コンポーネント
 */
export const PlaceViewInfo: React.FC<PlaceViewInfoProps> = ({ 
  placeId, 
  canEdit, 
  translate, 
  geofenceEnabled, 
  categories, 
  region,
  onCancel, 
  loadDetail, 
  hidden, 
  initialLatitude,
  initialLongitude,
  initialZoom,
  updatePlace, 
  createPlace,
  showNotification
 }) => {

  const [editingData, setEditingData] = React.useState<PlaceInfoState>(null);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isLocationChanged, setIsLocationChanged] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (editingData != null) {
      return;
    }
    console.log("useEffect");
    if (placeId == null) {
      // 新規作成時
      setEditingData({
        id: null,
        email: "",
        name: "",
        nameShort: "",
        nameYomi: "",
        address: "",
        tel: "",
        remarks: "",
        isVisibleOnMap: true,
        latitude: initialLatitude ?? 0,
        longitude: initialLongitude ?? 0,
        iconID: 1,
        categoryID: null,
        useGeofence:false
      });
    } else {
      // データロード
      loadDetail(
        placeId,
        (data: PlaceInfoState) => {
          setEditingData(data);
        }
      )
    }
  });

  /**
   * キャンセル時の処理
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  }

  /**
   * PlacePartsInfoFormでデータが編集されたときのイベント
   * @param editingData 編集中のデータ
   */
  const handleEdit = (editedData: PlaceInfoState) => {
    if(isLocationChanged == false && (!editingData || editingData.longitude != editedData.longitude || editingData.latitude != editedData.latitude)){
      setIsLocationChanged(true);
    }
    let o = Object.assign({}, editedData);
    setEditingData(o);
  }

  if (editingData == null) {
    // ロード中. TBD
    return <></>;
  }

  /**
   * 地点編集保存時のイベント
   * @param placeData 地点情報
   * @param isGeofenceUpdate ジオフェンス情報に更新があるかどうか
   */
  const handleSave = (placeData: PlaceInfoState) => {
    setIsSaving(true);
    if (placeData.id == null) {
      createPlace(placeData, handleSaveSuccess, handleSaveFail);
    } else {
      updatePlace(placeData, handleSaveSuccess, handleSaveFail);
    }
  }

  /**
   * 地点の保存に成功したときのコールバックハンドラ
   * @param savedData 保存された地点情報
   */
  const handleSaveSuccess = (savedData: PlaceInfoState) => {
    setEditingData(savedData);
    showNotification("success", null, translate(MessageIds.labelSuccessSavePlaceNotification))
    setIsSaving(false);
    handleCancel();
  }

  /**
   * 地点の保存に失敗したときのコールバックハンドラ
   * @param savedData 保存された地点情報
   */
   const handleSaveFail = () => {
    setIsSaving(false);
  }


  return (
    <div className={"mpp-h-full mpp-w-full md:mpp-flex" + (hidden ? " mpp-hidden" : "")}>
      <div className="mpp-h-64 md:mpp-h-full mpp-w-full">
        <PlacePartsInfoMap 
          canEdit={canEdit && isSaving == false} 
          translate={translate}           
          initialZoom={initialZoom}
          data={editingData}
          onEdit={handleEdit} />
      </div>
      <div className="md:mpp-h-full mpp-w-auto" style={{minWidth: "40%"}}>
        <PlacePartsInfoForm 
          region={region} 
          canEdit={canEdit && isSaving == false} 
          geofenceEnabled={geofenceEnabled} 
          translate={translate} 
          categories={categories}
          data={editingData} 
          onCancel={handleCancel}
          onEdit={handleEdit} 
          onSave={handleSave}
          isSaving={isSaving} 
          isLocationChanged={isLocationChanged} />
      </div>
    </div>
  );
}