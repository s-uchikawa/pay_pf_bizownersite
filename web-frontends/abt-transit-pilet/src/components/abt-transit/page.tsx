import * as React from 'react';
import { LoadingIcon } from 'paypf-bizowner-ui-elements';
import { UIState } from '../../models/ui-state-types';
import { PlaceAbtTransitViewHello } from './view-hello';
import { MessageIds } from '../../messages';
import { SayHello } from '../../actions';

export interface AbtTransitPageProps {
    // 画面状態
    state: UIState;
    // 多言語変換
    translate(key: MessageIds): string;
    // アクション
    sayHello: SayHello;
}

const AbtTransitPage: React.FC<AbtTransitPageProps> = (props) => {    
    
    if (props.state.isInitializing) {
      return (
        <div className="abt-tr-bg-white abt-tr-flex abt-tr-justify-center abt-tr-items-center abt-tr-w-full abt-tr-h-full">
            <div className="abt-tr-w-auto abt-tr-h-10 abt-tr-px-4 abt-tr-py-2">
                <LoadingIcon size={30} color="black" />
            </div>
        </div>);
    } else {
        return (
            <div className="abt-tr-h-full abt-tr-w-full mpp-flex abt-tr-flex-col abt-tr-items-stretch">
                <div className="abt-tr-h-full abt-tr-flex-grow">
                    <PlaceAbtTransitViewHello state={props.state.hello} translate={props.translate} sayHello={props.sayHello} />
                </div>
            </div>
        );
    }
}

export default AbtTransitPage;