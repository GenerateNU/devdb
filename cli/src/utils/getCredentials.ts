// __Host-next-auth.csrf-token=c2c3055d98b0acbc78cdc060ab9ef4c40e3e69f541249726b6709dbe0d276d31%7C817584dcc8a74544e06218bf1e4c1dd391177bfa6eaa1ad87fd01f5cbd34154f; __Secure-next-auth.callback-url=https%3A%2F%2Froutes-orcin.vercel.app; __Secure-next-auth.session-token=0957fc5f-3330-499a-85bc-aca96b0e4278

import axios from "axios";
import { baseUrl } from "..";
const authPath = "api/auth/";
const csrfTokenPath = "csrf/";

export async function GetCredentials(sessionToken: string) {
  const crsfTokenResponse = await axios.get(
    `${baseUrl}${authPath}${csrfTokenPath}`,
  );

  const csrfTokenBody = crsfTokenResponse.data as { csrfToken: string };

  const credentials = {
    "__Host-next-auth.csrf-token": csrfTokenBody.csrfToken,
    "__Secure-next-auth.callback-url": baseUrl,
    "__Secure-next-auth.session-token": sessionToken,
  };

  return `__Host-next-auth.csrf-token=${csrfTokenBody.csrfToken};__Secure-next-auth.callback-url=${baseUrl};__Secure-next-auth.session-token=${sessionToken}`;
}
