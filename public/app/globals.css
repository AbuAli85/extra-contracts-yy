@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables layer: light mode CSS variables */
@layer base {
  :root {
    --background: 0 0% 100%; /* Light mode background */
    --foreground: 240 10% 3.9%; /* Light mode text */
    /* add other light mode CSS variables here */
  }
}

/* Variables layer: dark mode CSS variables via media query */
@layer base {
  @media (prefers-color-scheme: dark) {
    :root {
      --background: 240 10% 3.9%; /* Dark mode background */
      --foreground: 0 0% 98%;    /* Dark mode text */
      /* add other dark mode CSS variables here */
    }
  }
}

/* Global element styles */
@layer base {
  html {
    @apply antialiased;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  /* Form input states */
  .form-input {
    @apply block w-full rounded-md border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
  }
  .form-input[aria-invalid="true"] {
    @apply ring-destructive ring-2;
  }
  .form-input.success {
    @apply ring-success ring-2;
  }
}

/* Typography layer: heading styles */
@layer typography {
  h1 { @apply font-heading font-semibold tracking-tight text-3xl md:text-4xl; }
  h2 { @apply font-heading font-semibold tracking-tight text-2xl md:text-3xl; }
  h3 { @apply font-heading font-semibold tracking-tight text-xl md:text-2xl; }
  h4 { @apply font-heading font-semibold tracking-tight text-lg; }
  h5 { @apply font-heading font-semibold tracking-tight text-base; }
  h6 { @apply font-heading font-semibold tracking-tight text-base; }
}

/* Utilities layer: custom scrollbar styling */
@layer utilities {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: hsl(var(--secondary));
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.5);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.7);
  }
}
