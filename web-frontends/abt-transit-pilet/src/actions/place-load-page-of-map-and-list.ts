import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { PlaceFilterState, PlacePageState } from '../models/place-types';

/**
 * 地図と一覧のデータロードアクションインターフェース
 */
 export type LoadPageOfMapAndList = (condition: PlaceFilterState, page: number, onSuccess?: () => void, onError?: () => void) => void;

 
/**
 * 地図と一覧のデータロードアクション
 */
export class LoadPageOfMapAndListAction {
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
     * 地図と一覧のデータロード処理
     * @param condition 絞り込み条件 
     * @param page ページ番号
     */
    public execute: LoadPageOfMapAndList = (condition: PlaceFilterState, page: number, onSuccess?: () => void, onError?: () => void) => {
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
            page: page,
            pageLimit: limitOfPage,
            sortKey: condition?.sortKey ?? "name",
            sortDirection: condition?.sortDirection ?? "asc"
        })
        .then((result) => {
            let totalPages = 0;
            if (result.placesOnList.totalCount > 0) {
                totalPages = Math.floor(result.placesOnList.totalCount / limitOfPage);
                if ((result.placesOnList.totalCount % limitOfPage) > 0) {
                    totalPages = totalPages + 1;
                }
            }

            this.dispatch(state => ({
                ...state,
                error: null,
                map:{
                    places:result.placesOnMap
                },
                list: {
                    data: result.placesOnList.pageItems,
                    pagenation: {
                        page: result.placesOnList.totalCount > 0 ? page : 0,
                        totalCount: result.placesOnList.totalCount,
                        totalPages: totalPages
                    }
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
                if (ex && ex.message) {
                    console.error(ex.message);
                }
            }
        }); 
    };
}