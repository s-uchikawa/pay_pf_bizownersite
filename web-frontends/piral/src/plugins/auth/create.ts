import { PiralPlugin } from 'piral-core';
import { AuthClient } from './setup';
import { AuthApi } from './types';
import jwtDecode, { JwtPayload } from "jwt-decode";

/**
 * Creates new Pilet API extensions for MLoca.
 */
export function createAuthApi(client: AuthClient): PiralPlugin<AuthApi> {
  return (context) => {
    context.on('before-fetch', client.extendHeaders);

    return {
      getAccessToken() {
        return client.token();
      },
      getRegion() {
        return new Promise<'jp' | 'us'>((resolve, reject) => {
          // トークンクレームからregionを取得
          if (client.token) {
            client.token().then(value => {
              const jwt = jwtDecode<JwtPayload>(value);
              if (jwt["region"] == 'us') {
                resolve('us');
              }
              resolve('jp');
            });
          } else {
            resolve('jp');
          }
        });
      },
    };
  }
}