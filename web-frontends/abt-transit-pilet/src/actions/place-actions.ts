import { StateContainerOptions, StateContainerReducer, StateContainerReducers } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { PlaceFilterState, PlaceInfoState, PlacePageState } from '../models/place-types';
import { UIConfiguration, PlaceListItem, BffErrorCodes } from '../models/mloca-bff-types';
import { ErrorHandling } from '../error-handling';
import { FilterAction } from './place-filter-action';
import { InitialLoadAction } from './place-initial-load-action';
import { LoadPageOfListAction } from './place-load-page-of-list';
import { LoadDetailAction } from './place-load-detail-action';
import { SearchByTextAction } from "./place-search-by-text-action";
import { CreatePlaceAction } from './place-create-action';
import { UpdatePlaceAction } from './place-update-action';
import { DeletePlaceAction } from './place-delete-action';
import { LoadPageOfMapAndListAction } from './place-load-page-of-map-and-list';

export function createPlaceState(getMenuEnebled: () => Promise<boolean>, mlocaBff: MlocaBff, translate: (key: string) => string) : StateContainerOptions<PlacePageState, StateContainerReducers<PlacePageState>> {
    return {
        state: {
            isInitializing: false,
            menuEnabled: false,
            canView: false,
            canEdit: false,
            geofenceEnabled: false,
            isFiltering: false,            
            map: {
                places: null
            },
            list: {
                data: [],
                pagenation: {
                    page: 0,
                    totalCount: 0,
                    totalPages: 0,                
                }
            },
            categories: null,
            searchByText: null,
            deletePlaceId: null,
            filter: null,
            error: null,
        },
        actions: {
            /**
             * メニューの表示/非表示を取得します。
             */
            getMenuEnebled(dispatch: StateContainerReducer<UIConfiguration>) {
                getMenuEnebled().then((menuEnabled) => {
                    dispatch(state => ({
                        ...state,
                        menuEnabled: menuEnabled
                    }));
                });
            },

            /**
             * 初期データロード
             */
            initialLoad(dispatch: StateContainerReducer<PlacePageState>) {
                const action = new InitialLoadAction(dispatch, translate, mlocaBff);
                action.execute();
            },

            /**
             * 絞り込みを適用します。
             * @param condition 絞り込み条件
             * @param onSuccess 成功時のコールバック
             * @param onError  失敗時のコールバック
             */
            filter(dispatch: StateContainerReducer<PlacePageState>, condition: PlaceFilterState, onSuccess?: () => void, onError?: () => void) {
                const action = new FilterAction(dispatch, translate, mlocaBff);
                action.execute(condition, onSuccess, onError);
            },

            /**
             * 地点リストのページ番号を設定します
             * @param currentFilter 現在の絞り込み条件
             * @param page 設定するページ番号
             * @param onSuccess 成功時のコールバック
             * @param onError  失敗時のコールバック
             */
            loadPageOfList(dispatch: StateContainerReducer<PlacePageState>, currentFilter: PlaceFilterState, page: number, onSuccess?: () => void, onError?: () => void) {
                const action = new LoadPageOfListAction(dispatch, translate, mlocaBff);
                action.execute(currentFilter, page, onSuccess, onError);
            },
            
            /**
             * 地図と一覧を更新します
             * @param currentFilter 現在の絞り込み条件
             * @param onSuccess 成功時のコールバック
             * @param onError 失敗時のコールバック
             */
            loadPageOfMapAndList(dispatch: StateContainerReducer<PlacePageState>, currentFilter: PlaceFilterState, page:number, onSuccess?: () => void, onError?:() => void){
                const action = new LoadPageOfMapAndListAction(dispatch, translate, mlocaBff);
                action.execute(currentFilter, page, onSuccess, onError);
            },

            /**
             * 地点詳細情報をロードします。
             * @param placeId 地点ID
             * @param onSuccess 成功時のコールバック
             * @param onError  失敗時のコールバック
             */
            loadDetail(dispatch: StateContainerReducer<PlacePageState>, placeId: number, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) {
                const action = new LoadDetailAction(dispatch, translate, mlocaBff);
                action.execute(placeId, onSuccess, onError);
            },

            /**
             * 一括登録を行います。
             * @param file 一括登録するCSVファイル
             */
            uploadFile(dispatch: StateContainerReducer<PlacePageState>, file:object){
                
                const upload = mlocaBff.uploadFile(file).then((result) => {
                    dispatch(state => ({
                        ...state,
                        error: null,
                    }))
                }).catch(err => {
                    const msg = ErrorHandling.handle(err, translate);
                    dispatch(state => ({
                        ...state,
                        error: {
                            message: msg.message
                        }
                    }))
                })
                     
            },

            /**
             * CSVファイルダウンロードを行います
             * @param condition 現在の絞り込み条件
             * @param onSuccess 成功時のコールバック
             * @param onError   失敗時のコールバック
             */
             downloadCSV(dispatch: StateContainerReducer<PlacePageState>, condition: PlaceFilterState, onSuccess?: () => void, onError?: () => void){   
                let success: boolean = true;
                
                const upload = mlocaBff.downloadCSV(condition).then((result) => {
                    success = true;
                    dispatch(state => ({
                        ...state,
                        error: null,
                    }))
                }).catch(err => {
                    const msg = ErrorHandling.handle(err, translate);
                    success = false;
                    dispatch(state => ({
                        ...state,
                        error: {
                            message: msg.message
                        }
                    }))
                }).finally(() => {
                    try {
                        if (success) {
                            if (onSuccess) { onSuccess(); }
                        } else {
                            if (onError) { onError(); }
                        }    
                    } catch (ex) {
                        // コールバック内で発生したエラーは無視
                        if (ex && ex.message) {
                            console.error(ex.message);
                        }
                    }
                })
            },

            /**
             * 地点のフリーテキスト検索
             */
            searchPlacesByText(dispatch: StateContainerReducer<PlacePageState>, searchText: string, abortSignal: AbortSignal) {
                const action = new SearchByTextAction(dispatch, translate, mlocaBff);
                action.execute(searchText, abortSignal);
            },

            /**
             * 地点を新規登録します
             * @param placeData 地点登録情報
             */
            createPlace(dispatch: StateContainerReducer<PlacePageState>, placeData: PlaceInfoState, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) {
                const action = new CreatePlaceAction(dispatch, translate, mlocaBff);
                action.execute(placeData, onSuccess, onError);
            },    
                       
            /**
             * 地点情報を更新します 
             * @param placeData 地点詳細情報
             */
            updatePlace(dispatch: StateContainerReducer<PlacePageState>, placeData: PlaceInfoState, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void){
                const action = new UpdatePlaceAction(dispatch, translate, mlocaBff);
                action.execute(placeData, onSuccess, onError);
            },

            /**
             * 地点を削除
             *@param placeId 地点ID
             */
            deletePlace(dispatch: StateContainerReducer<PlacePageState>, placeId: number, onSuccess?: () => void, onError?: () => void){
                const action = new DeletePlaceAction(dispatch, translate, mlocaBff);
                action.execute(placeId, onSuccess, onError);
            },

            /**
             * 削除する地点IDをセットする
             * @param placeId 地点ID
             */
            setDeletePlaceId(dispatch: StateContainerReducer<PlacePageState>, placeId:number){
                dispatch(state => ({
                    ...state,
                    deletePlaceId:placeId
                }))
            }
        }
    };
}
