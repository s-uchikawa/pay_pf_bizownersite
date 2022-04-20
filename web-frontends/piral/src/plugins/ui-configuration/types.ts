import type {} from 'piral-core';

declare module 'piral-core/lib/types/custom' {
    interface PiletCustomApi extends UiConfigurationApi {}
}

export interface UiConfigurationApi {
    /**
     * UI構成情報を返します。
     */
      getUiConfiguration(): Promise<UiConfiguration>;
}

/**
 * UI構成情報
 */
export interface UiConfiguration {
  // 現在のログインユーザーが利用可能なメニューIDのリスト
  enableMenuIds: string[];
}