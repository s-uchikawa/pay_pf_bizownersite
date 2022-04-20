import * as React from 'react';
import { MessageIds } from '../../messages';
import { Button } from 'paypf-bizowner-ui-elements'
import { SayHello } from '../../actions';
import { HelloState } from '../../models/ui-state-types';

/**
 * テスト表示画面コンポーネントのProps
 */
export interface AbtTransitViewHelloProps {
    // 表示状態
    state: HelloState;
    // 多言語変換
    translate(key: MessageIds): string;
    // アクション
    sayHello: SayHello;
}

/**
 * テスト表示画面コンポーネント
 */
export const PlaceAbtTransitViewHello: React.FC<AbtTransitViewHelloProps> = ({ 
    translate,
    sayHello,
    state
 }) => {

  /**
   * Helloボタン時の処理
   */
  const handleHello = () => {
    sayHello({text: "Hello !!"});
  }
  
  return (
      <div>
        <Button type="button" onClick={() => handleHello()}>{translate(MessageIds.labelHello)}</Button>
        <label>{state?.text}</label>
      </div>
  );
}