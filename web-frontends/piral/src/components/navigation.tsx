import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuContainerProps, MenuItemProps, useAction, useGlobalState } from 'piral';
import Logo from './logo';

const NavigationMenuItem: React.FC<MenuItemProps> = ({ children, meta }) => {
    const location = useLocation();
    const relativePath = location.pathname;
    let active = false;

    if (meta.path) {
        if (relativePath.startsWith(meta.path)) {
            active = true;
        }
    }
    
    return (
        <div className={`flex items-center mt-4 py-2 px-6 ${active ? 'bg-gray-700 bg-opacity-25 text-gray-100' : 'text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100'}`}>
            {children}
        </div>        
    );
}

/**
 * ナビゲーション部のレイアウト
 */
const Navigation: React.FC<MenuContainerProps> = ({ children }) => {

    const sidebarOpen = useGlobalState(m => m.sidebarOpen);
    const setSidebarOpen = useAction('setSidebarOpen');

    let sidebarStyle = "-translate-x-full ease-in-out z-30 inset-y-0 left-0 w-0 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0 lg:bg-gray-900 lg:w-64";
    if (sidebarOpen == true) {
        sidebarStyle += "translate-x-0 w-64 bg-gray-900";
    }

    return (
    <>
        <div onClick={() => setSidebarOpen(false)} className={`fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}></div>
        
        <div className={sidebarStyle}>
            <div className="flex items-center justify-start mt-8">
                <div className="flex items-center px-6">
                    <Logo />
                </div>
            </div>
        
            <nav className="mt-10">
                {/* ナビゲーションメニューサンプル */}
                {/* <a className="flex items-center mt-4 py-2 px-6 bg-gray-700 bg-opacity-25 text-gray-100" href="/">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
        
                    <span className="mx-3">Dashboard</span>
                </a>
        
                <a className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="/ui-elements">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
        
                    <span className="mx-3">UI Elements</span>
                </a>
        
                <a className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="/tables">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
        
                    <span className="mx-3">Tables</span>
                </a>
        
                <a className="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="/forms">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
        
                    <span className="mx-3">Forms</span>
                </a> */}

                {children}
            </nav>
        </div>
    </>
    );
}

export { Navigation, NavigationMenuItem };
