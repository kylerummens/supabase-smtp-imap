let TLS_OPTIONS = {};

if (process.env.NODE_ENV === 'production') {
  if (!process.env.TLS_KEY_PATH || !process.env.TLS_CERT_PATH) {
    throw new Error('Missing TLS credentials');
  }
  TLS_OPTIONS = {
    key: Bun.file(process.env.TLS_KEY_PATH!),
    cert: Bun.file(process.env.TLS_CERT_PATH!),
  };
}

export { TLS_OPTIONS };