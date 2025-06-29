# Bilingual Contract Generator

This is a Next.js application designed to generate and manage bilingual contracts. It supports English and Spanish, allowing users to create, view, and manage contracts efficiently. The application integrates with Supabase for database and authentication services.

## Features

-   **Bilingual Support**: Generate contracts in both English and Spanish.
-   **Contract Management**: Create, view, edit, and delete contracts.
-   **Party and Promoter Management**: Manage details of parties involved and promoters.
-   **Dashboard**: Overview of contract analytics, audit logs, and notifications.
-   **User Authentication**: Secure login and session management using Supabase Auth.
-   **Responsive Design**: Optimized for various screen sizes.

## Technologies Used

-   **Next.js**: React framework for building server-side rendered and static web applications.
-   **React**: JavaScript library for building user interfaces.
-   **TypeScript**: Superset of JavaScript that adds static types.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
-   **Supabase**: Open-source Firebase alternative for database, authentication, and storage.
-   **React Hook Form**: For flexible and extensible forms with easy validation.
-   **Zod**: TypeScript-first schema declaration and validation library.
-   **React Query (TanStack Query)**: For data fetching, caching, and synchronization.
-   **next-intl**: For internationalization (i18n) in Next.js applications.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   pnpm (recommended package manager)
-   A Supabase project

### Installation

1.  **Clone the repository**:
    \`\`\`bash
    git clone https://github.com/your-username/bilingual-contract-generator.git
    cd bilingual-contract-generator
    \`\`\`

2.  **Install dependencies**:
    \`\`\`bash
    pnpm install
    \`\`\`

3.  **Set up Supabase**:
    -   Go to your Supabase project dashboard.
    -   Navigate to "Project Settings" -> "API".
    -   Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

4.  **Configure environment variables**:
    -   Create a `.env.local` file in the root of your project:
