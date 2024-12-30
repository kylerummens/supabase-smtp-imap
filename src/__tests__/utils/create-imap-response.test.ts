import { createIMAPResponse } from '../../utils/create-imap-response';

describe('createIMAPResponse', () => {
  it('should create an untagged response when starting with *', () => {
    const response = createIMAPResponse('* OK Server ready');
    expect(response.toString()).toBe('* OK Server ready\r\n');
  });

  it('should create a tagged response when tag is provided', () => {
    const response = createIMAPResponse('OK LOGIN completed', 'a001');
    expect(response.toString()).toBe('a001 OK LOGIN completed\r\n');
  });

  it('should handle response without tag', () => {
    const response = createIMAPResponse('BAD Command unknown');
    expect(response.toString()).toBe('BAD Command unknown\r\n');
  });
});
