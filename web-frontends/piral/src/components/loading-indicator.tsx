import { LoadingIndicatorProps } from 'piral';
import * as React from 'react';

/**
 * スタイル定義
 * CSSにkeyframes(and -webkit-keyframes) "spinner"でアニメーションを定義しています。
 */
const loaderStyle = {
  borderTopColor: "#3498db",
  animation: "mloca-spinner 1.5s linear infinite",
  WebkitAnimation: "mloca-spinner 1.5s linear infinite"
};

/**
 * ローディングのレイアウト
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = () => (
  <>
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      <div style={loaderStyle} className="ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      <h2 className="text-center text-white text-xl font-semibold">Loading...</h2>
    </div>
  </>
);

export { LoadingIndicator };