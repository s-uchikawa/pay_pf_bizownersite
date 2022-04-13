import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { UIConfiguration } from '../models/mloca-bff-types';
import { PlaceFilterState, PlacePageState } from '../models/place-types';

/**
 * 初期データロードインターフェース
 */
export type InitialLoad = () => void;

/**
 * 初期データロードアクション
 */
export class InitialLoadAction {
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
     * 初期データロード処理
     */
    public execute: InitialLoad = () => {
        this.dispatch(state => ({
            ...state,
            isInitializing: true,
            isFiltering: true            
        }));

        let uiConf: UIConfiguration;
        const limitOfPage: number = 100;
        let filterCondition: PlaceFilterState = {
            sortKey: "name",
            sortDirection: "asc"
        };

        this.mlocaBff.getUIConfiguation()
            .then((result) => {
                uiConf = result;

                if (uiConf.canEdit || uiConf.canView) {
                    return this.mlocaBff.searchPlaces({
                        includeCategories: true,
                        includePlacesOnMap: true,
                        includePlacesOnList: true,
                        page: 1,
                        pageLimit: limitOfPage,
                        sortKey: filterCondition.sortKey,
                        sortDirection: filterCondition.sortDirection
                    });
                }

            }).then((result) => {
                let page = 0;
                let totalPages = 0;
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
                    canView: uiConf.canView,
                    canEdit: uiConf.canEdit,
                    geofenceEnabled: uiConf.geofenceEnabled,
                    map: {
                        places: result.placesOnMap
                    },        
                    list: {
                        data: result.placesOnList.pageItems,
                        pagenation: {
                            page: page,
                            totalCount: result.placesOnList.totalCount,
                            totalPages: totalPages
                        }
                    },
                    filter: filterCondition,
                    categories: result.categories
                }));
            }).catch(err => {
                const msg = ErrorHandling.handle(err, this.translate);
                this.dispatch(state => ({
                    ...state,
                    error: {
                        message: msg.message
                    }
                }));
            })
            .finally(() => {
                this.dispatch(state => ({
                    ...state,
                    error: null,
                    isInitializing: false,
                    isFiltering: false
                }));    
            }); 
        };
}
