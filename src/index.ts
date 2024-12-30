import { handleIMAPRequest } from "./commands";


if (!process.env.TLS_KEY_PATH || !process.env.TLS_CERT_PATH) {
  throw new Error('Missing TLS credentials');
}

Bun.listen({
  hostname: "localhost",
  port: 993,
  socket: {
    open(socket) {
      console.log("New TLS connection opened");
    },
    data(socket, chunk) {
      const response = handleIMAPRequest(chunk);
      socket.write(response);
    },
    close(socket) {
      console.log("TLS connection closed");
    },
    error(socket, err) {
      console.error("TLS socket error:", err);
    },
  },
  tls: {
    key: Bun.file(process.env.TLS_KEY_PATH!),
    cert: Bun.file(process.env.TLS_CERT_PATH!),
  },
});