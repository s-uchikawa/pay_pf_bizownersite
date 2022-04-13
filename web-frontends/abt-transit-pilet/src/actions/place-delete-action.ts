import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { BffErrorCodes, PlaceListItem, PlaceMapItem } from '../models/mloca-bff-types';
import { PlacePageState } from '../models/place-types';

/**
 * 地点の削除インターフェース
 */
export type DeletePlace = (placeId: number, onSuccess?: () => void, onError?: () => void) => void;

/**
 * 地点の削除アクション
 */
export class DeletePlaceAction {
    private dispatch: StateContainerReducer<PlacePageState>;
    private translate: (key: string) => string;
    private mlocaBff: MlocaBff;

    /**
     * コンストラクタ
     * @param dispatch ディスパッチャ 
     */
    constructor(dispatch: StateContainerReducer<PlacePageState>, translate: (key: string) => string, mlocaBff: MlocaBff) {    
        this.dispatch = dispatch;
        this.translate = translate;
        this.mlocaBff = mlocaBff;
    }

    /**
     * 地点の削除を実行
     * @param placeId 削除する地点ID
     */
    public execute: DeletePlace = (placeId: number, onSuccess?: () => void,  onError?: () => void) => {
        let success: boolean = true;
        this.mlocaBff.deletePlace(placeId)
        .then((response) => {

            // 既に該当IDが削除されている場合は成功として扱う
            if(response.error != null && response.error.statusCode != 200 && response.error.errorCode != BffErrorCodes.PlaceDeleteNotFound){
                console.warn("An error occurred when update place. Status = " + response.error.statusCode + ", ErrorCode = " + response.error.errorCode + ", Message = " + response.error.message);
                const msg = response.error.message;
                this.dispatch(state => ({
                    ...state,
                    error: {
                        message:msg
                    }
                }));
                return;
            }

            success= true;
        }).catch(err => {
            success = false;
            const msg = ErrorHandling.handle(err, this.translate);
            
            this.dispatch(state => ({
                ...state,
                error: {
                    message:msg.message
                }
            }));
        }).finally(() => {
            try{
                if(success){                    
                    // リストから該当地点IDの情報を削除
                    this.dispatch(state => {
                        let listData: PlaceListItem[] = [];
                        Object.assign(listData, state.list.data);
                        // 一覧用ステートから削除
                        let listItemIdx: number = listData.findIndex((val, idx) => { 
                            return (val.id == placeId) 
                        });
                        if(listItemIdx >= 0){
                            listData.splice(listItemIdx, 1);
                        }
                        // 地図ステートから削除
                        let mapData: PlaceMapItem[] = [];
                        Object.assign(mapData, state.map.places);
                        let mapItemIdx: number = mapData.findIndex((val, idx) => { 
                            return (val.id == placeId) 
                        });
                        if(mapItemIdx >= 0){
                            mapData.splice(mapItemIdx, 1);
                        }
                        
                        return ({
                            ...state,
                            error: null,
                            list: {
                                ...state.list,
                                data: listData
                            },
                            map: {
                                ...state.map,
                                places: mapData
                            }
                        });
                    })
                    if(onSuccess) { onSuccess(); }
                }else{
                    if (onError) { onError(); }
                }
            }catch (ex) {
                // コールバック内で発生したエラーは無視
                ErrorHandling.handle(ex, this.translate)
            }
        })
    }
}
