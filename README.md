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

Install dependencies before running any scripts:

\`\`\`bash
pnpm install
# or
npm install
\`\`\`

After updating dependencies, run `pnpm install` again and commit the resulting
`pnpm-lock.yaml`. The CI pipeline runs with a frozen lockfile and will fail if
`package.json` and the lockfile are out of sync.

After the dependencies are installed you can lint the project:

\`\`\`bash
npm run lint
\`\`\`

The form at `public/index.html` is generated from `index.html` using the
`NEXT_PUBLIC_MAKE_WEBHOOK_URL` environment variable. When you run `npm run dev`
or `npm run build`, the script `scripts/build-form.js` replaces the placeholder
`__MAKE_WEBHOOK_URL__` in `index.html` and writes the result to
`public/index.html`.

If `next lint` reports "not found," install Next.js:

\`\`\`bash
pnpm add next
# or
npm install next
\`\`\`


## Environment Variables

Copy `env.example` to `.env.local` and fill in the variables. Environment
variables prefixed with `NEXT_PUBLIC_` are required on the client, while the
others should remain server-side. Important keys include:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MAKE_WEBHOOK_URL`
- `MAKE_WEBHOOK_URL`
- `MAKE_WEBHOOK_SECRET`

| Variable | Purpose | Scope |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Base URL of your Supabase project | client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key used by the browser | client |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for Supabase admin operations | server |
| `NEXT_PUBLIC_MAKE_WEBHOOK_URL` | Public URL for Make.com form submissions; used to generate `public/index.html` | client |
| `MAKE_WEBHOOK_URL` | Make.com endpoint for generating PDFs | server |
| `MAKE_WEBHOOK_SECRET` | Optional secret for Make.com, not referenced yet | server |
| `GOOGLE_CREDENTIALS_JSON` | Google service account credentials | server |
| `GOOGLE_DOCS_TEMPLATE_ID` | ID of the Google Docs template contract | server |
| `SMTP_HOST` | SMTP server host for sending PDF emails | server |
| `SMTP_PORT` | SMTP server port | server |
| `SMTP_USER` | Username or email for SMTP authentication | server |
| `SMTP_PASS` | Password for SMTP authentication | server |


Continue building your app on:

**[https://v0.dev/chat/projects/zVc3ijHfuT4](https://v0.dev/chat/projects/zVc3ijHfuT4)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Generate Supabase Types

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) globally:

\`\`\`bash
npm install -g supabase
\`\`\`

After installing, generate TypeScript definitions for your database:

\`\`\`bash
npx supabase gen types typescript --project-id <YOUR_PROJECT_REF> --schema public > types/supabase.ts
\`\`\`

Running this command whenever your database schema changes will keep
`types/supabase.ts` in sync with your Supabase project.

## Running Tests

Ensure you have **Node.js** and **pnpm** installed. Install project
dependencies before running the tests:

\`\`\`bash
pnpm install
\`\`\`

You must run `pnpm install` before `pnpm test` so all dependencies are available.
After the install completes, execute the Jest test suite with:

\`\`\`bash
pnpm test
\`\`\`

Tests rely on the dependencies installed locally by `pnpm install` and will
fail if they are missing. This command runs all unit tests defined in the
repository.
