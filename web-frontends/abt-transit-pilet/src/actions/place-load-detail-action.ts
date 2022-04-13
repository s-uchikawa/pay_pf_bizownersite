import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { PlaceDetailInfo } from '../models/mloca-bff-types';
import { PlaceFilterState, PlaceInfoState, PlacePageState } from '../models/place-types';

/**
 * 地点の詳細情報のフェッチアクションインターフェース
 */
export type LoadDetail = (placeId: number, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) => void;

/**
 * 地点の詳細情報のフェッチアクション
 */
export class LoadDetailAction {
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
     * 地点の詳細情報のフェッチ処理
     * @param placeId 地点ID 
     * @param page ページ番号
     */
    public execute: LoadDetail = (placeId: number, onSuccess?: (data: PlaceInfoState) => void, onError?: () => void) => {
        this.dispatch(state => ({
            ...state,
            isFiltering: true
        }));

        let success: boolean = true;
        const limitOfPage: number = 100;

        let fetchData: PlaceDetailInfo;

        this.mlocaBff.getPlaceDetail(placeId)
        .then((result) => {
            fetchData = result;
        })
        .catch(err => {
            const msg = ErrorHandling.handle(err, this.translate);
            this.dispatch(state => ({
                ...state,
                error: {
                    message: msg.message
                }
            }));

            success = false;
        })
        .finally(() => {
            this.dispatch(state => ({
                ...state,
                error: null,
                isFiltering: false
            }));

            try {
                if (success) {
                    const result: PlaceInfoState = Object.assign<any, PlaceDetailInfo>({}, fetchData);
                    // PlaceInfoState(UI)とPlaceDetailInfo(API)の違いを吸収
                    if (fetchData.geofence) {
                        result.useGeofence = true;
                        result.geofenceDistance = fetchData.geofence.distance;
                        result.geofenceDistanceUnit = fetchData.geofence.unit;
                    } else {
                        result.useGeofence = false;
                    }
                    if (onSuccess) { onSuccess(result); }
                } else {
                    if (onError) { onError(); }
                }    
            } catch (ex) {
                // コールバック内で発生したエラーは無視
                ErrorHandling.handle(ex, this.translate);
            }
        }); 
    };
}
