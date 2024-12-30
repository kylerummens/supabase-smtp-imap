import { createIMAPResponse } from '../utils/create-imap-response';
import { handleLogin } from './login';
import { handleLogout } from './logout';
import { handleSelect } from './select';
import { handleList } from './list';
import { handleFetch } from './fetch';

function parseIMAPCommand(request: string): { type: string, args: string[] } {
  // Split the command by spaces
  const parts = request.split(/\s+/);
  const command = parts[0].toUpperCase();
  const args = parts.slice(1); // Everything after the command is considered arguments

  return { type: command, args };
}


export function handleIMAPRequest(chunk: Buffer): Buffer {
  const request = chunk.toString('utf-8').trim(); // Convert buffer to string and trim any extra spaces

  if (!request) {
    return createIMAPResponse('* NO [BAD] Invalid command');
  }

  const command = parseIMAPCommand(request); // You would implement this to parse the IMAP command from the input string

  switch (command.type) {
    case 'LOGIN':
      return handleLogin(command.args);
    case 'LOGOUT':
      return handleLogout();
    case 'SELECT':
      return handleSelect(command.args);
    case 'FETCH':
      return handleFetch(command.args);
    case 'LIST':
      return handleList(command.args);
    case 'NOOP':
      return createIMAPResponse('OK NOOP completed');
    default:
      return createIMAPResponse('* NO [BAD] Unknown command');
  }
}
