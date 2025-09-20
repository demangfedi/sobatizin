# Sobatizin Contact Service

This repository contains a lightweight Express + React setup that demonstrates how contact form submissions are validated on the server and persisted to a log file.

## Prerequisites

- Node.js 18+
- npm 9+

## Getting started

### Install dependencies

```bash
npm --prefix server install
```

### Run the development API server

```bash
npm --prefix server run dev
```

The server listens on port `4000` by default. You can set a custom port with the `PORT` environment variable.

### Build the production bundle

```bash
npm --prefix server run build
```

### Start the compiled server

```bash
npm --prefix server start
```

## Contact endpoint

`POST /api/contact`

Body parameters:

| Field   | Type   | Notes |
| ------- | ------ | ----- |
| `name`  | string | Required. |
| `email` | string | Optional, but either `email` or `phone` must be provided. Must be a valid email address when present. |
| `phone` | string | Optional, but either `phone` or `email` must be provided. Accepts digits, spaces, parentheses, `+`, `-`, and `.` characters. |
| `service` | string | Required. |
| `message` | string | Required. |

The request is validated with a [Zod](https://zod.dev) schema on the server. Invalid requests return a `400` response with structured validation errors that the UI can surface.

### Logging

Valid submissions are appended to `logs/contact-submissions.log` (relative to the repository root). Each line contains a JSON object with the validated submission payload and metadata describing when and from which IP address the request was received.

The log directory is created automatically if it does not exist.

## Front-end form

`client/src/components/ContactForm.jsx` demonstrates how to POST to the internal `/api/contact` endpoint, handle validation feedback, and display success messages without relying on `window.alert`.

## Project status

This project currently focuses on the server endpoint and the contact form component. You can integrate the form component into any existing React application or extend the server as needed.
