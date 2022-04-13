import * as React from 'react';
import { MessageIds } from '../../messages';
import { PlacePageState, PlaceInfoState, PlaceFilterState } from '../../models/place-types';
import { PlacePartsPageHeader } from './parts/page-header';
import { PlaceViewInfo } from './view-info';
import { PlaceViewList } from './view-list';
import { PlaceViewMap, PlaceViewMapRef } from './view-map';
import { useHistory, useLocation } from "react-router-dom";
import { Region } from '../../models/types';
import { Filter, LoadPageOfList, LoadPageOfMapAndList, LoadDetail, CreatePlace, UpdatePlace, DeletePlace } from '../../actions';
import { LoadingIcon } from 'paypf-bizowner-ui-elements';
import { PlaceListItem, PlaceMapItem } from '../../models/mloca-bff-types';

export interface Translations {
    [tag: string]: string;
  }

const PlacePage: React.FC<{ 
    getRegion: () => Promise<Region>,
    mode: string, // "map" | "list" | "info" | "create"
    placeId: number,
    translate(key: MessageIds,variable?): string,
    state: PlacePageState,
    initialLoad(): void,
    filter: Filter,
    loadPageOfList: LoadPageOfList,
    loadPageOfMapAndList: LoadPageOfMapAndList,
    showNotification(type: "info" | "success" | "warning" | "error", title: string, content: any): void,
    showModal(key: string),
    searchPlacesByText(searchText: string): void,
    // 地点の新規登録アクション
    createPlace: CreatePlace;
    // 地点の更新アクション
    updatePlace: UpdatePlace,
    // 地点の削除アクション
    deletePlace: DeletePlace,
    // 地点詳細情報のフェッチアクション
    loadDetail: LoadDetail;
    // 地点削除する地点IDをセットする
    setDeletePlaceId:(placeId:number) => void;
    // CSVファイルのダウンロード
    downloadCSV(condition: PlaceFilterState, onSuccess: () => void, onError: () => void): void,
 }> = (props) => {    
    
    const [region, setRegion] = React.useState<Region>('none');
    const [initialized, setInitialize] = React.useState(false);
    const [isDownloading, setIsDownloading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const mapView = React.useRef<PlaceViewMapRef>(null);
    const location = useLocation();

    var urlParams = new URLSearchParams(location.search);

    const history = useHistory();

    // 詳細/編集画面を開く前の時点でのモードの保持
    const lastMode = React.useRef<string>(null);

    if (props.mode == "map" || props.mode == "list") {
      lastMode.current = props.mode;
    }

    React.useEffect(() => {
        // 画面初期表示時のデータロード
        if (initialized == false) {
          props.initialLoad();
          setInitialize(true);
        }

        if (props.state.error) {
          props.showNotification("error", null, props.state.error.message);
        }

        if (region == "none") {
          props.getRegion().then(value => {
            setRegion(value);
          });
        }
  
        // Specify how to clean up after this effect
        return () => {
          // console.log("Clean up")
        }
      });

    /**
     * ヘッダー部で絞り込みボタン押下時
     */
    const handleFilter = () => { 
      // 地点の絞り込みダイアログを表示
      props.showModal("place-filter");
    }      

    /**
     * ヘッダー部で作成ボタン押下時
     */
    const handleCreate = () => { 
      // 現在の地図の中心緯度経度とズームを引数で渡す
      let params: string = "";
      if (mapView.current) {
        params= `?lat=${mapView.current.latitude()}&lng=${mapView.current.longitude()}&zoom=${mapView.current.zoom()}`;
      }
      history.replace(`/places/create${params}`);
    }      

    /**
     * 検索結果押下時
     */
    const handleSelected = (placeId: string) => {
        if(mapView.current && mapView.current.zoom() < 17){
          mapView.current.setZoom(17);
        }
        history.replace(`/places/map/${placeId}`);
    }      
    
    /**
     * ヘッダー部でダウンロードボタン押下時
     */
    const handleDownload = () => {
      setIsDownloading(true);
      // 現在のフィルタ条件でCSVを取得する
      props.downloadCSV(props.state.filter, handleDownloadSuccess, handleDownloadFailed);
    }

    /**
     * CSVからインポートボタン押下時
     */
    const handleCsvImport = () => { 
      props.showModal("place-bulk-regist");
    }      
    
    /**
     * ヘッダー部で更新ボタン押下時
     */
     const handleRefreshed = () => {
      setIsRefreshing(true);
      // 地図と一覧を更新する
      props.loadPageOfMapAndList({...props.state.filter}, 1, handleRefreshOfMapAndListSuccess, handleRefreshOfMapAndListFailed);
    }      
    
    /**
     * 登録/更新/表示フォームのキャンセルイベント処理
     */
    const handleCreateOrUpdateOrInfoViewCancel = () => { 
      if (lastMode.current) {
        // 登録/更新/表示フォームを表示する前のモードに戻る
       history.replace(`/places/${lastMode.current}`);
      } else {
       history.replace(`/places/map`);
      }
    }    

    /**
     * 地点のコンテキストメニュー選択時の処理
     * @param placeId 地点ID
     */
    const handleDetail = (placeId: number) : void => {
      // 現在のズームを引数で渡す
      let params: string = "";
      if (mapView.current) {
        params= `?zoom=${mapView.current.zoom()}`;
      }

      history.replace(`/places/info/${placeId}${params}`);
    }

    /**
     * 地点削除時の確認ダイアログを表示する
     * @param placeId 
     */
    const handleDeletePlaceConfirm = (placeId:number) : void => {
      if(placeId){
        props.setDeletePlaceId(placeId);
        props.showModal('place-confirm-dialog')
      }
    }

    /**
     * ダウンロード成功時のコールバックハンドラ
     */
    const handleDownloadSuccess = () => {
      setIsDownloading(false);
    }

    /**
     * ダウンロード失敗時のコールバックハンドラ
     */
    const handleDownloadFailed = () => {
      setIsDownloading(false);
    }

    /**
     * 地図と一覧更新成功時のコールバックハンドラ
     */
    const handleRefreshOfMapAndListSuccess = ()=> {
      setIsRefreshing(false);
    }

    /**
     * 地図と一覧更新失敗時のコールバックハンドラ
     */
    const handleRefreshOfMapAndListFailed = ()=> {
      setIsRefreshing(false);
    }

    if (props.state.isInitializing) {
      return (
        <div className="mpp-bg-white mpp-flex mpp-justify-center mpp-items-center mpp-w-full mpp-h-full">
            <div className="mpp-w-auto mpp-h-10 mpp-px-4 mpp-py-2">
                <LoadingIcon size={30} color="black" />
            </div>
        </div>);
    } else {
      if (props.state.canView) {
        return (
            <div className="mpp-h-full mpp-w-full mpp-flex mpp-flex-col mpp-items-stretch">
              <div className="mpp-flex-none">
                <PlacePartsPageHeader 
                  hidden={props.mode == 'info' || props.mode == 'create'}
                  translate={props.translate} 
                  mode={props.mode}
                  canEdit={props.state.canEdit}
                  filterState={props.state.filter}
                  onFilter={handleFilter} 
                  onCreate={handleCreate} 
                  onDownload={handleDownload} 
                  onCsvImport={handleCsvImport} 
                  onSelected={handleSelected} 
                  onRefreshed={handleRefreshed} 
                  searchPlacesByText={props.searchPlacesByText} 
                  searchPlacesByTextState={props.state.searchByText}
                  isDownloading={isDownloading}
                  isRefreshing={isRefreshing}/>
              </div>
              <div className="mpp-h-full mpp-flex-grow">
                <PlaceViewMap 
                  ref={mapView}
                  hidden={props.mode != 'map'}
                  canEdit={props.state.canEdit} 
                  translate={props.translate} 
                  data={props.state.map} 
                  placeId={props.placeId} 
                  onDetail={handleDetail}
                  onDelete={handleDeletePlaceConfirm} />
  
                <PlaceViewList 
                  hidden={props.mode != 'list'}
                  canEdit={props.state.canEdit} 
                  translate={props.translate} 
                  data={props.state.list} 
                  filter={props.state.filter}
                  loadPageOfList={props.loadPageOfList}  
                  onDetail={handleDetail} 
                  onDelete={handleDeletePlaceConfirm}/>
  
                {(props.mode == 'info' || props.mode == 'create') ? 
                  <PlaceViewInfo 
                    placeId={props.placeId}
                    canEdit={props.state.canEdit} 
                    geofenceEnabled={props.state.geofenceEnabled}
                    translate={props.translate} 
                    region={region} 
                    initialLatitude={urlParams.has("lat") ? Number(urlParams.get("lat")) : undefined}
                    initialLongitude={urlParams.has("lng") ? Number(urlParams.get("lng")) : undefined}
                    initialZoom={urlParams.has("zoom") ? Number(urlParams.get("zoom")) : undefined}
                    categories={props.state.categories}
                    loadDetail={props.loadDetail}
                    onCancel={handleCreateOrUpdateOrInfoViewCancel} 
                    updatePlace={props.updatePlace}
                    createPlace={props.createPlace}
                    showNotification={props.showNotification}/>
                    : <></>
                }
              </div>
            </div>
        );
      } else {
        return (<div>This feature is not allowed.</div>);
      }  
    }

  }

export default PlacePage;