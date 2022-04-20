import { MessageIds } from "./messages";
import { ErrorMessage } from "./models/general-types";

/**
 * エラーハンドリング用のユーティリティ
 */
export class ErrorHandling {
    static handle(ex: any, translate: (key: MessageIds, variable?:string) => string): ErrorMessage {
        ErrorHandling.Log(ex);

        if (ex.networkError) {
            return { title: translate(MessageIds.errorNetworkTitle), message: translate(MessageIds.errorNetwork)  };
        } else if (ex.graphQLErrors) {
            if (ex.graphQLErrors[0].extensions && ex.graphQLErrors[0].extensions.code == 'authorization') {
                return { title: translate(MessageIds.errorAuthorization), message: translate(MessageIds.errorAuthorization)  };
            } else {
                return { title: null, message: ex.message };
            }
        } else {
            return { title: null, message: ex.message };
        }
    }

    private static Log(ex: any)
    {
        let innerEx: any = ex;
        let message: string;
        let indent: number = 2;
        while (innerEx) {
            if (message) {
                message = message + '\n' + ' '.repeat(indent) + innerEx.message;
            } else {
                message = innerEx.message;
            }
            if (innerEx.graphQLErrors) {
                let graphQLMessage: string = ' '.repeat(indent) + "GraphQL Errors: [";
                for(var i=0; i < innerEx.graphQLErrors.length; i++) {
                    let graphQLLineMessage: string = ' '.repeat(indent + 2) + "message = " + innerEx.graphQLErrors[i].message;

                    if (graphQLMessage) {
                        graphQLMessage = graphQLMessage + '\n' + graphQLLineMessage;
                    } else {
                        graphQLMessage = graphQLLineMessage;
                    }
                    if (innerEx.graphQLErrors[i].extensions && innerEx.graphQLErrors[i].extensions.code && innerEx.graphQLErrors[i].extensions != "") {
                        graphQLMessage += ", extensions.code = " + innerEx.graphQLErrors[i].extensions.code;
                    }
                }
                graphQLMessage += '\n' + ' '.repeat(indent) + "]";

                message += '\n' + graphQLMessage;
            }

            innerEx = innerEx.innerError;
            indent += 2;
        }
        console.error(message);
    }
}