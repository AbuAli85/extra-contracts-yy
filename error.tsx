// Re-export the global error page from the app directory using the alias
// defined in tsconfig.json. This avoids runtime resolution issues when Next.js
// attempts to load the module using a relative specifier.
export { default } from "@/app/error";
