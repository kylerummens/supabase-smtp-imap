import { createIMAPResponse } from "../utils/create-imap-response";

export function handleFetch(args: string[]): Buffer {
  // TODO: Implement FETCH command processing (e.g., fetching email headers)
  return createIMAPResponse('* FETCH completed');
}