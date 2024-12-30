import { createIMAPResponse } from "../utils/create-imap-response";

export function handleList(args: string[]): Buffer {
  // TODO: Implement LIST command processing (e.g., listing mailboxes)
  return createIMAPResponse('* LIST completed');
}
