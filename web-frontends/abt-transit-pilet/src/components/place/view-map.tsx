import * as React from 'react';
import { MessageIds } from '../../messages';
import { BaseGoogleMapRef, BasicGoogleMap } from "./elements/basic-google-map";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { PlaceMapState } from '../../models/place-types'
import { PlaceMapItem } from '../../models/mloca-bff-types'
import { PlaceMapIconClusterLayer } from './elements/place-map-icon-cluster-layer';
import { MenuItem } from 'paypf-bizowner-ui-elements';
import { PickInfo } from '@deck.gl/core/lib/deck'
import { placeIconAtras, placeIconMapping, placeClusterIconAtras, placeClusterIconMapping } from '../../assets'


/**
 * useRefで提供するインターフェース
 */
export interface PlaceViewMapRef {
  // 地図の中心緯度
  latitude(): number; 
  // 地図の中心経度
  longitude(): number; 
  // 地図のズーム
  zoom(): number;
  // 地図のズームレベル変更
  setZoom(zoom: number): void; 
}

export interface PlaceViewMapProps {
  // 非表示にする場合true
  hidden?: boolean;
  // 編集可能か. trueの場合、地図の右クリックメニューに編集や削除が表示される
  canEdit: boolean;
  // 多言語変換
  translate(key: MessageIds): string;
  // 指定された地点IDの場所に地図の中心を移動
  placeId: number;
  // 地図にアイコン表示する地点データ
  data: PlaceMapState;
  // 地図の右クリックメニューで編集または詳細が選択されたときのイベント
  onDetail: (placeId: number) => void;
  onDelete: (placeId: number) => void;
}

export const PlaceViewMap = React.forwardRef<PlaceViewMapRef, PlaceViewMapProps>((
  { canEdit, translate, placeId, data, onDetail, hidden, onDelete }, 
  ref) => 
{  
  const iconHovering = React.useRef(null);
  const tooltip = React.useRef(null);
  const contextMenuPlaceId = React.useRef(null);
  const gmap = React.useRef<BaseGoogleMapRef>(null);
  const deckOverlay = React.useRef<GoogleMapsOverlay>(null);
  const places = React.useRef<PlaceMapItem[]>([]);
  const ua = window.navigator.userAgent.toLowerCase();

  let center: google.maps.LatLngLiteral;

  React.useImperativeHandle(ref, () => ({
    latitude: () => {
      return gmap.current.center().lat;      
    },
    longitude: () => {
      return gmap.current.center().lng;      
    },
    zoom: () => {
      return gmap.current.zoom();      
    },
    setZoom: (zoom:number) => {
      gmap.current.setZoom(zoom);
    }
  }));

  if (data) {
    places.current = data.places;

    // 地点IDが指定された場合は、その地点を地図の中心にする
    if (placeId) {
      let selectedPlace: PlaceMapItem = places.current.find((value) => {
        if (value.id == placeId) {
          return value;
        }
      });
      center = { lat: selectedPlace.latitude, lng: selectedPlace.longitude };
    }
  }

  /**
   * アイコンHover時
   * 
   * ツールチップの表示とカーソル形状の変更を行う
   */
  const handleIconHover = (o: PickInfo<PlaceMapItem>, e: HammerInput): any => {
    if (o.object && o.object.name) {
      tooltip.current = o.object.name;
      iconHovering.current = o.object.id;
    } else {
      tooltip.current = null;
      iconHovering.current = null;
    }    
  }

  /**
   * iPadなどのタップ時のツールチップ表示用
   * handleIconHoverと同等機能を実装
   */
  const handleOnClickForTablet = (o: PickInfo<PlaceMapItem>, e: HammerInput):any => {
    // タブレット/スマホのみ反応
    if(ua.indexOf('iphone') > -1 || ua.indexOf('android') > -1 || ua.indexOf('ipad') > -1  || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)){
      if (o.object && o.object.name) {
        tooltip.current = o.object.name;
        iconHovering.current = o.object.id;
      }
    }
  }

  /**
   * コンテキストメニュー選択時
   * @param mode メニューモード
   */
  const handleContextMenuClick = (mode: string) => {
    switch (mode) {
      case "edit":
      case "view":
        onDetail(contextMenuPlaceId.current);
        break;
      case "delete":
        onDelete(contextMenuPlaceId.current);
        break;
    }
  }

  /**
   * 地図右クリック時のコンテキストメニュー取得
   * 
   * アイコンの上にカーソルがあればコンテキストメニューを表示する
   */
  const getContextMenu = (latlng: google.maps.LatLngLiteral, pos: google.maps.Point, onClose: () => void) => {
    if (iconHovering.current) {
      let menus = [];
      contextMenuPlaceId.current = iconHovering.current;
      if (canEdit) {
        menus.push(<MenuItem id="menuItem1" key="edit" onClick={() => { onClose(); handleContextMenuClick("edit"); }}>{translate(MessageIds.labelEdit)}</MenuItem>)
        menus.push(<MenuItem id="menuItem3" key="delete" onClick={() => { onClose(); handleContextMenuClick("delete"); }}>{translate(MessageIds.labelDelete)}</MenuItem>)
      } else {
        menus.push(<MenuItem id="menuItem2" key="view" onClick={() => { onClose(); handleContextMenuClick("view"); }}>{translate(MessageIds.labelView)}</MenuItem>)
      }

      return menus;
    }
  }

  /**
   * ツールチップ取得
   * 
   * アイコンの上にカーソルがあればツールチップを表示する
   */
   const getTooltip = (latlng: google.maps.LatLngLiteral, pos: google.maps.Point) => {
    return tooltip.current;
  }

  //google mapにオーバーレイするDeck.glレイヤー
  const gmapOverlayProps = {
      style: { "cursor": "pointer"},
      layers: [
        new PlaceMapIconClusterLayer({
          id: "icon-cluster",
          sizeScale: 40,
          data: places.current,
          pickable: true,
          getPosition: d => [d.longitude, d.latitude],
          iconAtlas: placeIconAtras,
          iconMapping: placeIconMapping,
          clusterIconAtlas: placeClusterIconAtras,
          clusterIconMapping: placeClusterIconMapping,   
          clusterZoom: 10,
          onHover: handleIconHover,
          onClick: handleOnClickForTablet,
        })
      ]
  };
  if (!deckOverlay.current) {
    deckOverlay.current = new GoogleMapsOverlay(gmapOverlayProps);  
  } else {
    deckOverlay.current.setProps(gmapOverlayProps);
  }

  return (
    <div id="place-map-view" className={"mpp-h-full mpp-w-full mpp-relative" + (hidden ? " mpp-hidden" : "")}>
      <BasicGoogleMap
          id="map"   
          ref={gmap}   
          deckOverlay={deckOverlay.current}  
          center={center}
          getContextMenu={getContextMenu}
          getTooltip={getTooltip}
        />
    </div>
  )
});
