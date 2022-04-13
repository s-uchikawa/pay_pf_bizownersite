/**
* ページネーション
*/
export interface Pagenation {
    // 現在のページ番号
    page: number;
    // 合計ページ数
    totalPages: number;
    // 合計件数
    totalCount: number;
}

/**
* エラー状態
*/
export interface ErrorState {
    // メッセージ
    message: string
}

/**
 * リージョン
 */
export type Region = "jp" | "us"  | "none";

/**
* エラーメッセージ
*/
export interface ErrorMessage {
    // 通知タイトル
    title: string;

    // メッセージ
    message: string
}
