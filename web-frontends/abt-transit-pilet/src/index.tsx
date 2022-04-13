import * as React from 'react';
import { PiletApi, StateContainerReducers } from 'paypf-bizowner-piral';
import "./styles/tailwind.css";
import "./styles/index.scss";   
import { MessageIds, messages } from './messages';
import { PlacePageState } from './models/place-types';
import { createPlaceState } from './actions/place-actions'
import { MlocaBff } from './apis/mloca-bff';
import { PlaceMenu } from './components/place-menu';
import { PlaceDialogFilter } from './components/place/dialog-filter';
import { PlaceBulkRegist } from './components/place/bulk-regist'
import { ErrorHandling } from './error-handling';
import { PlaceDeleteConfirmDialog } from './components/place/dialog-delete-confirm';

const environment = process.env.STAGE_ENV || 'local'

const PlacePage = React.lazy(() => import('./components/place/page'));

export function setup(app: PiletApi) {
  // 構成情報の設定(Piralインスタンスから設定)
  app.defineConfigSchema({
    type: 'object',
    properties: {
      apiGatewayUrl: {
        type: "string"
      },
      graphqlGatewayUrl: {
        type: "string"
      }
    }    
  }, {
    apiGatewayUrl: "https://localhost:5001/api",
    graphqlGatewayUrl: "https://localhost:5001/graphql"    
  });

  // ローカライズ
  app.setTranslations(messages);

  const useCurrentLanguage = () => {
    const [state, setState] = React.useState("");
    app.on("select-language", (evt) => setState(evt.currentLanguage));
  };

  // 構成情報を取得
  const { apiGatewayUrl, mlocaApiPath, graphqlGatewayUrl } = app.getCurrentConfig();

  // リージョン
  const getRegion = async () => {
    return await app.getRegion();
  };

  // 多言語対応
  const translate = (key: MessageIds,variable?:string) => {
    return app.translate(key,variable);
  };

  // モバロケBFF
  const mlocaBff = new MlocaBff(app.getAccessToken, translate, `${apiGatewayUrl}/${mlocaApiPath}`, graphqlGatewayUrl, false);

  // メニューの表示制御
  // ※　piletの数が増えていくとpilet毎にサーバーアクセスするのは効率が悪いので、
  //     メニューの構成情報はpiralインスタンスで取得するようにしている。
  const getMenuEnebled = async () =>  {
    // Piralインスタンス側でUI構成情報を取得(GraphQL)
    try {
      const uiConf = await app.getMLocaUiConfiguration();

      // 地点管理用のメニューIDが含まれているか否か
      return uiConf.enableMenuIds?.indexOf('place') >= 0;
    } catch (ex) {
      const msg = ErrorHandling.handle(ex, translate);
      showNotification("error", msg.title, msg.message);
    }
  }

  // Action & State
  const withPlaceState = app.createState<PlacePageState, StateContainerReducers<PlacePageState>>(createPlaceState(getMenuEnebled, mlocaBff, translate));

  // 通知の表示
  const showNotification = (type: "info" | "success" | "warning" | "error", title: string, content: any) => {
    app.showNotification(content, {
      autoClose: 10000,
      title : title,
      type: type
    });
  };

  // メニュー  
  app.registerMenu(withPlaceState(({ state, actions }) => {
    useCurrentLanguage();

    return <PlaceMenu translate={translate} state={state} getMenuEnebled={actions.getMenuEnebled} />;
  }), { path: "/places" });

  // Modal
  app.registerModal("place-filter", withPlaceState(({ onClose, state, actions }) => {
    return (
      <PlaceDialogFilter 
        getRegion={getRegion}
        onClose={onClose} 
        translate={translate}
        data={state.filter}
        categories={state.categories}
        isFiltering={state.isFiltering}
        filter={actions.filter} />)
  }));

  // 一括登録用Modal登録
  app.registerModal("place-bulk-regist", withPlaceState(({ onClose, state, actions }) => {
    return (
      <PlaceBulkRegist
          getRegion={getRegion}
          onClose={onClose}
          translate={translate}
          uploadFile={actions.uploadFile} />
    )
  }));

  // 削除確認ダイアログ
  app.registerModal("place-confirm-dialog", withPlaceState(({ onClose, state, actions }) => {
    return (
      <PlaceDeleteConfirmDialog 
          translate={translate}
          onClose={onClose}
          deletePlace={actions.deletePlace}
          placeId={state.deletePlaceId}
          showNotification={showNotification}
          />
    )
  }));

  // ページ
  app.registerPage("/places/:mode?/:id?", withPlaceState(({ piral, match, state, actions })=> {
    useCurrentLanguage();
    
    return (
      <PlacePage 
        getRegion={getRegion}
        mode={match.params.mode || 'map'}
        placeId={match.params.id}
        translate={translate}
        showNotification={showNotification}
        showModal={app.showModal}
        state={state}
        initialLoad={actions.initialLoad}
        loadDetail={actions.loadDetail}
        filter={actions.filter}
        searchPlacesByText={actions.searchPlacesByText}
        loadPageOfList={actions.loadPageOfList}
        loadPageOfMapAndList={actions.loadPageOfMapAndList}
        deletePlace={actions.deletePlace}
        updatePlace={actions.updatePlace}
        setDeletePlaceId={actions.setDeletePlaceId}
        createPlace={actions.createPlace}
        downloadCSV={actions.downloadCSV}/>
    )}));
}
