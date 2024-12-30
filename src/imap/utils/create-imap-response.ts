export function createIMAPResponse(tagOrResponse: string, tag?: string): Buffer {
  // If the response starts with '*', it is an untagged response
  if (tagOrResponse.startsWith('*')) {
    return Buffer.from(tagOrResponse + '\r\n'); // Just append CRLF for untagged responses
  }

  // If a tag is provided, prepend it to the response
  if (tag) {
    return Buffer.from(`${tag} ${tagOrResponse}\r\n`);
  }

  // In case there's no tag and it's not an untagged response, return a basic response (shouldn't normally happen)
  return Buffer.from(tagOrResponse + '\r\n');
}