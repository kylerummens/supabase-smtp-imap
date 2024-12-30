import { createIMAPResponse } from "../utils/create-imap-response";

export function handleLogout(): Buffer {
  // TODO: Implement logout logic
  return createIMAPResponse('OK LOGOUT completed');
}