import { StateContainerOptions, StateContainerReducer, StateContainerReducers } from 'paypf-bizowner-piral';
import { ApiClient } from '../apis/api-client';
import { UIState } from '../models/ui-state-types';
import { createSayHelloAction, SayHello, SayHelloArgs } from './say-hello-action';

export function createAbtTransitState(apiClient: ApiClient, translate: (key: string) => string) : StateContainerOptions<UIState, StateContainerReducers<UIState>> {
    return {
        state: {
            isInitializing: false,
            menuEnabled: true,
            error: null,
            hello: null,
        },
        actions: {
            /**
             * テスト
             */
             sayHello(dispatch: StateContainerReducer<UIState>, args: SayHelloArgs) { createSayHelloAction(dispatch, translate, apiClient, args); }
        }
    }
}