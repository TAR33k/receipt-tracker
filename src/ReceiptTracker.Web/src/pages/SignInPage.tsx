import { SignIn } from "@clerk/clerk-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { clerkAppearance } from "@/lib/utils";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />

      <Header isLandingPage={false} />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="glass max-w-md">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={clerkAppearance}
          />
        </div>
      </main>

      <Footer isLandingPage={false} />
    </div>
  );
}
