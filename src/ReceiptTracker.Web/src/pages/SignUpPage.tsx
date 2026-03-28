import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#5E6AD2",
    colorBackground: "#0a0a0c",
    colorInputBackground: "rgba(255, 255, 255, 0.05)",
    colorInputText: "#EDEDEF",
    colorText: "#EDEDEF",
    colorTextSecondary: "#8A8F98",
    colorNeutral: "#8A8F98",
    borderRadius: "0.75rem",
    fontFamily: '"Inter", "Geist Sans", system-ui, sans-serif',
  },
  elements: {
    card: "shadow-none bg-transparent",
    rootBox: "w-full flex justify-center",
  },
} as const;

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />

      <Header isLandingPage={false} />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="glass max-w-md">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            appearance={clerkAppearance}
          />
        </div>
      </main>

      <Footer isLandingPage={false} />
    </div>
  );
}
