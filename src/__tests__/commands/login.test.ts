/// <reference types="jest" />

import { handleLogin } from '../../commands/login';

describe('handleLogin', () => {
  it('should return success response when username and password are provided', () => {
    const response = handleLogin(['testuser', 'password']);
    expect(response.toString()).toBe('OK LOGIN completed\r\n');
  });

  it('should return failure response when credentials are missing', () => {
    const response = handleLogin([]);
    expect(response.toString()).toBe('* NO [BAD] LOGIN failed\r\n');
  });

  it('should return failure response when only username is provided', () => {
    const response = handleLogin(['testuser']);
    expect(response.toString()).toBe('* NO [BAD] LOGIN failed\r\n');
  });
});
