"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client-side instance.
 * In Next.js App Router where frontend and backend are hosted on the same origin,
 * leaving `baseURL` undefined in the browser forces the client to use relative `/api/auth/*`
 * requests. This prevents:
 * 1. Cross-origin fetch blocking by browser security/adblock extensions (e.g. activeContentBlocker.js).
 * 2. Origin mismatch errors when accessing via `http://127.0.0.1:3000` vs `http://localhost:3000`.
 * 3. Port mismatch errors if Next.js dev server runs on 3001, 3002, etc.
 */
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? undefined
      : (process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000"),
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} = authClient;
