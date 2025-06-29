# Bilingual Contract Generator

This is a Next.js application designed to generate bilingual contracts, manage parties and promoters, and provide a dashboard for analytics and audit logs. It leverages Supabase for database and authentication, and Next.js App Router for server-side rendering and API routes.

## Features

- **Bilingual Contract Generation**: Generate contracts in English and Arabic.
- **Party Management**: Create, view, edit, and delete contract parties.
- **Promoter Management**: Create, view, edit, and delete promoters.
- **Dashboard**:
  - **Analytics**: Overview of contract statuses and trends.
  - **Audit Logs**: Track system activities and user actions.
  - **Notifications**: Real-time system alerts.
- **Authentication**: User login and session management using Supabase Auth.
- **Internationalization (i18n)**: Support for English and Arabic languages using `next-intl`.
- **Responsive Design**: Optimized for various screen sizes using Tailwind CSS and Shadcn UI.

## Technologies Used

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (Database, Auth, Realtime)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Zod](https://zod.dev/) for schema validation
- [React Hook Form](https://react-hook-form.com/)
- [next-intl](https://next-intl-docs.vercel.app/) for internationalization
- [date-fns](https://date-fns.org/) for date manipulation
- [use-debounce](https://www.npmjs.com/package/use-debounce) for debouncing input
- [Lucide React](https://lucide.dev/icons/) for icons

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or Yarn
- A Supabase project

### Installation

1.  **Clone the repository:**

    \`\`\`bash
    git clone https://github.com/your-username/bilingual-contract-generator.git
    cd bilingual-contract-generator
    \`\`\`

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up Supabase:**

    - Create a new Supabase project.
    - Go to "Project Settings" -> "API" and copy your `Project URL` and `anon public` key.
    - Create a `.env.local` file in the root of your project and add the following environment variables:

      \`\`\`env
      NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY # Only needed for server-side operations that require elevated privileges
      \`\`\`

    - **Run SQL migrations:**
      The `scripts/` directory contains SQL files to set up your database schema. You can run these manually in your Supabase SQL Editor or use a migration tool.
      Ensure you run them in order (e.g., `001_create_promoters_table.sql`, `002_alter_parties_add_type.sql`, etc.).

      **Important Tables:**
      - `promoters`: Stores information about promoters.
      - `parties`: Stores information about contract parties.
      - `contracts`: Stores contract details.
      - `audit_logs`: Stores system audit trails.
      - `notifications`: Stores system notifications.

      **Enable Row Level Security (RLS):**
      RLS is crucial for security. Ensure RLS is enabled on your tables (e.g., `promoters`, `parties`, `contracts`, `audit_logs`, `notifications`) and appropriate policies are set up. The `scripts/007_update_rls_policies.sql` file provides examples.

4.  **Run the development server:**

    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
.
├── .github/workflows/ci.yml       # GitHub Actions CI configuration
├── app/                           # Next.js App Router root
│   ├── [locale]/                  # Internationalization routing
│   │   ├── contracts/             # Contract listing and details
│   │   ├── generate-contract/     # Contract generation form
│   │   ├── login/                 # Login page
│   │   ├── manage-parties/        # Party management
│   │   ├── manage-promoters/      # Promoter management
│   │   ├── page.tsx               # Root page for locale
│   │   └── ... (error, loading files)
│   ├── actions/                   # Server Actions
│   │   ├── contracts.ts
│   │   └── promoters.ts
│   ├── api/contracts/route.ts     # API route for contracts
│   ├── dashboard/                 # Dashboard pages
│   │   ├── analytics/
│   │   ├── audit/
│   │   ├── contracts/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── users/
│   │   └── page.tsx
│   ├── edit-contract/[id]/        # Edit contract page
│   ├── layout.tsx                 # Root layout
│   ├── loading.tsx                # Root loading state
│   ├── not-found.tsx              # 404 page
│   ├── providers.tsx              # React context providers
│   └── supabase-listener.tsx      # Supabase auth listener
├── components/                    # Reusable React components
│   ├── dashboard/                 # Dashboard specific components
│   │   ├── admin-tools.tsx
│   │   ├── audit-logs.tsx
│   │   ├── charts-section.tsx
│   │   ├── contract-reports-table.tsx
│   │   ├── dashboard-layout.tsx
│   │   ├── notification-system.tsx
│   │   └── review-panel.tsx
│   ├── ui/                        # Shadcn UI components
│   │   └── ...
│   ├── auth-form.tsx
│   ├── combobox-field.tsx
│   ├── contract-generator-form.tsx
│   ├── contract-search-input.tsx
│   ├── contract-status-filter.tsx
│   ├── date-picker-with-manual-input.tsx
│   ├── date-picker-with-presets-field.tsx
│   ├── date-picker-with-range.tsx
│   ├── image-upload-field.tsx
│   ├── language-switcher.tsx
│   ├── lifecycle-status-indicator.tsx
│   ├── main-nav.tsx
│   ├── mobile-nav.tsx
│   ├── party-form.tsx
│   └── promoter-form.tsx
├── hooks/                         # Custom React hooks
│   ├── use-contracts.ts
│   ├── use-delete-contract-mutation.test.tsx
│   ├── use-mobile.tsx
│   ├── use-parties.ts
│   ├── use-promoters.test.tsx
│   ├── use-promoters.ts
│   └── use-toast.ts
├── lib/                           # Utility functions, schemas, Supabase client
│   ├── __tests__/
│   ├── dashboard-data.ts
│   ├── dashboard-types.ts
│   ├── data.ts
│   ├── dev-log.ts
│   ├── document-status.ts
│   ├── fixtures/
│   ├── generate-contract-form-schema.ts
│   ├── party-schema.ts
│   ├── promoter-profile-schema.ts
│   ├── schema-generator.ts
│   ├── supabase/                  # Supabase client configurations
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   └── server.ts
│   ├── supabase.ts                # Main Supabase client instance
│   ├── supabaseServer.ts
│   ├── types.ts
│   ├── utils.ts                   # General utilities (e.g., `cn` for Tailwind)
│   └── validations/               # Zod schemas for validation
├── public/                        # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── scripts/                       # Database migration scripts, utility scripts
│   ├── 001_create_promoters_table.sql
│   ├── 002_alter_parties_add_type.sql
│   ├── 003_alter_promoters_refactor.sql
│   ├── 004_create_contracts_table.sql
│   ├── 005_create_dashboard_rpc.sql
│   ├── 007_update_rls_policies.sql
│   ├── analyze-csv.js
│   └── build-form.cjs
├── styles/globals.css             # Global CSS styles
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── ... (other config files: package.json, next.config.mjs, etc.)
\`\`\`

## Internationalization

The application uses `next-intl` for internationalization.
Messages are located in `messages/` directory (e.g., `messages/en.json`, `messages/ar.json`).
The `[locale]` segment in the `app` directory handles dynamic routing for different languages.

## Supabase Integration

- **Client-side Supabase**: `lib/supabase/client.ts` for browser-side interactions.
- **Server-side Supabase**: `lib/supabase/server.ts` for server components and API routes.
- **Admin Supabase**: `lib/supabase/admin.ts` for privileged server actions (requires `SUPABASE_SERVICE_ROLE_KEY`).
- **Realtime Subscriptions**: Used in `components/dashboard/audit-logs.tsx` and `components/dashboard/notification-system.tsx` for live updates.

## Running Tests

\`\`\`bash
npm test
# or
yarn test
\`\`\`

## Deployment

This project can be easily deployed to Vercel. Ensure your environment variables are configured correctly on Vercel.

## Support

If you encounter any issues or have questions, please open a support ticket at [vercel.com/help](https://vercel.com/help).
