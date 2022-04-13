import * as React from 'react';
import { MessageIds } from '../../../messages';
import { PlaceCategory } from '../../../models/mloca-bff-types'
import { Button, Input, LoadingIcon, Switch, Textarea } from 'paypf-bizowner-ui-elements'
import { Formik, Form, FormikProps } from 'formik';
import {PlaceIconSelect} from '../elements/place-icon-select'
import {PlaceCategorySelect} from '../elements/place-category-select'
import * as Yup from "yup";
import { nameOf } from '../../../nameof';
import { PlaceInfoState } from '../../../models/place-types';


/**
 * 地点情報 表示/編集コンポーネントのProps
 */
 export interface PlacePartsInfoFormProps {
    canEdit: boolean;
    translate(key: MessageIds,variable?): string;
    data: PlaceInfoState;
    region:string;
    // 地点カテゴリ
    categories: PlaceCategory[];
    // ジオフェンス機能を有効化するかどうか
    geofenceEnabled: boolean;
    // 保存処理中の状態にする場合にtrueを設定
    isSaving: boolean;
    // 座標が変わったかどうか
    isLocationChanged: boolean;
    // キャンセル時のイベント
    onCancel: () => void;
    // データを編集したときに発生するイベント
    onEdit?: (editingData: PlaceInfoState) => void;
    // データ保存イベント
    onSave(placeData: PlaceInfoState): void;
  }
  
/**
 * 地点情報 表示/編集フォーム
 */
 export const PlacePartsInfoForm: React.FC<PlacePartsInfoFormProps> = ({ canEdit, translate, geofenceEnabled, data, region, categories, isSaving, isLocationChanged, onCancel, onEdit, onSave }) => {  
      // HTML要素のID(PlaceInfoStateの属性名と同じにする)
      const elIds = {
        name: nameOf((_: PlaceInfoState) => _.name),
        nameShort: nameOf((_: PlaceInfoState) => _.nameShort),
        nameYomi: nameOf((_: PlaceInfoState) => _.nameYomi),
        categoryID: nameOf((_: PlaceInfoState) => _.categoryID),
        iconID: nameOf((_: PlaceInfoState) => _.iconID),
        address: nameOf((_: PlaceInfoState) => _.address),
        email: nameOf((_: PlaceInfoState) => _.email),
        tel: nameOf((_: PlaceInfoState) => _.tel),
        remarks: nameOf((_: PlaceInfoState) => _.remarks),
        isVisibleOnMap: nameOf((_: PlaceInfoState) => _.isVisibleOnMap),
        geofenceDistance: nameOf((_: PlaceInfoState) => _.geofenceDistance),
        useGeofence: nameOf((_: PlaceInfoState) => _.useGeofence),
      };

      // ジオフェンス判定距離の最小値
      const minGeofenceDistanceNum = region == "us" ? 160 : 50;

      /**
       * バリデーションスキーマ
       */
      const validationSchema = Yup.object({
        name: Yup.string().trim()
          .max(30,translate(MessageIds.labelLengthError,{num:30}))
          .required(translate(MessageIds.labelRequiredField)),
        email: Yup.string()
          .nullable()
          .email(translate(MessageIds.labelEmailError))
          .max(250,translate(MessageIds.labelLengthError,{num:250})),
        nameShort:Yup.string()
          .nullable()
          .max(30, translate(MessageIds.labelLengthError,{num:30})),
        nameYomi:Yup.string()
          .nullable()
          .max(60, translate(MessageIds.labelLengthError,{num:60})),
        address:Yup.string()
          .nullable()
          .max(225, translate(MessageIds.labelLengthError,{num:225})),
        geofenceDistance:Yup.number()     
          .min(minGeofenceDistanceNum,translate(MessageIds.labelGeofenceDistanceMinError,{num:minGeofenceDistanceNum}))
          .max(9999,translate(MessageIds.labelGeofenceDistanceMaxError,{num:9999})),
        tel:Yup.string()
          .nullable()
          .matches(/^[0-9]*$/,translate(MessageIds.labelPhonnumError))
          .max(15, translate(MessageIds.labelLengthError,{num:15})),
        remarks:Yup.string()
          .nullable()
          .max(115,translate(MessageIds.labelLengthError,{num:115})),
      });

      /**
       * データ変更時の処理
       */
      const handleChange = (values: PlaceInfoState) => {
        if (onEdit) {
          let o = Object.assign({}, values);
          o.id = data.id;
          o.latitude = data.latitude;
          o.longitude = data.longitude;

          if (o.useGeofence && !o.geofenceDistanceUnit) {
            o.geofenceDistanceUnit = region == "us" ? "ft" : "m";
          }

          onEdit(o);
        }
      }  
      
      /**
       * 入出場イベントの変更時
       * @param value 
       */
      const handleUseGeofenceChange = (formik: FormikProps<PlaceInfoState>, useGeofence: boolean) => {
        let geofenceDistance: number;
        let geofenceDistanceUnit: string;
        
        if (useGeofence) {
          // ジオフェンスの初期値
          if (!formik.values.geofenceDistance) {
            geofenceDistance = region == "us" ? 350 : 100;
            formik.setFieldValue(elIds.geofenceDistance, geofenceDistance)
          }else{
            // 既にセットされてる判定距離をいれる
            geofenceDistance = formik.values[elIds.geofenceDistance];
          }
        }

        handleChange({...formik.values, useGeofence, geofenceDistance})
      }

      /**
       * キャンセル処理
       */
      const handleCancel = () => {
        if (onCancel) {
          onCancel();
        }
      }

      /**
       * 保存処理
       * @param values 
       */
      const handleSubmit = (values: PlaceInfoState) => {
        if (onSave) {
          values.id = data.id;
          values.latitude = data.latitude;
          values.longitude = data.longitude;

          if (values.useGeofence && !values.geofenceDistanceUnit) {
            values.geofenceDistanceUnit = region == "us" ? "ft" : "m";
            if(!values.geofenceDistance){
              values.geofenceDistance = region == "us" ? 350 : 100;
            }
          }
          
          onSave(values);
        }
      };

      // 処理中は、絞り込みボタンにローディングアニメを表示
      let submitButtonIcon: React.ReactNode = null;
      if (isSaving) {
        submitButtonIcon = <LoadingIcon size={20} />;
      }
          
      return (
        <Formik
          initialValues={data}
          validationSchema={validationSchema}                
          onSubmit={handleSubmit}>
          {(formik) => {
              let geofenceDistanceError: boolean;
              let geofenceDistanceErrorMsg: string;
              if (formik.touched[elIds.geofenceDistance] && Boolean(formik.errors[elIds.geofenceDistance])) {
                geofenceDistanceError = formik.touched[elIds.geofenceDistance] && Boolean(formik.errors[elIds.geofenceDistance]);
                geofenceDistanceErrorMsg = formik.errors[elIds.geofenceDistance];
              }            

              return (
              <div className="mpp-bg-white mpp-p-2 mpp-h-full mpp-flex mpp-flex-col mpp-divide-y mpp-divide-gray-300">
                <div className="mpp-flex-none mpp-h-10">
                  <label className="mpp-text-xl mpp-text-gray-500 mpp-font-semibold mpp-p-2">{data.id == null ? translate(MessageIds.labelRegistrationOfPlace) : translate(MessageIds.labelEditOfPlace)}</label>
                </div>
                <div className="mpp-flex-grow mpp-overflow-y-auto">
                  <Form id="placeRegistForm" className="mpp-p-2 mpp-space-y-5">
                    {/* カテゴリ選択 */}
                    <PlaceCategorySelect 
                      id={elIds.categoryID} 
                      data={categories}
                      label={translate(MessageIds.labelCategory)} 
                      formik={formik}
                      allowEmpty={true}
                      onChange={(value) => handleChange({...formik.values, categoryID: value})}
                      disabled={canEdit != true}/>
                    
                    {/* 名称 */}
                    <Input 
                      formik={formik} 
                      id={elIds.name} 
                      label={translate(MessageIds.labelNameRequired)} 
                      type="text"
                      onChange={(e) => handleChange({...formik.values, name: e.target.value})}
                      disabled={canEdit != true} />
                    

                    {/* 略称 */}
                    <Input 
                      formik={formik} 
                      id={elIds.nameShort} 
                      label={translate(MessageIds.labelNameShort)} 
                      type="text"
                      onChange={(e) => handleChange({...formik.values, nameShort: e.target.value})} 
                      disabled={canEdit != true} />
                    
                    {/* 仮名は リージョンがjpの場合のみ表示 */}
                    {region == "jp"  
                       ? <Input 
                            formik={formik} 
                            id={elIds.nameYomi} 
                            label={translate(MessageIds.labelNameYomi)} 
                            type="text"
                            onChange={(e) => handleChange({...formik.values, nameYomi: e.target.value})}  
                            disabled={canEdit != true} />
                       : null }
                    
                    {/* 地図上に表示 */}
                    <div className="mpp-table">
                      <label className="mpp-table-cell mpp-align-middle">{translate(MessageIds.labelToggleMap)}</label> 
                      <div className="mpp-table-cell mpp-w-2"></div>              
                      <Switch 
                        id={elIds.isVisibleOnMap} 
                        formik={formik}
                        onChange={(checked) => handleChange({...formik.values, isVisibleOnMap: checked})} 
                        disabled={canEdit != true} ></Switch>
                    </div>  
                    
                    {/* アイコン選択 */}
                    <PlaceIconSelect 
                      id={elIds.iconID}  
                      label={translate(MessageIds.labelIcon)} 
                      zIndex={2}
                      formik={formik} 
                      onChange={(value) => handleChange({...formik.values, iconID: value})}
                      disabled={canEdit != true}  />
                    
                    {/* 住所 */}
                    <Textarea 
                      id={elIds.address} 
                      formik={formik} 
                      label={translate(MessageIds.labelAddress)} 
                      onChange={(e) => handleChange({...formik.values, address: e.target.value})} 
                      disabled={canEdit != true} />
                    
                    {/* ジオフェンス機能の有効化 */}
                    <div className="mpp-table">
                      <label className="mpp-table-cell mpp-align-middle">{translate(MessageIds.labelUseGeofence)}</label> 
                      <div className="mpp-table-cell mpp-w-2"></div>
                      {/* ジオフェンス機能が使えないは常にdisable */}
                      <Switch 
                        id={elIds.useGeofence} 
                        formik={formik} 
                        onChange={(checked) => handleUseGeofenceChange(formik, checked)} 
                        disabled={geofenceEnabled != true} />
                    </div>                

                    {/* ジオフェンス距離の入力 */}
                    <div className="mpp-table">
                      <div className="mpp-w-20">
                        <Input 
                          id={elIds.geofenceDistance} 
                          type="number" 
                          disabled={geofenceEnabled != true || formik.values.useGeofence != true || canEdit != true }
                          onChange={(e) => handleChange({...formik.values, geofenceDistance: Number(e.target.value)})}
                          formik={formik} 
                          formikErrorVisibility="hidden"  />
                      </div>
                      <label className="mpp-table-cell mpp-align-bottom">{translate(MessageIds.labelGeofenceUnitName)}</label>                      
                    </div>

                    <div className="mpp-table-cell mpp-text-sm align-top">{translate(MessageIds.labelCaution)}</div>

                    {geofenceDistanceError ? (
                        <p className="mpp-text-left mpp-text-red-500 mpp-text-base mpp-font-medium italic" style={{marginTop:"0px"}}>{geofenceDistanceErrorMsg}</p>
                    ) : null}

                    {/* 電話番号 */}
                    <Input 
                      formik={formik} 
                      id={elIds.tel} 
                      label={translate(MessageIds.labelTel)} 
                      type="tel"
                      onChange={(e) => handleChange({...formik.values, tel: e.target.value})} 
                      disabled={canEdit != true} 
                      placeholder={translate(MessageIds.examplePhoneNumber)} />

                    {/* メールアドレス */}
                    <Input 
                      formik={formik} 
                      id={elIds.email} 
                      label={translate(MessageIds.labelEmail)} 
                      type="email"
                      onChange={(e) => handleChange({...formik.values, email: e.target.value})} 
                      disabled={canEdit != true}
                      placeholder={translate(MessageIds.exampleEmailAddress)} />

                    {/* 備考 */}
                    <Textarea 
                      formik={formik} 
                      label={translate(MessageIds.labelRemarks)} 
                      id={elIds.remarks}
                      onChange={(e) => handleChange({...formik.values, remarks: e.target.value})} 
                      disabled={canEdit != true} />                             
                  </Form>
                </div>
                <div className="mpp-flex-none h-14">
                  <div className="mpp-pt-3 mpp-flex mpp-justify-end">
                    <Button type="submit" icon={submitButtonIcon} disabled={isSaving || (formik.dirty == false && isLocationChanged == false) || formik.isValid == false || formik.isValidating == true || canEdit == false} onClick={() => handleSubmit(formik.values)}>{translate(MessageIds.labelSave)}</Button>
                    <Button type="button" onClick={() => handleCancel()}>{translate(MessageIds.labelCancel)}</Button>
                  </div> 
                </div>                
              </div>
            );
          }}
        </Formik>
    );
}



