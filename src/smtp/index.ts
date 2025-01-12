import { SMTPServer } from 'smtp-server';
import type { SMTPServerOptions, SMTPServerAuthentication, SMTPServerSession } from 'smtp-server';
import { createClient } from '@supabase/supabase-js';
import { simpleParser } from 'mailparser';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface EmailData {
  from_address: string;
  to_addresses: string[];
  subject?: string;
  text_content?: string;
  html_content?: string;
  raw_email: string;
  received_at: string;
}

const options: SMTPServerOptions = {
  secure: false,
  authOptional: true,
  disabledCommands: ['STARTTLS'],

  onAuth(auth: SMTPServerAuthentication, session: SMTPServerSession, callback) {
    // TODO: validate credentials here
    callback(null, { user: auth.username });
  },

  onData(stream, session, callback) {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', async () => {
      try {
        const fullEmail = Buffer.concat(chunks);
        const parsedEmail = await simpleParser(fullEmail);

        const emailData: EmailData = {
          from_address: session.envelope.mailFrom ? session.envelope.mailFrom.address : '',
          to_addresses: session.envelope.rcptTo.map(rcpt => rcpt.address),
          subject: parsedEmail.subject,
          text_content: parsedEmail.text,
          html_content: parsedEmail.html || undefined,
          raw_email: fullEmail.toString('base64'),
          received_at: new Date().toISOString()
        };

        // Store the email in Supabase
        const { error } = await supabase
          .from('emails')
          .insert(emailData);

        if (error) {
          console.error('Error storing email in Supabase:', error);
          return callback(new Error('Failed to store email'));
        }

        console.log('Email stored successfully:', {
          from_address: emailData.from_address,
          to_addresses: emailData.to_addresses,
          subject: emailData.subject
        });

        callback();
      } catch (err) {
        console.error('Error processing email:', err);
        callback(new Error('Failed to process email'));
      }
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
      callback(err);
    });
  },

  onMailFrom(address, session, callback) {
    console.log('Mail from:', address.address);
    callback();
  },

  onRcptTo(address, session, callback) {
    console.log('Recipient:', address.address);
    callback();
  }
};

const server = new SMTPServer(options);

const PORT = 2525;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`SMTP server is running on ${HOST}:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('SMTP Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('SMTP server closed');
    process.exit(0);
  });
});