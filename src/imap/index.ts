import { TLS_OPTIONS } from "../configs/tls";
import { handleIMAPRequest } from "./commands";

const IMAP_PORT = 993;

Bun.listen({
  hostname: "0.0.0.0",
  port: IMAP_PORT,
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
  tls: TLS_OPTIONS
});