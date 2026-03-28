import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { CLERK_PUBLISHABLE_KEY } from "@/auth/clerkConfig";
import "./index.css";
import App from "./App.tsx";

// eslint-disable-next-line react-refresh/only-export-components
function ClerkProviderWithRouting({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProviderWithRouting>
        <App />
      </ClerkProviderWithRouting>
    </BrowserRouter>
  </StrictMode>,
);
