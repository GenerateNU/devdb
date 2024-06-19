export function GetCredentials(sessionToken: string) {
  return `next-auth.session-token=${sessionToken}`;
}
