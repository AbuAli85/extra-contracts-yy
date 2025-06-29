# Bilingual Contract Generator

This is a Next.js application designed to generate bilingual contracts, manage parties, and promoters. It integrates with Supabase for database and authentication, and uses shadcn/ui for a modern and accessible user interface.

## Features

- **Bilingual Contract Generation**: Generate contracts in both English and Spanish.
- **Party Management**: Create, view, update, and delete contract parties (individuals or companies).
- **Promoter Management**: Create, view, update, and delete promoters, including profile pictures.
- **Dashboard**: Overview of contracts, analytics, audit logs, and notifications.
- **Authentication**: User authentication powered by Supabase Auth.
- **Internationalization (i18n)**: Support for multiple languages (English and Spanish).
- **Responsive Design**: Optimized for various screen sizes.
- **Server Actions**: Efficient data mutations using Next.js Server Actions.
- **React Query**: Data fetching and caching with `@tanstack/react-query`.
- **Zod Validation**: Schema validation for forms.
- **Shadcn/ui**: Beautiful and accessible UI components.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Git
- A Supabase project

### Installation

1.  **Clone the repository**:
    \`\`\`bash
    git clone https://github.com/your-username/bilingual-contract-generator.git
    cd bilingual-contract-generator
    \`\`\`

2.  **Install dependencies**:
    \`\`\`bash
    pnpm install
    # or
    npm install
    \`\`\`

3.  **Set up Supabase**:
    -   Go to your Supabase project dashboard.
    -   Navigate to `Settings > API` and copy your `Project URL` and `anon public` key.
    -   Create a `.env.local` file in the root of your project and add the following:
        \`\`\`env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY


### Dashboard data modules

Client components should import helpers from `lib/dashboard-data.client.ts`.
Server components use `lib/dashboard-data.server.ts`.
This explicit separation replaces the former dynamic helper.
