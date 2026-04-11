export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set in environment variables.");
}

let _getToken: (() => Promise<string | null>) | null = null;

export function setTokenProvider(fn: () => Promise<string | null>): void {
  _getToken = fn;
}

export async function resolveToken(): Promise<string> {
  if (!_getToken) {
    throw new Error("Token provider not initialized. Make sure TokenProvider is mounted.");
  }
  const token = await _getToken();
  if (!token) {
    throw new Error("No token available. User may not be authenticated.");
  }
  return token;
}
