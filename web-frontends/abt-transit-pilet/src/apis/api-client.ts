import { MessageIds } from '../messages';
import { ApiError } from './api-error';
import {
    ApolloClient,
    InMemoryCache,
    gql,
    NormalizedCacheObject
  } from "@apollo/client";

export class ApiClient {

    private apiBaseUrl: string;
    private mock: boolean = false;
    private getAccessToken: () => Promise<string>;
    private translate: (key: MessageIds) => string;
    private apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(
        getAccessToken: () => Promise<string>, 
        translate: (key: MessageIds) => string,
        apiBaseUrl: string, 
        mock: boolean) {
        
        this.getAccessToken = getAccessToken;
        this.apiBaseUrl = apiBaseUrl;
        this.mock = mock;
        this.translate = translate;

        this.apolloClient = new ApolloClient({
            uri: apiBaseUrl,     
            cache: new InMemoryCache(),
            defaultOptions: {
                query: {
                    fetchPolicy: "network-only"
                }
            }
        });
    }

    hello(text: string) : Promise<void> {
        const req = (token): Promise<void> => {
            return this.apolloClient
                .mutate({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    },
                    mutation: gql`
                        mutation CreateHello($input: NewHello!){
                            createHello(input: $input)
                        }
                    `,
                    variables: {
                        input: {
                            text: text
                        }
                    }
                })
                .then(res => {
                    if (res.errors) {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }
                    
                    return res.data.createHello;
                })
                .catch(err => { 
                    throw this.defaultError(err);
                });
        };
        
        return this.getAccessToken().then(value => {
            return req(value); 
        });
    }


    private defaultError(innerError: any) : ApiError {
        if (innerError instanceof ApiError) {
            return innerError;
        }

        if (innerError.networkError) {
            return new ApiError(this.translate(MessageIds.errorNetwork), innerError);
        }

        return new ApiError(this.translate(MessageIds.errorUnknown), innerError);
    }
}
