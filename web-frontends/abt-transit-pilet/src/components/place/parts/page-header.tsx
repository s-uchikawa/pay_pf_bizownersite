import * as React from 'react';
import { MessageIds } from '../../../messages';
import { Button, OptionButton, DownloadIcon, FilterIcon, PlusIcon, Menu, RefreshIcon, LoadingIcon } from 'paypf-bizowner-ui-elements'
import { Link } from 'react-router-dom';
import { useLocation, useHistory } from 'react-router-dom';
import { PlaceFilterState, PlaceInfoState, PlaceSearchByTextResult, PlaceSearchByTextState } from '../../../models/place-types'
import { PlaceSearchBox } from './place-search';


export interface PlacePartsPageHeaderProps {
    translate(key: MessageIds): string;
    /**
     * 絞り込みボタン押下時のイベント
     */
    onFilter(): void;
    /**
     * 作衛ボタン押下時のイベント
     */
    onCreate(): void;
    /**
    * ダウンロードボタン押下時のイベント
    */
    onDownload(): void;
    /**
    * CSVインポートボタン押下時のイベント
    */
    onCsvImport(): void;
    /**
    * 地点検索を選択した時のイベント
    */
    onSelected(placeId: string): void;
    /**
    * 更新を選択した時のイベント
    */
    onRefreshed(): void;

    // 非表示にする場合true
    hidden?: boolean;

    // 編集権限を持つかどうか
    canEdit:boolean;
    
    // 絞り込み状態かどうか 
    filterState: PlaceFilterState;

    // ダウンロード中かどうか
    isDownloading: boolean;

    // リフレッシュ中かどうか
    isRefreshing: boolean;

    mode:string;
    searchPlacesByText(searchText: string):void;
    searchPlacesByTextState: PlaceSearchByTextState;

}

const Tab: React.FC<{
    path: string,
    label: string,
}> = (props) => { 

    const location = useLocation();
    const relativePath = location.pathname;
    let active = relativePath.startsWith(props.path);

    return (
        <Link to={props.path}
            className={"mpp-px-6 mpp-block hover:mpp-text-blue-500 " + (active ? "mpp-font-semibold mpp-text-blue-500 mpp-border-b-4 mpp-border-blue-500": "mpp-font-midium mpp-text-gray-600")}>
            <button className={"mpp-h-full"}><span>{props.label}</span></button>
        </Link> 
    );
}

export const PlacePartsPageHeader: React.FC<PlacePartsPageHeaderProps> = ({
    translate,
    onFilter,
    onCreate,
    onDownload,
    onCsvImport,
    onSelected,
    onRefreshed,
    mode,
    searchPlacesByText: searchPlaces,
    searchPlacesByTextState,
    hidden,
    canEdit,
    filterState,
    isDownloading,
    isRefreshing,
}) => {
    const handleFilterButtonClick = () => { 
        if (onFilter) {
            onFilter();
        }
    }

    const handleCreateButtonClick = () => { 
        if (onCreate) {
            onCreate();
        }
    }

    const handleOptionButtonClick = (menuItemId: string) => { 
        if (menuItemId == "csv") {
            if (onCsvImport) {
                onCsvImport();
            }    
        }
    }

    const handleDownloadButtonClick = () => {
        if(onDownload){
            onDownload();
        }
    }

    // 地点検索で地点が選択されたとき
    const handlePlaceSelected = function(placeId: string) {
        if (onSelected) {
            onSelected(placeId);
        }
    }
    
    const handleRefreshButtonClick = () => { 
        if (onRefreshed) {
            onRefreshed();
        }
    }

    // 絞り込み中かどうかの判定
    const isStateFiltered: boolean =
        (filterState.name != null && filterState.name != "") 
        || (filterState.address != null && filterState.address != "")
        || filterState.categoryID != null 
        || filterState.iconID != null;
    let filterIconColor = isStateFiltered ? "coral" : undefined;
    let filterTextStyle = isStateFiltered ? "mpp-font-semibold" : undefined;

    // 処理中は、ボタンにローディングアニメを表示
    let loadingButtonIcon: React.ReactNode = null;
    if (isDownloading || isRefreshing) {
        loadingButtonIcon = <LoadingIcon size={16} color={"gray"}/>;
    }

    return (
        <div className={"mpp-flex mpp-flex-row" + (hidden ? " mpp-hidden" : "")} style={{height: "42px"}}>
            {/** タブ(地図/一覧) */}
            <nav className="mpp-flex mpp-flex-row">
                <Tab path="/places/map" label={translate(MessageIds.labelMap)} />
                <Tab path="/places/list" label={translate(MessageIds.labelList)} />
            </nav>

            {/** アクションボタン */}
            <div className="mpp-flex mpp-flex-row-reverse mpp-flex-grow">
                {/**
                  * アクションメニューボタン
                  * 編集権限がある場合のみ表示
                  * ※一括登録実装までコメントアウト
                  */}
                {/* {canEdit == true && 
                    <OptionButton 
                        anchorOrigin="bottom-right"
                        iconSize={16}
                        items={[
                            {id: "csv", label: translate(MessageIds.labelCsvImport)}
                        ]}
                        onMenuItemClick={(menuItemId) => handleOptionButtonClick(menuItemId) } />
                } */}
                
                {/**
                  *  ダウンロードボタン
                  *  幅が768px以下の場合はアイコンのみ表示
                  */}
                <Button icon={isDownloading == false ? <DownloadIcon size={16}/> : loadingButtonIcon} disabled={isDownloading} wSize="auto" onClick={handleDownloadButtonClick} contentMarginLeft="0px">
                    <span className="mpp-hidden md:mpp-block mpp-ml-0 md:mpp-ml-1.5">{translate(MessageIds.labelDownload)}</span>
                </Button>
                {/**
                  *  作成ボタン
                  *  幅が768px以下の場合はアイコンのみ表示
                  *  編集権限がある場合のみ表示
                  */}
                {canEdit == true && 
                    <Button icon={<PlusIcon  size={16}/>}  wSize="auto" onClick={handleCreateButtonClick} contentMarginLeft="0px">
                        <span className="mpp-hidden md:mpp-block mpp-ml-0 md:mpp-ml-1.5">{translate(MessageIds.labelCreate)}</span>
                    </Button>
                }
                {/**
                  *  更新ボタン
                  *  幅が768px以下の場合はアイコンのみ表示
                  */}
                <Button icon={isRefreshing == false ? <RefreshIcon  size={16}/> : loadingButtonIcon} disabled={isRefreshing} wSize="auto" onClick={handleRefreshButtonClick} contentMarginLeft="0px">
                    <span className={"mpp-hidden md:mpp-block mpp-ml-0 md:mpp-ml-1.5"}>{translate(MessageIds.labelRefresh)}</span>
                </Button>
                
                {/**
                  *  絞り込みボタン
                  *  幅が768px以下の場合はアイコンのみ表示
                  */}
                <Button icon={<FilterIcon  size={16} fillColor={filterIconColor} />}  wSize="auto" onClick={handleFilterButtonClick} contentMarginLeft="0px">
                    <span className={"mpp-hidden md:mpp-block mpp-ml-0 md:mpp-ml-1.5 " + filterTextStyle}>{translate(MessageIds.labelFilter)}</span>
                </Button>
                {/**
                  *  検索ボックス
                  *  地図モードの時のみ表示. 幅が768px以下の場合は非表示
                  */}
                {mode == 'map' && 
                    <div className="mpp-hidden md:mpp-inline-block"><PlaceSearchBox translate={translate} onPlaceSelected={handlePlaceSelected} searchPlacesByText={searchPlaces} data={searchPlacesByTextState}/></div>
                }
            </div>
        </div>
    );
}