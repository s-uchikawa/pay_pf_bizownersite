import { LanguageData } from 'piral';

function getSampleTranslations(language: string) {
    switch (language) {
      case 'en':
        return {
          token_expired : "Token has expired. Please close this browser and reopen it."
        };
      case 'ja':
        return {
          token_expired : "トークンの有効期限が切れました。このブラウザを閉じて、再度開きなおしてください。"
        };
    }
}
  
export function loadLanguage(language: string, data: LanguageData) {
    // Usually these languages / data could be retrieved from a
    // translation service that takes care of *all* translations
    return new Promise<LanguageData>((resolve) =>
      setTimeout(
        () =>
          // In this case we only fake the API access - for such static
          // translations Piral contains a better / simpler mechanism
          resolve({
            ...data,
            global: getSampleTranslations(language),
          }),
        500,
      ),
    );
  }
