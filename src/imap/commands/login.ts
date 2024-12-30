import { createIMAPResponse } from "../utils/create-imap-response";

export function handleLogin(args: string[]): Buffer {
  const [username, password] = args;
  // TODO: Validate login with Supabase or other authentication mechanism
  if (username && password) {
    return createIMAPResponse(`OK LOGIN completed`);
  }
  return createIMAPResponse('* NO [BAD] LOGIN failed');
}