import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { startSmtpServer } from "../index";
import { TCPSocketListener } from "bun";

const SMTP_PORT = 587;
const TEST_TIMEOUT = 3000;

let smtpServer: TCPSocketListener<undefined> | undefined;

describe("SMTP Server", () => {

  beforeAll(() => {
    smtpServer = startSmtpServer();
  });

  afterAll(async () => {
    if (smtpServer) {
      smtpServer.stop();
    }
  });

  test("should establish a TCP connection", async () => {
    const connected = await new Promise((resolve) => {
      Bun.connect({
        hostname: "localhost",
        port: SMTP_PORT,
        socket: {
          data(socket, data) {
            console.log('Connection test received:', data.toString());
          },
          drain(socket) {
            // Required callback
          },
          open(socket) {
            console.log('Socket opened');
            socket.end();
            resolve(true);
          },
          error(socket, error) {
            console.error("Connection error:", error);
            resolve(false);
          },
          connectError(socket, error) {
            console.error("Connect error:", error);
            resolve(false);
          },
          end(socket) {
            console.log('Socket ended by server');
            resolve(true);
          }
        },
      });
    });

    expect(connected).toBe(true);
  }, TEST_TIMEOUT);
});
