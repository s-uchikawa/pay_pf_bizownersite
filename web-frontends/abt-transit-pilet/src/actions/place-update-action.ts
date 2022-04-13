import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { MessageIds } from '../messages';
import { BffErrorCodes, PlaceDetailInfo, PlaceListItem, PlaceMapItem } from '../models/mloca-bff-types';
import { PlaceInfoState, PlacePageState } from '../models/place-types';

/**
 * 地点の更新インターフェース
 */
export type UpdatePlace = (placeData: PlaceInfoState, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) => void;

/**
 * 地点の更新アクション
 */
export class UpdatePlaceAction {
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
     * 地点の更新を実行
     * @param placeData 更新する地点の情報 
     */
    public execute: UpdatePlace = (placeData: PlaceInfoState, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) => {
        let success: boolean = true;
        let savedData: PlaceDetailInfo;

        this.mlocaBff.updatePlace(placeData)
        .then((response) => {
            if(response.error != null && response.error.statusCode != 200){
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

                    // ステートの更新
                    this.updatePlaceToState(result);                    
                } else {
                    if (onError) { onError(); }
                }    
            } catch (ex) {
                // コールバック内で発生したエラーは無視
                ErrorHandling.handle(ex, this.translate);
            }
        }); 
    };


    private updatePlaceToState(savedData: PlaceInfoState) {
        this.dispatch(state => {
            // 一覧用ステートを更新
            let listData: PlaceListItem[] = [];
            Object.assign(listData, state.list.data);
            let listItemIdx: number = listData.findIndex((val, idx) => { 
                return (val.id == savedData.id) 
            });
            if(listItemIdx >= 0){
                const listItem: PlaceListItem = Object.assign<any, PlaceInfoState>({}, savedData);
                listData[listItemIdx] = listItem;
            }
            // 地図ステートを更新
            let mapData: PlaceMapItem[] = [];
            Object.assign(mapData, state.map.places);
            let mapItemIdx: number = mapData.findIndex((val, idx) => { 
                return (val.id == savedData.id) 
            });
            if(mapItemIdx >= 0){
                const mapItem: PlaceMapItem = Object.assign<any, PlaceInfoState>({}, savedData);
                mapData[mapItemIdx] = mapItem;
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
    }
}
