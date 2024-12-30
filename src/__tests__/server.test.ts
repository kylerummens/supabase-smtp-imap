/// <reference types="jest" />

import { handleIMAPRequest } from '../commands';

describe('IMAP Server Request Handler', () => {
  it('should handle LOGIN command', () => {
    const request = Buffer.from('LOGIN user pass\r\n');
    const response = handleIMAPRequest(request);
    expect(response.toString()).toBe('OK LOGIN completed\r\n');
  });

  it('should handle SELECT command', () => {
    const request = Buffer.from('SELECT INBOX\r\n');
    const response = handleIMAPRequest(request);
    expect(response.toString()).toBe('OK [READ-WRITE] SELECT completed\r\n');
  });

  it('should handle unknown commands', () => {
    const request = Buffer.from('UNKNOWN command\r\n');
    const response = handleIMAPRequest(request);
    expect(response.toString()).toBe('* NO [BAD] Unknown command\r\n');
  });

  it('should handle malformed requests', () => {
    const request = Buffer.from('\r\n');
    const response = handleIMAPRequest(request);
    expect(response.toString()).toBe('* NO [BAD] Invalid command\r\n');
  });

  it('should handle NOOP command', () => {
    const request = Buffer.from('NOOP\r\n');
    const response = handleIMAPRequest(request);
    expect(response.toString()).toBe('OK NOOP completed\r\n');
  });
});
