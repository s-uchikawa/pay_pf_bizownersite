import * as React from 'react';
import { MessageIds } from '../../../messages';
import { PlaceSearchByTextState } from '../../../models/place-types';
import { Input, MenuItem, LoadingIcon } from 'paypf-bizowner-ui-elements'
import { placeIconAtras, placeIconMapping } from '../../../assets'
import { SearchByText } from '../../../actions';

/**
 * 地点検索　コンポーネントのProps
 */
export interface PlaceSearchBoxProps{
    // 多言語変換
    translate(key: MessageIds): string;
    // 検索結果の選択時
    onPlaceSelected(placeId: string):void;
    // 地点検索アクション
    searchPlacesByText: SearchByText;
    // 地点検索結果のデータ(検索結果、処理中かどうかのフラグ)
    data: PlaceSearchByTextState;
}

/**
 * 地点検索テキストボックス　検索・結果表示フォーム
 */
export const PlaceSearchBox:React.FC<PlaceSearchBoxProps> = ({ translate, onPlaceSelected, searchPlacesByText: searchPlaces, data }) => {
    const [searchText, setSearchText] = React.useState('');
    const [abort, setAbort] = React.useState<AbortController>(undefined);
    const [timeoutid, setTimeoutId] = React.useState<NodeJS.Timeout>(undefined);
    var result = undefined;

    /**
     * 地点検索テキストボックスの入力値取得
     */
    const handleChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value.trim());

        // 即時処理してしまうとアクセスが多くなりすぎてしまうため、200ms待ってから処理する
        // 待機中に次のイベントが発生した場合は取り消す
        if (timeoutid) {
            clearTimeout(timeoutid);
        }
        const timer = setTimeout(() => {
            // ひとつ前のアクションを中止
            if (abort) {
                abort.abort();
            }
            const abortController = new AbortController();
            searchPlaces(event.target.value.trim(), abortController.signal);
            setAbort(abortController);
        }, 200);
        setTimeoutId(timer);
    }

    /**
     * 地点が選択された時のイベント
     */
    const handleSelected = (placeId: string) => {
        onPlaceSelected(placeId)
    }

    /**
     * 検索結果が1件以上の場合に表示する検索結果部作成
     */
    const renderResult = () => {
        return (
            <ul className="mpp-z-10 mpp-bg-white mpp-absolute mpp-w-full mpp-max-w-xl mpp-overflow-auto mpp-max-h-48">
                {data.result.map(item => {
                        let iconMapping = placeIconMapping["marker-" + item.iconID];
                        let icon = (
                            <div style={{width: "32px", height: "32px"}}>
                                <div style={{width: "64px", height: "64px", transform: "scale(0.5, 0.5)  translate(-48px, -32px)"}}>
                                        <img src={placeIconAtras}
                                            style={{ 
                                            width: iconMapping.width + "px", 
                                            height: iconMapping.height + "px", 
                                            objectFit: "none", 
                                            objectPosition: (iconMapping.x * -1) + "px" + " " + (iconMapping.y * -1) + "px" 
                                            }}/>                                
                                </div>
                            </div>
                        );

                        return (
                            <MenuItem 
                                id={item.id} 
                                key={item.id} 
                                icon={icon} 
                                onClick={() => handleSelected(item.id)} >
                                {item.name}
                            </MenuItem>
                        );
                    }
                )}
            </ul>);
    }

    /**
     * 検索結果が0件の場合に表示する検索結果部作成
     */
    const renderNoMatchResult = () => {
        return (
            <ul className="mpp-z-10 mpp-bg-white mpp-absolute mpp-w-auto mpp-max-w-2xl mpp-overflow-y-auto mpp-max-h-48">
                <li className="mpp-w-auto mpp-h-10 mpp-px-4 mpp-py-2 mpp-text-gray-500 mpp-text-lg">
                    <div className="mpp-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"  viewBox="0 -5 24 24">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                        </svg>
                        {translate(MessageIds.labelNotFoundPlace)}
                    </div>
                </li>
            </ul>);
    }

    /**
     * 検索中に表示する検索結果部作成
     */
     const renderLoadingResult = () => {
        return (
            <div className="mpp-z-10 mpp-bg-white mpp-absolute mpp-w-64 mpp-max-w-2xl mpp-max-h-48 mpp-flex mpp-justify-center">
                <div className="mpp-w-auto mpp-h-10 mpp-px-4 mpp-py-2">
                    <LoadingIcon size={20} color="black" />
                </div>
            </div>);
    }

    result = <></>;

    if (data && data.isLoading) {
        result = renderLoadingResult();
    }
    else if (data && data.result) {
        if(data.result.length > 0 && searchText.length > 0){
            // 検索結果が見つかった場合
            result = renderResult();
    
        } else if (data.result.length == 0 && searchText.length > 0){
            // 検索結果がない場合
            result = renderNoMatchResult();
        }    
    }

    return (
        <div>
            <Input id="place-search-box" name="place-search" type="search" value={searchText} placeholder={translate(MessageIds.labelPlaceSearchPlaceHolder)} onChange={handleChangeInputText}/>
            {result}
        </div>
    )
}

