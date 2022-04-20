import { LocalizationMessages } from 'paypf-bizowner-piral';

export enum MessageIds {
  labelMenuTile = "labelMenuTitle",
  labelHello = "labelHello",

  errorUnknown = 'errorUnknown',
  errorNetwork = 'errorNetwork',
}

export const messages: LocalizationMessages = { 
    en: {
      // ラベル
      [MessageIds.labelMenuTile]: "Routes & Fare",
      [MessageIds.labelHello]: "Hello",

      // エラーメッセージ
      [MessageIds.errorUnknown]: "unknown error.",
      [MessageIds.errorNetwork]: "web page can't connect to the internet or for some reason I can't connect to the server.",
    },
    ja: {
      // ラベル
      [MessageIds.labelMenuTile]: "路線・運賃",
      [MessageIds.labelHello]: "Hello",

      [MessageIds.errorUnknown]: "不明なエラー.",
      [MessageIds.errorNetwork]: "インターネットに接続できないか、何らかの原因によりサーバーに接続できません.",
  }
};