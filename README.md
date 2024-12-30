# Supabase SMTP/IMAP Server

This is a simple SMTP/IMAP server that uses Supabase as a backend for authentication and email storage. It follows the SMTP and IMAP protocols to allow sending, receiving, and managing emails.

This repo is a work in progress and is not yet ready for production use.

## Installation

To install the server, run the following command:

```bash
bun install
```

## Usage

To start the server, run the following command:

```bash
bun start
```

## Environment Variables

The following environment variables are required:

- `SUPABASE_URL`: The Supabase URL
- `SUPABASE_ANON_KEY`: The Supabase API key
- `TLS_KEY_PATH`: The path to the TLS key file
- `TLS_CERT_PATH`: The path to the TLS certificate file
