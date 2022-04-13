import 'piral-core';

declare global {
  interface Window{
    googleMapsApiKey: string
  }
}

declare module 'piral-core/lib/types/custom' {
    interface PiralCustomActions {
      setSidebarOpen(open: boolean): void;
      checkAccessTokenExpired(): void;
    }
  
    interface PiralCustomState {
      sidebarOpen: boolean;         // サイドバーオープン時にtrue 
      useSpecifyLanguage: boolean;  // 既定言語ではなく選択された言語を使用する
      tokenExpired: boolean;        // トークンの有効期限切れの時にtrue
    }
}
  
declare module 'piral-menu/lib/types' {
    interface PiralCustomMenuSettings {
        path?: string
    }
}