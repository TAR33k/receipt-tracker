import { useClerk, useUser } from "@clerk/clerk-react";

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  const userId = user?.id ?? null;
  const userDisplayName = user?.firstName ?? null;
  const isAuthenticated = isLoaded && (isSignedIn ?? false);

  function handleSignOut() {
    signOut({ redirectUrl: "/" });
  }

  return {
    userId,
    userDisplayName,
    isAuthenticated,
    isLoaded,
    signOut: handleSignOut,
  };
}
