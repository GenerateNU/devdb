export function GetCredentials(sessionToken: string) {
  return `__Secure-next-auth.session-token=${sessionToken}`;
}
