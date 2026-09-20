import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { API_CONFIG } from '../config/apiConfig';

const userPool = new CognitoUserPool({
  UserPoolId: API_CONFIG.userPoolId,
  ClientId: API_CONFIG.userPoolClientId,
});

export function signIn(username: string, password: string): Promise<string> {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        resolve(session.getIdToken().getJwtToken());
      },
      onFailure: (error) => {
        reject(error);
      },
      newPasswordRequired: () => {
        reject(new Error('Password change is required for this account.'));
      },
    });
  });
}

export function getIdToken(): Promise<string | null> {
  const user = userPool.getCurrentUser();

  if (!user) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    user.getSession((error: Error | null, session: CognitoUserSession | null) => {
      if (error || !session || !session.isValid()) {
        resolve(null);
        return;
      }

      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export function signOut(): void {
  const user = userPool.getCurrentUser();
  user?.signOut();
}
