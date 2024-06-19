export async function GetCredentials(baseUrl: string, sessionToken: string) {
  return `next-auth.session-token=${sessionToken}`;
}
