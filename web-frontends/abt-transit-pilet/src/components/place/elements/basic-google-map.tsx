import * as React from 'react';
import { GoogleMap } from "@react-google-maps/api";

export interface MapTooltip {
    open: boolean;
    text: string;
    offsetX: string;
    offsetY: string;
}

/**
 * useRefで提供するインターフェース
 */
 export interface BaseGoogleMapRef {
    // 地図の中心座標
    center(): google.maps.LatLngLiteral; 
    // 地図のズーム
    zoom(): number;
    // 地図のズームレベル変更イベント
    setZoom(zoom: number): void; 
  }

export interface BasicGoogleMapProps {
    id: string,
    zoom?: number,
    center?: google.maps.LatLng | google.maps.LatLngLiteral,
    deckOverlay?: any,
    tooltip?: MapTooltip,
    centerIcon?: google.maps.Icon,
    centerCircle?: google.maps.CircleOptions,
    draggable?: boolean,
    getContextMenu?: (latlng: google.maps.LatLngLiteral, pos: google.maps.Point, onClose: () => void) => React.ReactNode,
    getTooltip?: (latlng: google.maps.LatLngLiteral, pos: google.maps.Point) => string,
    onCenterChanged?: (latlng: google.maps.LatLngLiteral) => void,
    // ズーム変更イベント
    onZoomChanged?: (zoom: number) => void,
    // 地点登録・編集時のマーカーとジオフェンス円をセットする
    setMarkerAndCircle?: (map:google.maps.Map) => void,
    children?: React.ReactNode
}

export const BasicGoogleMap = React.forwardRef<BaseGoogleMapRef, BasicGoogleMapProps>((
    {
        id,
        zoom,
        center,
        deckOverlay,
        tooltip,
        centerIcon,
        centerCircle,
        draggable,
        getTooltip,
        getContextMenu,
        onCenterChanged,
        onZoomChanged,
        setMarkerAndCircle,
        ...props
    }, 
    ref) => 
{

    const [contextMenuItems, setContextMenuItems] = React.useState(null);
    const mapContainer = React.useRef(null);
    const gmap = React.useRef(null);
    const contextMenuEl = React.useRef(null);
    const tooltipEl = React.useRef(null);
    const tooltipContentEl = React.useRef(null);
    const tooltipOpen = React.useRef(false);
    const contextMenuOpen = React.useRef(false);
    const currentCenterIcon = React.useRef(centerIcon);
    const currentCenterCircle = React.useRef(centerCircle);
  
    let mapMousedownTime: number;
    let mapMouseupTime: number;

    React.useImperativeHandle(ref, () => ({
        center: () => {
          return { lat: gmap.current.center.lat(), lng: gmap.current.center.lng() };      
        },
        zoom: () => {
          return gmap.current.zoom;      
        },
        setZoom: (zoom: number) => {
            gmap.current.setZoom(zoom);
        }
      }));


    React.useEffect(() => {
        currentCenterIcon.current = centerIcon;
        currentCenterCircle.current = centerCircle;

    }, [centerIcon, centerCircle]);

    // 右クリック時のコンテキストメニュー表示
    const hadleRightClick = (event: any) => {
        contextMenuOpen.current = false;
        //コンテキストメニューを開いたときにはツールチップを非表示にする
        hideTooltip();

        if (getContextMenu) {
            let menuItems = getContextMenu(
                {lat: event.latLng.lat(), lng: event.latLng.lng()},
                new google.maps.Point(event.domEvent.offsetX, event.domEvent.offsetY),
                hideContextMenu);
            if (menuItems) {
                if (gmap.current && contextMenuEl.current) {
                    setContextMenuItems(menuItems);
                    const ua = window.navigator.userAgent.toLowerCase();
                    if(ua.indexOf('iphone') > -1 || ua.indexOf('android') > -1 || ua.indexOf('ipad') > -1  || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)){
                        // タブレット/スマホ用
                        showContextMenu(event.pixel.y, event.pixel.x);
                    }else{
                        // PC用
                        showContextMenu(event.domEvent.offsetY, event.domEvent.offsetX);
                    }
                }
            }
        }
    }

    const showContextMenu = (x: number, y: number) => {
        if (gmap.current && contextMenuEl.current) {
            contextMenuOpen.current = true;
            contextMenuEl.current.style.top = x + "px";
            contextMenuEl.current.style.left = y + "px";
            contextMenuEl.current.style.display = 'block';
        }
    }

    const hideContextMenu = () => {
        contextMenuOpen.current = false;
        if (contextMenuEl.current != null) {
            contextMenuEl.current.style.display = 'none';
        }
    }

    const hideTooltip = () => {
        if (gmap.current && tooltipEl.current) {
            tooltipEl.current.style.display='none';
            gmap.current.setOptions({draggableCursor: "grab"});
        }
    }

    const handleMouseMove = (event: any) => {
        tooltipOpen.current = false;
        // コンテキストメニュー表示中はツールチップを表示しない
        if (contextMenuOpen.current) {
            return;
        }
        if (getTooltip) {
            let tooltip = getTooltip({lat: event.latLng.lat(), lng: event.latLng.lng()}, new google.maps.Point(event.domEvent.offsetX, event.domEvent.offsetY));
            if (tooltip) {
                if (gmap.current && tooltipEl.current) {
                    const ua = window.navigator.userAgent.toLowerCase();
                    if(ua.indexOf('iphone') > -1 || ua.indexOf('android') > -1 || ua.indexOf('ipad') > -1  || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)){
                        // タブレット/スマホ用
                        tooltipEl.current.style.top = (event.pixel.y + 10) + "px";
                        tooltipEl.current.style.left = (event.pixel.x + 10) + "px";
                    }else{
                        // PC用
                        tooltipEl.current.style.top = (event.domEvent.offsetY + 10) + "px";
                        tooltipEl.current.style.left = (event.domEvent.offsetX + 10) + "px";
                    }

                    tooltipEl.current.style.display='block';
                    tooltipContentEl.current.innerText = tooltip;
                    gmap.current.setOptions({draggableCursor: "pointer"});
                    tooltipOpen.current = true;
                }
            } else {
                if (gmap.current && tooltipEl.current) {
                    tooltipEl.current.style.display='none';
                    gmap.current.setOptions({draggableCursor: "grab"});
                }
            }
        }
    }

    const setGmap = (map: google.maps.Map) => {
        gmap.current = map;

        // 登録・編集でのマーカー,ジオフェンス円の配置
        if(setMarkerAndCircle){
            setMarkerAndCircle(map);
        }
    
        //右クリックの処理
        google.maps.event.addListener(map, 'rightclick', function (event: any) {
            setTimeout(() => hadleRightClick(event), 0);
        });
    
        //ロングタップの処理
        google.maps.event.addListener(map, 'mousedown', function (event) {
            mapMousedownTime = new Date().getTime();
        });
    
        google.maps.event.addListener(map, 'mouseup', function (event) {
            if (mapMousedownTime) {
                mapMouseupTime = new Date().getTime();
                let longpress = (mapMouseupTime - mapMousedownTime < 500) ? false : true;
                mapMousedownTime = undefined;
            
                if(longpress){
                    const ua = window.navigator.userAgent.toLowerCase();
                    // タブレット/スマホのみ
                    if(ua.indexOf('iphone') > -1 || ua.indexOf('android') > -1 || ua.indexOf('ipad') > -1  || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)){
                        // マウスの右クリック処理を呼び出す(コンテキストメニューの表示)
                        setTimeout(() => hadleRightClick(event), 0);
                    }
                }
          }
        });
   
        google.maps.event.addListener(map, 'center_changed', function (event: any) {
            hideContextMenu();
            hideTooltip();
        });

        google.maps.event.addListener(map, 'zoom_changed', function (event: any) {
            hideContextMenu();
            if (onZoomChanged) {
                onZoomChanged(map.getZoom());
            }
        });

        google.maps.event.addListener(map, 'dragend', function (event: any) {
            hideContextMenu();
            hideTooltip();
        });        

        google.maps.event.addListener(map, 'click', function (event: any) {
            hideContextMenu();
            const ua = window.navigator.userAgent.toLowerCase();
            if(ua.indexOf('iphone') > -1 || ua.indexOf('android') > -1 || ua.indexOf('ipad') > -1  || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)){
                // マウスムーブイベントを発火
                handleMouseMove(event);
            }
        });        

        google.maps.event.addListener(map, 'mousemove', function (event: any) {
            handleMouseMove(event);
        });        

    }

    // 初期位置
    // 1. ジオロケーションAPIが使える場合は取得した現在地
    // 2. ダメな場合は、東京駅
    let mapCenter = center;
    if (mapCenter == null) {
        if (gmap.current) {
            mapCenter = {lat: gmap.current.center.lat(), lng: gmap.current.center.lng()};    
        } else {
            mapCenter = {lat: 0, lng: 0};
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        if (gmap.current) {
                            if (gmap.current.center.lat() == 0 && gmap.current.center.lng() == 0) {
                                gmap.current.setCenter({lat: pos.coords.latitude, lng: pos.coords.longitude});
                            }
                        }
                    }, () => {
                        if (gmap.current.center.lat() == 0 && gmap.current.center.lng() == 0) {
                            // ジオロケーション失敗時
                            gmap.current.setCenter({lat: 35.6809591, lng: 139.7673068});
                        }
                    });
            }    
        }
    }
    let mapZoom = zoom;
    if (mapZoom == null) {
        if (gmap.current) {
            mapZoom= gmap.current.zoom;    
        } else {
            mapZoom = 10;
        }
    }

    return (
        <div ref={mapContainer} className="mpp-h-full mpp-w-full mpp-relative">
            <div ref={tooltipEl} style={{display: 'none'}}
                className="mpp-absolute mpp-z-50 mpp-pointer-events-none mpp-bg-white mpp-border-0 mpp-mb-3 mpp-block mpp-font-normal mpp-leading-normal mpp-text-sm mpp-max-w-xs mpp-text-left mpp-no-underline mpp-break-words mpp-rounded-lg">
                <div>
                    <div ref={tooltipContentEl} className="mpp-bg-white mpp-text-gray mpp-opacity-75 mpp-p-3 mpp-mb-0 mpp-border mpp-border-solid mpp-uppercase mpp-rounded"></div>
                </div>
            </div>    

            <div ref={contextMenuEl} style={{display: 'none'}}
                className="mpp-bg-white mpp-w-40 mpp-border mpp-border-gray-500 mpp-z-50 mpp-absolute">
                {contextMenuItems}
            </div>

            <GoogleMap
                id={id}
                mapContainerClassName="mpp-h-full mpp-w-full"
                zoom={mapZoom}
                center={mapCenter}
                options={{streetViewControl: false, fullscreenControl: false, draggable: draggable ?? true, gestureHandling: "greedy", clickableIcons:false}}        
                onLoad={map => {
                    if (deckOverlay) {
                        deckOverlay.setMap(map); //Google MapsにDeck.gl
                    }
                    setGmap(map);
                }}>
                    
                {props.children}
            </GoogleMap>
        </div>
    );
});