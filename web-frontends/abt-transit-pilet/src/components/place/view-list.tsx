import * as React from 'react';
import { MessageIds } from '../../messages';
import { OptionButton, DataTable, DataTableColumn, DataTableSort, DataTableRow, DataTableCell, LoadingIcon } from 'paypf-bizowner-ui-elements';
import { PlaceFilterState, PlaceListState } from '../../models/place-types';
import { LoadPageOfList } from '../../actions';
import { placeIconAtras, placeIconMapping } from '../../assets'
import { PlaceListItem } from '../../models/mloca-bff-types';
import { useHistory } from "react-router-dom";

export interface PlaceViewListProps {
  // 非表示にする場合true
  hidden?: boolean;
  // 編集可能か
  canEdit: boolean;
  // 多言語変換
  translate(key: MessageIds): string;
  // 表示するデータ
  data: PlaceListState;
  // 現在のフィルター条件
  filter: PlaceFilterState;
  // ソートやページ変更時のアクション
  loadPageOfList: LoadPageOfList;
  onDetail: (placeId: number) => void;
  onDelete(placeId:number): void;

}

export const PlaceViewList: React.FC<PlaceViewListProps> = ({ canEdit, translate, data, loadPageOfList, filter, onDetail, onDelete, hidden }) => {  
  const [optionMenuItems, setOptionMenuItems] = React.useState(canEdit == true ? [{ id: "edit", label: translate(MessageIds.labelEdit)},{id:"delete", label:translate(MessageIds.labelDelete)}] : [{id:"view", label:translate(MessageIds.labelView)}])
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  /**
   * ソート成功時のコールバックハンドラ
   */
   const handleSortSuccess = () => {
    setIsLoading(false);
  }

  /**
   * ソート失敗時のコールバックハンドラ
   */
  const handleSortFailed = () => {
    setIsLoading(false);
  }

  // ソートキー
  const sortKeys: string[] = [
    undefined, "name", "categoryName", "address", undefined, "email", "tel"
  ];

  const handleOptionButtonClick = (menuItemId: string, placeId: number) => { 
    switch(menuItemId){
        case "edit":
            // 地点編集画面を開く 
            onDetail(placeId);
            break;
        case "view": 
            // 地点編集画面を開く(編集権限なし)
            onDetail(placeId);
            break;
        case "delete": 
            // 削除用APIを呼び出す
            onDelete(placeId);
            break;
    }
  }

  /**
   * ページ変更イベントの処理
   * @param page ページ番号
   */
  const handlePageChange = (page: number) => {
    setIsLoading(true)
    loadPageOfList({...filter}, page, handleSortSuccess, handleSortFailed)
  }

  /**
   * ソートイベントの処理
   * @param column  ソート対象の列インデックス
   * @param direction ソートの方向
   */
  const handleSort = (column: number, direction: "asc" | "desc") => {
    let sortKey: string = toSortKey(column);
    setIsLoading(true);
    loadPageOfList({...filter, sortKey: sortKey, sortDirection: direction}, data.pagenation.page, handleSortSuccess, handleSortFailed)
  }

  /**
   * 列インデックスからソートキーを返却します
   * @param columnIndex 列インデックス
   */
  const toSortKey = (columnIndex: number): string => {
    if (sortKeys.length > columnIndex) {
      return sortKeys[columnIndex];
    }
    return undefined;
  }

  /**
   * ソートキーを列インデックスに変換して返却します
   * @param columnIndex 列インデックス
   */
  const toSortColumn = (sortKey: string): number => {
     let columnIndex: number;

     sortKeys.map((value, idx) => {
      if (value == sortKey) {
        columnIndex = idx;
        return;
      }
     });

    return columnIndex;
  }

  // 一覧の各ヘッダ―名をセット
  let cols: DataTableColumn[] = [
    {header: "", width: "48px", align: "center"}, 
    {header: translate(MessageIds.labelName), minWidth: "256px", align: "left", sortable: true},
    {header: translate(MessageIds.labelCategory), width: "128px", align: "left", sortable: true},
    {header: translate(MessageIds.labelAddress), width: "256px", align: "left", sortable: true},
    {header: translate(MessageIds.labelListColGeofence), width: "128px", align: "left"},
    {header: translate(MessageIds.labelEmail), width: "256px", align: "left", sortable: true},
    {header: translate(MessageIds.labelTel), width: "256px", align: "left", sortable: true},
    {header: "", width: "78px", align: "center"},
  ];

  // 一覧のボディ表示用データの作成
  let rows: DataTableRow[] = [];
  if (data && data.data) {
    for (var i = 0; i < data.data.length; i++) {
      const item: PlaceListItem = data.data[i];
      const iconMapping = placeIconMapping["marker-" + item.iconID];
      const icon = (
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
          </div>);

      const actionButton = (
        <OptionButton 
          anchorOrigin="bottom-right"
          iconSize={20}
          items={optionMenuItems}
          onMenuItemClick={(menuItemId) => handleOptionButtonClick(menuItemId, item.id) } />
      );

      const cells: DataTableCell[] = [
        {component: icon, align: "center"},
        {component: item.name},
        {component: item.categoryName},
        {component: item.address},
        {component: item.geofence && (item.geofence.distance + item.geofence.unit)},
        {component: item.email},
        {component: item.tel},
        {component: actionButton},
      ];
      rows.push({ cells: cells });
    }  
  }

  let sort: DataTableSort;
  if (filter && filter.sortKey) {
    sort = {
      column: toSortColumn(filter.sortKey),
      direction: filter.sortDirection
    };  
  }

  return (
    <div className={"mpp-relative mpp-h-full mpp-w-full" + (hidden ? " mpp-hidden" : "")}>
      <DataTable 
        columns={cols} 
        rows={rows} 
        pageCount={data?.pagenation?.totalPages ?? 0} 
        currentPage={data?.pagenation?.page ?? 0} 
        sort={sort} 
        onSort={handleSort}
        isLoading={isLoading}
        loadingIconColor={'blue'}
        onPageChange={handlePageChange} />
    </div>
  )
};