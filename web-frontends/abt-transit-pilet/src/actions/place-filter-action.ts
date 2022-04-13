import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { PlaceFilterState, PlacePageState } from '../models/place-types';

/**
 * 地点絞り込みのインターフェース
 */
export type Filter = (condition: PlaceFilterState, onSuccess?: () => void, onError?: () => void) => void;


/**
 * 地点絞り込みのアクション
 */
export class FilterAction {
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
     * 絞り込み処理
     * @param condition 絞り込み条件 
     */
    public execute: Filter = (condition: PlaceFilterState, onSuccess?: () => void, onError?: () => void) => {
        this.dispatch(state => ({
            ...state,
            isFiltering: true
        }));

        let success: boolean = true;
        const limitOfPage: number = 100;

        this.mlocaBff.searchPlaces({
            includeCategories: false,
            includePlacesOnMap: true,
            includePlacesOnList: true,
            name: condition?.name,
            address: condition?.address,
            iconID: condition?.iconID,
            categoryID: condition?.categoryID,
            page: 1,
            pageLimit: limitOfPage,
            sortKey: condition?.sortKey ?? "name",
            sortDirection: condition?.sortDirection ?? "asc"
        })
        .then((result) => {
            let totalPages = 0;
            let page = 0;
            if (result.placesOnList.totalCount > 0) {
                page = 1;
                totalPages = Math.floor(result.placesOnList.totalCount / limitOfPage);
                if ((result.placesOnList.totalCount % limitOfPage) > 0) {
                    totalPages = totalPages + 1;
                }
            }

            this.dispatch(state => ({
                ...state,
                error: null,
                list: {
                    data: result.placesOnList.pageItems,
                    pagenation: {
                        page: page,
                        totalCount: result.placesOnList.totalCount,
                        totalPages: totalPages
                    }
                },
                map: {
                    places: result.placesOnMap
                },
                filter: condition
            }));
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
                    if (onSuccess) { onSuccess(); }
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
