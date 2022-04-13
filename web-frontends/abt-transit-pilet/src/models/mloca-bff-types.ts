import { Pagenation } from "./types";

/**
* UI構成情報
*/
export interface UIConfiguration {
    // 表示可能かどうか
    canView: boolean;
    // 編集可能かどうか
    canEdit: boolean;
    // ジオフェンス機能が有効化されているか
    geofenceEnabled: boolean;
}

/**
 * Bffのエラーコード
 */
export enum BffErrorCodes {
    // 地点登録数の上限オーバー
    PlaceLimitOver = "PLACE_LIMIT_OVER",
    // 指定された地点が既に存在しない
    PlaceDeleteNotFound = "DELETE_NOT_FOUND"
}  

/**
* 地点検索条件
*/
export interface PlaceSearchCondition {
    // 地図に表示する為に必要な地点情報を含めるかどうか
    includePlacesOnMap: boolean
    // 一覧に表示する為に必要な地点情報を含めるかどうか
    includePlacesOnList: boolean
    // 地点カテゴリ情報を含めるかどうか
    includeCategories: boolean
    // 絞り込み条件(名称)
    name?: string;
    // 絞り込み条件(住所)
    address?: string;
    // 絞り込み条件(アイコンID)
    iconID?: number;
    // 絞り込み条件(カテゴリID)
    categoryID?: number;
    // 絞り込み条件(ソートキー)
    sortKey?: string;
    // 絞り込み条件(ソートの方向)
    sortDirection?: "asc" | "desc";
    
    // ページネーション情報
    // includePlacesOnListがtrueの場合にのみ有効
    // --------------------------------------------
    page?: number;
    pageLimit?: number;
    // --------------------------------------------
}

/**
* 地点検索結果
*/
export interface PlaceSearchResult {
    // 地図に表示する為に必要な地点情報
    placesOnMap: PlaceMapItem[];
    // 一覧に表示する為に必要な地点情報
    placesOnList: PlaceListResult;
    // 地点カテゴリ情報
    categories: PlaceCategory[];
}

/**
* 地点アイコン項目
*/
export interface PlaceMapItem {
    // 地点ID
    id: number;
    // 名称
    name: string;
    // 緯度
    latitude: number;
    // 経度
    longitude: number;
    // アイコンID
    iconID: number;
}

/**
* 地点一覧項目
*/
export interface PlaceListResult {
    // ページ番号
    page: number;
    // ページのデータ
    pageItems: PlaceListItem[];
    // 合計件数
    totalCount: number;
}

/**
* 地点一覧項目
*/
export interface PlaceListItem {
    // 地点ID
    id: number;
    // 名称
    name: string;
    // 略称
    nameShort: string;
    // 仮名
    nameYomi: string;
    // 住所
    address: string;
    // 緯度
    latitude: number;
    // 経度
    longitude: number;
    // アイコンID
    iconID: number;
    // カテゴリID
    categoryID: number;
    // カテゴリ名
    categoryName: string;
    // 入出場距離
    geofence: Geofence;
    // 電話番号
    tel: string;
    // Eメール
    email: string;
}

/**
* 地点のカテゴリ
*/
export interface PlaceCategory {
    // カテゴリID
    id: number;
    // カテゴリ名
    name: string;
}

/**
 * 地点削除結果
 */
export interface DeletePlaceResponse{
    status: string;
    error: ServiceErrorResponse;
}

/**
 *  地点登録結果
 */
 export interface CreatePlaceResponse {
    // 更新後の地点情報
    place: PlaceDetailInfo;
    // エラーレスポンス
    error: ServiceErrorResponse;
}

/**
 *  地点更新結果
 */
 export interface UpdatePlaceResponse {
    // 更新後の地点情報
    place: PlaceDetailInfo;
    // エラーレスポンス
    error: ServiceErrorResponse;
}

/**
 * エラーレスポンスモデル
 */
export interface ServiceErrorResponse{
    // ステータスコード
    statusCode: number;
    //エラーコード
    errorCode: string;
    // エラー時メッセージ
    message: string;
}

/**
* 地点詳細情報
*/
export interface PlaceDetailInfo {    
    // 地点ID
     id: string;
    // 名称
    name:string;
    // 仮名
    nameYomi:string;
    // 略称
    nameShort:string;
    // 顧客コード
    org?:string;
    // 緯度
    latitude:number;
    // 経度
    longitude:number;
    // 住所
    address:string;
    // 電話番号
    tel:string;
    // メールアドレス
    email:string;
    // 備考
    remarks?:string;
    // 地図上に表示するか、否か
    isVisibleOnMap:boolean;
    // アイコン識別子
    iconID:number;
    // カテゴリー識別子
    categoryID:number;
    // カテゴリー名
    categoryName:string;
    // ジオフェンス情報
    geofence?:Geofence;
}


/**
* ジオフェンス情報
*/
export interface Geofence {
    // 中心緯度
    centerLatitude: number;
    // 中心経度
    centerLongitude: number;
    // 円の半径距離
    distance: number;
    // 距離の単位名(m or ft)
    unit: 'm' | 'ft';
}
