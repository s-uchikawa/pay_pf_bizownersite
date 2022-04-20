import * as React from 'react';
import { PiletApi, StateContainerReducers } from 'paypf-bizowner-piral';
import "./styles/tailwind.css";
import "./styles/index.scss";   
import { MessageIds, messages } from './messages';
import { ApiClient } from './apis/api-client';
import { AbtTransitMenu } from './components/abt-transit-menu';
import { ErrorHandling } from './error-handling';
import { UIState } from './models/ui-state-types';
import { createAbtTransitState } from './actions/action-creator';

const environment = process.env.STAGE_ENV || 'local'

const AbtTransitPage = React.lazy(() => import('./components/abt-transit/page'));

export function setup(app: PiletApi) {
  // 構成情報の設定(Piralインスタンスから設定)
  app.defineConfigSchema({
    type: 'object',
    properties: {
      apiGatewayUrl: {
        type: "string"
      }
    }    
  }, {
    apiGatewayUrl: "http://localhost:3000/graphql"
  });

  // ローカライズ
  app.setTranslations(messages);

  const useCurrentLanguage = () => {
    const [state, setState] = React.useState("");
    app.on("select-language", (evt) => setState(evt.currentLanguage));
  };

  // 構成情報を取得
  const { apiGatewayUrl } = app.getCurrentConfig();

  // 多言語対応
  const translate = (key: MessageIds, variable?:string) => {
    return app.translate(key, variable);
  };

  // BFF
  const apiClient = new ApiClient(app.getAccessToken, translate, apiGatewayUrl + "/abt/query", false);

  // // メニューの表示制御
  // // ※　piletの数が増えていくとpilet毎にサーバーアクセスするのは効率が悪いので、
  // //     メニューの構成情報はpiralインスタンスで取得するようにしている。
  // const getMenuEnebled = async () =>  {
  //   // Piralインスタンス側でUI構成情報を取得(GraphQL)
  //   try {
  //     return true;
  //     // const uiConf = await app.getUiConfiguration();

  //     // // 地点管理用のメニューIDが含まれているか否か
  //     // return uiConf.enableMenuIds?.indexOf('place') >= 0;
  //   } catch (ex) {
  //     const msg = ErrorHandling.handle(ex, translate);
  //     showNotification("error", msg.title, msg.message);
  //   }
  // }

  // Action & State
  const withUIState = app.createState<UIState, StateContainerReducers<UIState>>(createAbtTransitState(apiClient, translate));

  // 通知の表示
  const showNotification = (type: "info" | "success" | "warning" | "error", title: string, content: any) => {
    app.showNotification(content, {
      autoClose: 10000,
      title : title,
      type: type
    });
  };

  // 路線・運賃管理メニュー  
  app.registerMenu(withUIState(({ state, actions }) => {
    useCurrentLanguage();

    return <AbtTransitMenu translate={translate} state={state} />;
  }), { path: "/abt/transit" });


  // 路線・運賃管理ページ
  app.registerPage("/abt/transit", withUIState(({ piral, match, state, actions })=> {
    useCurrentLanguage();
    
    return (
      <AbtTransitPage 
        state={state}
        translate={translate}
        sayHello={actions.sayHello}/>
    )}));  
}
