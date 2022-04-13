import { access } from "fs";
import { cookie } from "piral";
import { PaypfAuthError } from "./auth-error";
import { AuthErrorType } from "./types";

export interface AuthRequest {
    /**
     * Sets the headers of the request.
     * @param headers Headers or a promise to headers.
     */
    setHeaders(headers: any): void;
}

export interface AuthConfig {
    /**
     * トークンが格納されているCookieのキー
     */
    cookieKey: string;

    /**
     * Cookieからトークンが取得できない場合に検索するローカルストレージのキー(開発時のみ使用)
     */
    localStorageKey: string;
}

export interface AuthClient {
    /**
     * Gets a token.
     */
    token(): Promise<string>;
    /**
     * Extends the headers of the provided request.
     */
    extendHeaders(req: AuthRequest): void;
}


 export function setupAuthClient(config: AuthConfig): AuthClient {
    const retrieveToken = () => {
        return new Promise<string>((res, rej) => {
            // Cookie認証済みかどうかを調べる
            var cookies = new Array();
            if(document.cookie != ''){
                var tmp = document.cookie.split('; ');
                for(var i=0;i<tmp.length;i++){
                    var data = tmp[i].split('=');
                    cookies[data[0]] = decodeURIComponent(data[1]);
                }
            }

            // Cookie認証済み
            if (cookies[config.cookieKey]) {
                var accessToken = cookies[config.cookieKey];
                res(accessToken);
            } else {
                // デバッグ用途でLocalStorageに格納したトークンの取得
                if (config.localStorageKey) {
                    var accessToken = localStorage.getItem(config.localStorageKey);

                    if (accessToken) {
                        res(accessToken);
                    } else {
                        console.error(`トークンが設定されていません. ローカルデバッグ時はLocalStorage(${config.localStorageKey})にトークンを設定して下さい。`);
                        rej(new PaypfAuthError(AuthErrorType.notAuthorized));    
                    }
                }
                rej(new PaypfAuthError(AuthErrorType.notAuthorized));
            }
        });
      };      

    return {
        extendHeaders(req) {
        req.setHeaders(
            retrieveToken().then(
                (token) => token && { Authorization: `Bearer ${token}` },
                () => undefined,
            ),
            );
        },
        token: retrieveToken,
      };    
 }