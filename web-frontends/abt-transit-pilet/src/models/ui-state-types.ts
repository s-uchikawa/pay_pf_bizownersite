import { ErrorState, Pagenation } from "./general-types";

/**
* UIの状態
*/
export interface UIState {
    // メニューを表示するかどうか
    menuEnabled: boolean;
    // 初期処理中かどうか
    isInitializing: boolean;
    // エラー状態
    error: ErrorState;

    hello: HelloState;
}


export interface HelloState {
    text: string;
}
