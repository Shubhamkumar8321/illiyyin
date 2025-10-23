"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Global client-side providers wrapper.
 * This lets us use `useSession()` and other React hooks
 * throughout the app without making the root layout a client component.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
