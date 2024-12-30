/// <reference types="jest" />

import { handleSelect } from '../../commands/select';

describe('handleSelect', () => {
  it('should return success response when mailbox is provided', () => {
    const response = handleSelect(['INBOX']);
    expect(response.toString()).toBe('OK [READ-WRITE] SELECT completed\r\n');
  });

  it('should return failure response when mailbox is not provided', () => {
    const response = handleSelect([]);
    expect(response.toString()).toBe('* NO [BAD] No such mailbox\r\n');
  });
});
