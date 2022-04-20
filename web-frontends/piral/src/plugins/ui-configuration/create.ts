import { PiralPlugin } from 'piral-core';
import { UiConfiguration, UiConfigurationApi } from './types';
import { AuthClient } from '../auth';
import {
  ApolloClient,
  gql,
  NormalizedCacheObject
} from "@apollo/client";

/**
 * Creates new Pilet API extensions for MLoca.
 */
export function createUiConfigurationApi(client: AuthClient, apolloClient: ApolloClient<NormalizedCacheObject>): PiralPlugin<UiConfigurationApi> {
  return (context) => {
    
    return {
      getUiConfiguration() {
        const req = (token): Promise<UiConfiguration> => {
          return apolloClient
              .query({
                  context: {
                      headers: {
                          "Authorization": `Bearer ${token}`
                      }
                  },
                  query: gql`
                  {
                      uiConfiguration {
                        enableMenuIds
                      }
                  }`
              })
              .then(res => {
                  if (res.error) {
                      throw new Error(res.error.message);
                  }
                  if (res.errors) {
                      throw new Error(res.errors.map((e: {message: string}) => e.message).join('\n'));
                  }
                  
                  return res.data.uiConfiguration;
              });
        };

        return client.token().then(value => {
            return req(value);            
        });
      }
    } 
  }
}