/**
 * Safe environment variable accessor.
 * Returns the value or a fallback. Never throws.
 */
export function env(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

/**
 * Required environment variable accessor.
 * Throws in production if the variable is missing.
 * Logs a warning in development.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    const message = `Missing required environment variable: ${key}`;
    if (process.env["NODE_ENV"] === "production") {
      throw new Error(message);
    }
    console.warn(`[env] ${message}`);
    return "";
  }
  return value;
}

/**
 * Check if all required environment variables are set.
 */
export function checkRequiredEnvVars(keys: string[]): void {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const message = `Missing environment variables: ${missing.join(", ")}`;
    if (process.env["NODE_ENV"] === "production") {
      throw new Error(message);
    }
    console.warn(`[env] ${message}`);
  }
}
