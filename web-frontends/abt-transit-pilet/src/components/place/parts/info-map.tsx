import * as React from 'react';
import { MessageIds } from '../../../messages';
import { BaseGoogleMapRef, BasicGoogleMap } from "../elements/basic-google-map";
import { Circle, Marker } from "@react-google-maps/api";
import { placeIconAtras, placeIconMapping } from '../../../assets'
import { PlaceInfoState } from '../../../models/place-types';

export interface PlacePartsInfoMapProps {
    // 多言語変換
    translate(key: MessageIds): string;
    // 編集可能かどうか
    canEdit: boolean;
    // 表示するデータ
    data: PlaceInfoState;
    // 初期ズーム
    initialZoom?: number;
    // データを編集したときに発生するイベント
    onEdit?: (editingData: PlaceInfoState) => void;
}

export const PlacePartsInfoMap: React.FC<PlacePartsInfoMapProps> = ({
    translate,
    canEdit,
    initialZoom,
    onEdit,
    data,
}) => {

    let pos = React.useRef<google.maps.LatLngLiteral>({lat: data.latitude, lng: data.longitude});
    let stateData = React.useRef<PlaceInfoState>(data);
    let placeIcon: google.maps.Icon = null;
    let geofenceCircle: google.maps.CircleOptions = {
        strokeColor: '#7C7FD4',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#7C7FD4',
        fillOpacity: 0.27,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 0,
        zIndex: 1        
    };
    const gmap = React.useRef<BaseGoogleMapRef>(null);
    const currentGmap = React.useRef(null);
    let marker: google.maps.Marker = null;
    let currentMarker = React.useRef<google.maps.Marker>(null);
    let currentCircle = React.useRef<google.maps.Circle>(null);
    let beforeIconID = React.useRef<number>(null);

    stateData.current = data;
    if (data) {
        let iconMapping = placeIconMapping["marker-" + data.iconID];
        if (iconMapping == null) {
            console.error("icon mapping not found. place-icon-mapping.json. iconId = " + data.iconID);
        } else {
            placeIcon = {
                url: placeIconAtras,
                size: new google.maps.Size(iconMapping.width, iconMapping.height),
                origin: new google.maps.Point(iconMapping.x, iconMapping.y),
                anchor: new google.maps.Point(iconMapping.anchorX ?? 0, iconMapping.anchorY ?? 0),
            };    
        }

        // セット時とアイコンが変わってる場合マーカーのアイコンをセットし直す
        if(data.iconID != beforeIconID.current){
            if(currentMarker.current){
                currentMarker.current.setIcon(placeIcon);
                beforeIconID.current = data.iconID;
            }
        }

        // ジオフェンスが設定されている場合
        if (data.useGeofence && data.geofenceDistance) {
            geofenceCircle.radius = data.geofenceDistance;

            if (data.geofenceDistanceUnit == "ft") {
                geofenceCircle.radius = data.geofenceDistance * 3.281;
            }

            if(currentCircle.current == null){
                geofenceCircle.visible = true;
                geofenceCircle.map = currentGmap.current;

                // 新しいジオフェンス円を描画
                var geofenceCircles = new google.maps.Circle(geofenceCircle)

                currentCircle.current = geofenceCircles;
            }else{
                currentCircle.current.setVisible(true);
                currentCircle.current.setRadius(geofenceCircle.radius);
                currentCircle.current.setCenter(pos.current);
            }

        } else {
            // オフになったときは中心円を非表示にする
            geofenceCircle.visible = false;

            // 円を隠す
            if(currentCircle.current){
                currentCircle.current.setVisible(false);
            }
        }
    }

    /**
     * 地図移動時
     */
    const handleMapCenterChanged = (latlng: google.maps.LatLngLiteral): void => {        
        if (canEdit) {
            if (pos.current.lat != latlng.lat || pos.current.lng != latlng.lng) {
                let o = Object.assign({}, stateData.current);

                o.latitude = latlng.lat;
                o.longitude = latlng.lng;
        
                if (onEdit) {
                    onEdit(o);    
                }    
            }
        }
        pos.current = latlng;
    }

    /**
     * マーカーとジオフェンス円を配置します
     * @param map 
     */
    const setMarkerAndCircle = (map: google.maps.Map) => {
        currentGmap.current = map;
        if(marker == null){
            // セット時のアイコンIDを保持しておく
            beforeIconID.current = stateData.current.iconID;

            marker = new google.maps.Marker({
                map:map,
                position:new google.maps.LatLng(pos.current.lat, pos.current.lng),
                animation: google.maps.Animation.DROP,
                icon:{
                    url:placeIcon.url,
                    size:placeIcon.size,
                    origin:placeIcon.origin,
                    anchor:placeIcon.anchor
                },
                draggable:true // ドラッグ移動可能
            })
            
            currentMarker.current = marker;

            // 新しいジオフェンス円を描画(初期化)
            var geofenceCircles = new google.maps.Circle({
                strokeColor: '#7C7FD4',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#7C7FD4',
                fillOpacity: 0.27,
                clickable: false,
                draggable: false,
                editable: false,
                visible: stateData.current.useGeofence ? stateData.current.useGeofence : false,
                radius: stateData.current.geofenceDistance ? stateData.current.geofenceDistance : 0,
                zIndex: 1,
                map:map,
                center:pos.current
            })

            currentCircle.current = geofenceCircles;

            // マーカー移動時の処理
            google.maps.event.addListener(marker, 'dragend', function(event: google.maps.MapMouseEvent) {
                var latlng: google.maps.LatLngLiteral = {lat: event.latLng.lat(), lng:event.latLng.lng()}
                handleMapCenterChanged(latlng);
                map.panTo(latlng);

                // ジオフェンス円を削除
                if(currentCircle.current && stateData.current.useGeofence){
                    currentCircle.current.setMap(null);

                    // 新しいジオフェンス円を描画
                    var geofenceCircles = new google.maps.Circle({
                        strokeColor: '#7C7FD4',
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        fillColor: '#7C7FD4',
                        fillOpacity: 0.27,
                        clickable: false,
                        draggable: false,
                        editable: false,
                        visible: true,
                        radius: geofenceCircle.radius ? geofenceCircle.radius : stateData.current.geofenceDistance,
                        zIndex: 1,
                        map:map,
                        center:pos.current
                    })

                    currentCircle.current = geofenceCircles;
                }
            })
        }
    }

    return (
        <div className="mpp-h-full mpp-w-full mpp-relative">
            <BasicGoogleMap
                id="place-info-map"
                ref={gmap}
                zoom={initialZoom}
                draggable={canEdit}
                center={pos.current}
                centerIcon={canEdit ? placeIcon : null}
                centerCircle={canEdit ? geofenceCircle : null}
                onCenterChanged={handleMapCenterChanged}
                setMarkerAndCircle={setMarkerAndCircle}>

                { canEdit == false && <Marker position={pos.current} icon={placeIcon} animation={google.maps.Animation.DROP}/> }
                { canEdit == false && data.useGeofence && data.geofenceDistance && <Circle center={pos.current} radius={geofenceCircle.radius} options={geofenceCircle} /> }
                </BasicGoogleMap>
        </div>
    );
}