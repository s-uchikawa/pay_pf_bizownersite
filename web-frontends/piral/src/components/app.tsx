  
import * as React from 'react';

import { LayoutProps, Menu, Modals, Notifications, useAction, useDynamicLanguage, useTranslate, useGlobalState } from 'piral';
import Logo from './logo';
import { BrowserRouter as Router, Route, Redirect, useHistory } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import { useLocation } from 'react-router-dom';
import { loadLanguage } from '../language';

/**
 * アプリ全体のレイアウト
 */
const App: React.FC<LayoutProps> = ({ children, currentLayout }) => {
  const readState = useAction("readState");
  const checkAccessTokenExpired = useAction("checkAccessTokenExpired");
  const location = useLocation();
  const history = useHistory();
  const translate = useTranslate();
  const g = useGlobalState();
  const [language, setLanguage] = useDynamicLanguage("en", loadLanguage);
  const tokenExpired = readState(m => m.tokenExpired);

  React.useEffect(() => {
    // ブラウザの言語設定の言語を選択
    var lang = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language;
    if (lang == "ja" && g.language.selected != lang) {
      setLanguage(lang)
    }

    // ホーム画面へ遷移
    const relativePath = location.pathname;
    if (relativePath == "" || relativePath == "/")  {
      history.replace(`/places/map`);
    }

    // トークン有効期限切れチェック
    const interval = setInterval(() => {
      checkAccessTokenExpired();
    }, 10000);    
    
    return () => clearInterval(interval);
  });

  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh',`${vh}px`);
  }

  window.addEventListener('resize', setVh);
  setVh();

  return (
    <>
      <div className="flex bg-gray-200 font-roboto" style={{height:"calc(var(--vh,1vh)*100)"}}>
          <Notifications />
          <Modals />
          <Menu type="general" />
          {tokenExpired ? 
            <div className="flex justify-center items-center h-full w-full">{/* トークン有効期限切れ */}
              <div className="flex-col p-64 bg-white shadow-xl rounded-lg text-xl text-center">
                  <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" viewBox="-4 -4 24 24">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                  </div>
                  <p>{translate("token_expired")}</p>
              </div>
            </div>
            :
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="h-full w-full">
                      {children}
                    </div>
                </main>
            </div>
          }
      </div>
    </>
  );
}

export default App;