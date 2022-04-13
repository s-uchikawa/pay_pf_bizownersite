import 'piral/polyfills';
import { createMenuApi, createModalsApi, renderInstance } from 'piral';
import { layout, errors } from './layout';
import "./styles/tailwind.css";
import "./styles/index.scss";   
import * as actions from './actions';
import { createContainersApi } from "piral-containers";
import { createConfigsApi } from 'piral-configs';
import { createNotificationsApi } from 'piral-notifications';
import { createAuthApi, setupAuthClient } from './plugins/auth';
import { createUiConfigurationApi } from './plugins/ui-configuration';
import {
  ApolloClient,
  InMemoryCache
} from "@apollo/client";

// 構成情報
const environment = process.env.STAGE_ENV || 'local'
const env = require(`./env/${environment}.json`)

// change to your feed URL here (either using feed.piral.cloud or your own service)
let feedUrl = 'https://feed.piral.cloud/api/v1/pilet/mloca5';
if (env == "production") {
  feedUrl = 'https://feed.piral.cloud/api/v1/pilet/mloca5_prod';
}

const authClient = setupAuthClient({
  // メインWEBがトークンを格納するCookieのキー 
  cookieKey: "mloca_token",
  // Cookieからトークンが取得できない場合に検索するローカルストレージのキー(開発時のみ使用)
  localStorageKey: environment == "local" ? "mloca_token" : null,
});

// GraphQLクライアント
const apolloClient = new ApolloClient({
  uri: env.graphqlGatewayUrl,     
  cache: new InMemoryCache()
});

// GoogleMapsAPIキー
global.window.googleMapsApiKey = env.googleMapsKey;

const instance = renderInstance({
  layout,
  errors,
  actions,
  plugins: [
    createMenuApi(),
    createAuthApi(authClient),
    createUiConfigurationApi(authClient, apolloClient),
    createContainersApi(),
    createModalsApi(),
    createConfigsApi({
      retrieve(configName) {
        return env;
      }
    }),
    createNotificationsApi()
  ],
  requestPilets() {
    return fetch(feedUrl)
      .then(res => res.json())
      .then(res => res.items);
  },
});