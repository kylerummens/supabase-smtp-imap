import { createIMAPResponse } from "../utils/create-imap-response";

export function handleSelect(args: string[]): Buffer {
  const [mailbox] = args;
  // TODO: Handle mailbox selection logic (e.g., setting the active mailbox)
  if (mailbox) {
    return createIMAPResponse(`OK [READ-WRITE] SELECT completed`);
  }
  return createIMAPResponse('* NO [BAD] No such mailbox');
}