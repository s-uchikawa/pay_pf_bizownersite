import { AuthError, AuthErrorType } from './types';

const errorMessageMap = {
  [AuthErrorType.notAuthorized]: 'Not logged in. Please call `login()` to retrieve a token.',
  [AuthErrorType.silentRenewFailed]: 'Silent renew failed to retrieve access token.',
  [AuthErrorType.invalidToken]: 'Invalid token during authentication',
};

const getErrorMessage = (type: AuthErrorType, innerError?: Error | string) => {
  const message = errorMessageMap[type];
  return message || (innerError ? innerError.toString() : 'an unexpected error has occurred without a message');
};

/**
 * A custom error class for oidc errors. It is important to use this class
 * instead of generic Errors, as some application paths inspect `OidcError['type']`.
 *
 * An optional innerError can be supplied in order to not lose visibility on messages provided
 * by oidc-client.
 */
export class PaypfAuthError extends Error implements AuthError {
  public readonly type;
  public readonly innerError;

  constructor(errorType: AuthErrorType, innerError?: Error | string) {
    const message = getErrorMessage(errorType, innerError);
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaypfAuthError);
    }

    this.name = 'AuthError';
    this.type = errorType;
    this.innerError = innerError;
  }
}