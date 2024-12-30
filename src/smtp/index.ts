import { TLS_OPTIONS } from "../configs/tls";

const SMTP_PORT = 587;

// Types for SMTP session state
type SMTPSession = {
  mailFrom: string | null;
  rcptTo: string[];
  data: string[];
  isInData: boolean;
};

// Command handlers
function handleHelo(socket: any, args: string) {
  // TODO: Implement proper HELO response with domain validation
  socket.write("250 Hello\r\n");
}

function handleEhlo(socket: any, args: string) {
  // TODO: Implement EHLO with capability list
  socket.write("250-smtp.example.com\r\n");
  socket.write("250-SIZE 35882577\r\n");
  socket.write("250-8BITMIME\r\n");
  socket.write("250 STARTTLS\r\n");
}

function handleMailFrom(socket: any, session: SMTPSession, args: string) {
  // TODO: Implement sender validation
  const match = args.match(/<(.+)>/);
  if (!match) {
    socket.write("501 Syntax error in parameters or arguments\r\n");
    return;
  }
  session.mailFrom = match[1];
  socket.write("250 Sender OK\r\n");
}

function handleRcptTo(socket: any, session: SMTPSession, args: string) {
  // TODO: Implement recipient validation
  if (!session.mailFrom) {
    socket.write("503 Bad sequence of commands\r\n");
    return;
  }

  const match = args.match(/<(.+)>/);
  if (!match) {
    socket.write("501 Syntax error in parameters or arguments\r\n");
    return;
  }

  session.rcptTo.push(match[1]);
  socket.write("250 Recipient OK\r\n");
}

function handleData(socket: any, session: SMTPSession) {
  if (!session.mailFrom || session.rcptTo.length === 0) {
    socket.write("503 Bad sequence of commands\r\n");
    return;
  }

  session.isInData = true;
  session.data = [];
  socket.write("354 Start mail input; end with <CRLF>.<CRLF>\r\n");
}

function handleDataContent(socket: any, session: SMTPSession, line: string) {
  if (line === ".") {
    // TODO: Process the email (save to database, forward, etc)
    console.log("Email received:", {
      from: session.mailFrom,
      to: session.rcptTo,
      content: session.data.join("\n")
    });

    session.isInData = false;
    session.data = [];
    session.mailFrom = null;
    session.rcptTo = [];

    socket.write("250 OK\r\n");
    return;
  }
  
  // If line starts with a period, remove one
  if (line.startsWith(".")) {
    line = line.slice(1);
  }
  session.data.push(line);
}

export const startSmtpServer = () => {
  return Bun.listen({
    hostname: "0.0.0.0",
    port: SMTP_PORT,
    socket: {
      data(socket, data) {
        const session = (socket as any).session ??= {
          mailFrom: null,
          rcptTo: [],
          data: [],
          isInData: false
        };

        const line = data.toString().trim();

        if (session.isInData) {
          handleDataContent(socket, session, line);
          return;
        }

        const [command, ...args] = line.split(" ");
        const normalizedCommand = command.toUpperCase();
        const argsString = args.join(" ");

        switch (normalizedCommand) {
          case "HELO":
            handleHelo(socket, argsString);
            break;
          case "EHLO":
            handleEhlo(socket, argsString);
            break;
          case "MAIL":
            handleMailFrom(socket, session, argsString);
            break;
          case "RCPT":
            handleRcptTo(socket, session, argsString);
            break;
          case "DATA":
            handleData(socket, session);
            break;
          case "QUIT":
            socket.write("221 Goodbye\r\n");
            socket.end();
            break;
          default:
            socket.write("500 Unknown command\r\n");
        }
      },
      open(socket) {
        console.log("SMTP client connected");
        socket.write("220 smtp.example.com ESMTP\r\n");
      },
      close(socket) {
        console.log("SMTP client disconnected");
      },
      drain(socket) {
        // Socket is ready for more data
      },
      error(socket, error) {
        console.error("SMTP socket error:", error);
      },
    },
    tls: TLS_OPTIONS
  });
}