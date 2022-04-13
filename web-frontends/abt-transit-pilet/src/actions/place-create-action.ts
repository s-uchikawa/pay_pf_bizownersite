import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { MessageIds } from '../messages';
import { BffErrorCodes, PlaceDetailInfo, PlaceListItem, PlaceMapItem } from '../models/mloca-bff-types';
import { PlaceInfoState, PlacePageState } from '../models/place-types';

/**
 * 地点の新規登録インターフェース
 */
export type CreatePlace = (placeData: PlaceInfoState, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) => void;

/**
 * 地点の新規登録アクション
 */
export class CreatePlaceAction {
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
     * 地点の新規登録を実行
     * @param placeData 登録する地点の情報 
     */
    public execute: CreatePlace = (placeData: PlaceInfoState, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) => {
        let success: boolean = true;
        let savedData: PlaceDetailInfo;

        this.mlocaBff.createPlace(placeData)
        .then((response) => {
            // 目印上限オーバーおよびその他のエラー
            if(response.error) {
                if (response.error.statusCode != 200 || response.error.errorCode == BffErrorCodes.PlaceLimitOver) {
                    console.warn("An error occurred when create place. Status = " + response.error.statusCode + ", ErrorCode = " + response.error.errorCode + ", Message = " + response.error.message);

                    success = false;
                    this.dispatch(state => ({
                        ...state,
                        error: {
                            message: response.error.message
                        }
                    }));
                    return;
                }
            }

            savedData = response.place;
            success = true;

        }).catch(err => {
            success = false;
            const msg = ErrorHandling.handle(err, this.translate);

            this.dispatch(state => ({
                ...state,
                error: {
                    message: msg.message
                }
            }));
        })
        .finally(() => {
            try {
                if (success) {
                    const result: PlaceInfoState = Object.assign<any, PlaceDetailInfo>({}, savedData);
                    if (onSuccess) { onSuccess(result); }

                    // ステート更新
                    this.addPlaceToState(result);
                } else {
                    if (onError) { onError(); }
                }    
            } catch (ex) {
                // コールバック内で発生したエラーは無視
                ErrorHandling.handle(ex, this.translate);
            }
        }); 
    };

    private addPlaceToState(savedData: PlaceInfoState) {
        this.dispatch(state => {
            // 一覧用ステートに追加
            let listData: PlaceListItem[] = [];
            Object.assign(listData, state.list.data);
            const listItem: PlaceListItem = Object.assign<any, PlaceInfoState>({}, savedData);
            listData.push(listItem);
            
            // 地図ステートに追加
            let mapData: PlaceMapItem[] = [];
            Object.assign(mapData, state.map.places);
            const mapItem: PlaceMapItem = Object.assign<any, PlaceInfoState>({}, savedData);
            mapData.push(mapItem);
            
            return ({
                ...state,
                error: null,
                list: {
                    ...state.list,
                    data: listData,
                },
                map: {
                    ...state.map,
                    places: mapData
                }
            });
        })        
    }
}
