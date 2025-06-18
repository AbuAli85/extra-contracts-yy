# Bilingual Contract Generator

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/abuali85s-projects/v0-fork-of-v0-dev-form-component)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/zVc3ijHfuT4)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/abuali85s-projects/v0-fork-of-v0-dev-form-component](https://vercel.com/abuali85s-projects/v0-fork-of-v0-dev-form-component)**

## Build your app

Install dependencies using `pnpm`:

```bash
pnpm install
```

You need these packages before running lint:

```bash
npm run lint
```


## Environment Variables

Copy `env.example` to `.env.local` and fill in the variables.
Important keys include:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MAKE_WEBHOOK_URL`
- `MAKE_WEBHOOK_SECRET`

- `MAKE_WEBHOOK_URL` – the Make.com webhook endpoint used to generate PDF documents.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Base URL of your Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for Supabase admin operations |
| `MAKE_WEBHOOK_URL` | Make.com endpoint for generating PDFs |
| `MAKE_WEBHOOK_SECRET` | Optional secret for Make.com, not referenced yet |
| `GOOGLE_CREDENTIALS_JSON` | Google service account credentials |
| `GOOGLE_DOCS_TEMPLATE_ID` | ID of the Google Docs template contract |
| `SMTP_HOST` | SMTP server host for sending PDF emails |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | Username or email for SMTP authentication |
| `SMTP_PASS` | Password for SMTP authentication |


Continue building your app on:

**[https://v0.dev/chat/projects/zVc3ijHfuT4](https://v0.dev/chat/projects/zVc3ijHfuT4)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Generate Supabase Types

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) globally:

```bash
npm install -g supabase
```

After installing, generate TypeScript definitions for your database:

```bash
npx supabase gen types typescript --project-id <YOUR_PROJECT_REF> --schema public > types/supabase.ts
```

Running this command whenever your database schema changes will keep
`types/supabase.ts` in sync with your Supabase project.
