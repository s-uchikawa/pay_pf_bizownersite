import type {} from 'piral-core';

declare module 'piral-core/lib/types/custom' {
    interface PiletCustomApi extends AuthApi {}
}

export interface AuthApi {
    /**
     * Gets the currently valid access token, if any.
     */
    getAccessToken(): Promise<string | undefined>;
}
  
export enum AuthErrorType {
  /**
   * This error was thrown at some point during authentication, by the browser or by oidc-client
   * and we are unable to handle it.
   */
   unknown = 'unknown',
   /**
    * This error happens when the user does not have an access token during Authentication.
    * It is an expected error, and should be handled during `handleAuthentication()` calls.
    * If doing manual authentication, prompt the user to `login()` when receiving it.
    */
   notAuthorized = 'notAuthorized',
   /**
    * This error happens when silent renew fails in the background. It is not expected, and
    * signifies a network error or configuration problem.
    */
   silentRenewFailed = 'silentRenewFailed',
   /**
    * This is an unexpected error that happens when the `token()` call retrieves a User from
    * the user manager, but it does not have an access_token. This signifies a configuration
    * error, make sure the correct `scopes` are supplied during configuration.
    */
   invalidToken = 'invalidToken',
}

export interface AuthError extends Error {
  type: Readonly<AuthErrorType>;
}