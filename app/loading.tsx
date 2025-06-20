// For AbuAli85 - A global loading indicator to fix the missing module error.
// Generated at: 2025-06-20 13:14:49 UTC

export default function Loading() {
  // This is a simple spinner. You can customize it with any loading UI you want.
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
