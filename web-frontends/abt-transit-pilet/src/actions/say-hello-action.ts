import { StateContainerReducer } from "paypf-bizowner-piral";
import { ApiClient } from "../apis/api-client";
import { ErrorHandling } from "../error-handling";
import { UIState } from "../models/ui-state-types";


export interface SayHelloArgs {
    text: string;
}

export type SayHello = (arg: SayHelloArgs) => void;

export function createSayHelloAction(dispatch: StateContainerReducer<UIState>, translate: (key: string) => string, apiClient: ApiClient, args: SayHelloArgs) {
    // APIコール
    apiClient.hello(args.text)
        .then((response) => {
            dispatch(state => ({
                ...state,
                hello: {
                    text: args.text + response
                }
            }));        
        })
        .catch(err => {
            const msg = ErrorHandling.handle(err, translate);
            dispatch(state => ({
                ...state,
                error: {
                    message: msg.message
                }
            }));
        })
        .finally(() => {

        });
}
