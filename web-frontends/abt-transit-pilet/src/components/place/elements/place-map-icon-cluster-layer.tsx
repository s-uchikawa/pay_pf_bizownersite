import * as React from 'react';
import {CompositeLayer} from '@deck.gl/core';
import {CompositeLayerProps} from '@deck.gl/core/lib/composite-layer';
import {UpdateStateInfo,LayerInputHandler} from '@deck.gl/core/lib/layer';
import {Position} from '@deck.gl/core/utils/positions'
import {IconMapping} from '@deck.gl/layers/icon-layer/icon-layer'
import {IconLayer} from '@deck.gl/layers';
import {IconLayerProps} from '@deck.gl/layers/icon-layer/icon-layer';
import Supercluster from 'supercluster';
import {PlaceMapItem} from '../../../models/mloca-bff-types'
    
export interface PlaceMapIconClusterLayerProps extends CompositeLayerProps<PlaceMapItem> {
  data: PlaceMapItem[];
  sizeScale: number;
  getPosition: (x: PlaceMapItem) => Position;
  iconAtlas: string;
  iconMapping: IconMapping;
  
  // このズームレベル以下の場合にクラスタ化する
  clusterZoom: number;

  clusterIconAtlas: string;
  clusterIconMapping: IconMapping;  
}

export interface PlaceMapIconLayerProps extends IconLayerProps<PlaceMapItem> {
    data: PlaceMapItem[];
}

export class PlaceMapIconClusterLayer extends CompositeLayer<PlaceMapItem, PlaceMapIconClusterLayerProps> {    
    constructor(props: PlaceMapIconClusterLayerProps) {
        super(props);        
    }
    
    shouldUpdateState({oldProps, props, context, changeFlags}: UpdateStateInfo<PlaceMapIconClusterLayerProps>) {
        return changeFlags.somethingChanged;
    }

    updateState({oldProps, props, context, changeFlags}: UpdateStateInfo<PlaceMapIconClusterLayerProps>) {
        const z = Math.round(this.context.viewport.zoom);
        
        // アイコンスラスター
        const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;
        
        if (rebuildIndex) {
          const index = new Supercluster({maxZoom: 16, radius: props.sizeScale * Math.sqrt(2)});
          index.load(
            props.data.map(d => ({
              geometry: {coordinates: props.getPosition(d)},
              properties: d
            }))
          );
          this.setState({index});
        }
    
        if (props.clusterZoom && z > props.clusterZoom) {
            if (changeFlags.dataChanged || this.state.data == undefined || this.state.data.length == 0) {
                this.setState({
                    data: props.data,
                    clusterData: [],
                    z
                });        
            }
        } else {
            if (rebuildIndex || z !== this.state.z) {
                if (this.state.index) {
                    this.setState({
                        data: [],
                        clusterData: this.state.index.getClusters([-180, -85, 180, 85], z),
                        z
                      });      
                }
            }      
        }
    }

    getPickingInfo({info, mode}) {
        const pickedObject = info.object && info.object.properties;
        if (pickedObject) {
          if (pickedObject.cluster && mode !== 'hover') {
            info.objects = this.state.index
              .getLeaves(pickedObject.cluster_id, 25)
              .map(f => f.properties);
          }
          info.object = pickedObject;
        }
        return info;
    }    

    renderLayers() {
        const {data, clusterData} = this.state;
        const {iconAtlas, iconMapping, clusterIconAtlas, clusterIconMapping, sizeScale} = this.props;

        var layers = [];

        let iconLayer = new IconLayer<PlaceMapItem, PlaceMapIconLayerProps>(
            this.getSubLayerProps({
                id: "icon",
                data: data,
                getPosition: d => [d.longitude, d.latitude],
                pickable: true,
                getIcon: (d) => 'marker-' + d.iconID,
                sizeScale,
                getSize: d => this.getIconSize(1),
                iconAtlas: iconAtlas,
                iconMapping: iconMapping
            })
        );    
        layers.push(iconLayer);

        let clusterIconLayer = new IconLayer<PlaceMapItem, PlaceMapIconLayerProps>(
            this.getSubLayerProps({
                id: 'iconCluster',
                data: clusterData,
                iconAtlas: clusterIconAtlas,
                iconMapping: clusterIconMapping,
                sizeScale,
                getPosition: d => d.geometry.coordinates,
                getIcon: d => this.getIconName(d.properties.cluster ? d.properties.point_count : 1),
                getSize: d => this.getIconSize(d.properties.cluster ? d.properties.point_count : 1)
            })
        );
        layers.push(clusterIconLayer);

        return layers;
    }    

    getIconName(size: number) {
        if (size === 0) {
            return '';
        }
        if (size < 10) {
            return `marker-${size}`;
        }
        if (size < 100) {
            return `marker-${Math.floor(size / 10)}0`;
        }
        return 'marker-100';
    }
      
    getIconSize(size: number) {
        return Math.min(100, size) / 100 + 1;
    }
}