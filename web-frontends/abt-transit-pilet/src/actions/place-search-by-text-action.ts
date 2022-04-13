import { StateContainerReducer } from 'paypf-bizowner-piral';
import { MlocaBff } from '../apis/mloca-bff';
import { ErrorHandling } from '../error-handling';
import { PlacePageState } from '../models/place-types';

/**
 * 地点のテキスト検索インターフェース
 */
export type SearchByText = (text: string, abortSignal: AbortSignal) => void;

/**
 * 地点のテキスト検索のアクション
 */
export class SearchByTextAction {
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
    public execute: SearchByText = (text: string, abortSignal: AbortSignal) => {

        // 検索ボックスにテキストが入力されていないときはロード状態をfalseにしてBFFは呼び出さない
        // 前回の検索結果も削除
        if(!text){
            this.dispatch(state => ({
                ...state,
                error: null,
                searchByText:{
                    isLoading:false,
                    result:[]
                }
            }))
        }else{
            this.dispatch(state => ({
                ...state,
                error: null,
                searchByText: {
                    ...state.searchByText,      
                    isLoading: true
                }
            }));

            const placeSearch = this.mlocaBff.searchPlacesByText(text, abortSignal)
            .then((result) => {
                this.dispatch(state => ({
                    ...state,
                    error: null,
                    searchByText: {            
                        isLoading: false,            
                        result
                    }
                }));
            }).catch(err => {
                // 中断の場合
                if (err && err.name === "AbortError") {
                    console.log(err.message);
                    return;
                }                
                const msg = ErrorHandling.handle(err, this.translate);
                this.dispatch(state => ({
                    ...state,
                    searchByText: {
                        ...state.searchByText,
                        isLoading: false
                    },
                    error: {
                        message: msg.message
                    }
                }));
            });
        }

        
    };
}
