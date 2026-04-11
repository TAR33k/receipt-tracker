import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignedIn, SignedOut, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { setTokenProvider } from "@/auth/clerkConfig";
import { Loader2 } from "lucide-react";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/DashboardPage";
import ReceiptDetailPage from "@/pages/ReceiptDetailPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("404")) return false;
        return failureCount < 2;
      },
      staleTime: 10_000,
    },
  },
});

function TokenProvider() {
  const { getToken } = useClerkAuth();

  useEffect(() => {
    setTokenProvider(() => getToken());
  }, [getToken]);

  return null;
}

function AppRoutes() {
  const { isLoaded } = useClerkAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <TokenProvider />
      </SignedIn>

      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <LandingPage />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/receipts/:id"
          element={
            <>
              <SignedIn>
                <ReceiptDetailPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />

        <Route
          path="*"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "glass border-white/[0.06] text-[#EDEDEF] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
            description: "text-[#8A8F98]",
          },
        }}
      />
    </QueryClientProvider>
  );
}
