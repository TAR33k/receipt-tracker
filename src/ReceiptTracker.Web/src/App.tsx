import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useUserId } from "@/hooks/useUserId";
import UserSetup from "@/pages/UserSetupPage";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import ReceiptDetailPage from "@/pages/ReceiptDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("404"))
          return false;
        return failureCount < 2;
      },
      staleTime: 10_000,
    },
  },
});

function AppRoutes() {
  const { userId } = useUserId();

  if (!userId) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<UserSetup />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/receipts/:id" element={<ReceiptDetailPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
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
