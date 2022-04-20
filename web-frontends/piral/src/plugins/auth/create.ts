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
    };
  }
}