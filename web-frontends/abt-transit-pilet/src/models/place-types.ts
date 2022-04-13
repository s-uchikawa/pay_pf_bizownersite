import { ErrorState, Pagenation } from "./types";
import { PlaceMapItem, PlaceCategory, PlaceListItem } from "./mloca-bff-types";

/**
* 地点一覧画面状態
*/
export interface PlaceListState {
    // 現在のページに表示するデータ
    data: PlaceListItem[];
    // ページネーション
    pagenation: Pagenation;
}

/**
* 地点地図画面状態
*/
export interface PlaceMapState {
    // 地図の地点情報
    places: PlaceMapItem[];
}


/**
* 地点絞り込み条件
*/
export interface PlaceFilterState {
    // 名称
    name?: string;
    // 住所
    address?: string;
    // アイコンID
    iconID?: number;
    // カテゴリID
    categoryID?: number;
    // ソートキー
    sortKey?: string;
    // ソート方向
    sortDirection? : 'asc' | 'desc';
}

/**
* 地点情報
*/
export interface PlaceInfoState {
    // 地点ID
    id: number;
    // 名称
    name: string;
    // email
    email: string;
    // 緯度
    latitude: number;
    // 経度
    longitude: number;
    // アイコンID
    iconID?: number;
    // カテゴリID
    categoryID?: number;
    //略称
    nameShort: string;
    //仮名
    nameYomi: string;
    //住所
    address: string;
    // 地図上に表示するかどうか
    isVisibleOnMap: boolean;
    // 入出場判定の有効化
    useGeofence?: boolean;
    //入出場距離
    geofenceDistance?: number;
    //入出場距離単位
    geofenceDistanceUnit?: 'm' | 'ft';
    //電話番号
    tel: string;
    //備考
    remarks?: string;
}


/**
* 地点ページ画面状態
*/
export interface PlacePageState {
    // 初期処理中かどうか
    isInitializing: boolean;
    // メニューを表示するかどうか
    menuEnabled: boolean;
    // 表示可能かどうか
    canView: boolean;
    // 編集可能かどうか
    canEdit: boolean;
    // ジオフェンス機能が有効化されているか
    geofenceEnabled: boolean;
    // 地点一覧画面状態
    list: PlaceListState;
    // 地点地図画面状態
    map: PlaceMapState;
    // 適用済みのフィルター
    filter: PlaceFilterState;
    // フィルター処理中かどうか
    isFiltering: boolean;
    // 地点カテゴリ
    categories: PlaceCategory[];
    // 地点削除用地点ID
    deletePlaceId?:number;
    //検索結果
    searchByText: PlaceSearchByTextState;
    // エラー状態
    error: ErrorState;
}

/**
 * 地点検索状態
 */
 export interface PlaceSearchByTextState {
     // ロード処理中かどうか
     isLoading: boolean;

     // 検索結果
     result: PlaceSearchByTextResult[];
 }

/**
 * 地点検索状態
 */
export interface PlaceSearchByTextResult {
    //地点ID
    id: string;
    //地点名称
    name: string;
    //略称
    nameShort?: string;
    //ふりがな
    nameYomi?: string;
    //アイコンURL
    iconID: number;
    //緯度
    latitude: number;
    //経度
    longitude: number;
}

