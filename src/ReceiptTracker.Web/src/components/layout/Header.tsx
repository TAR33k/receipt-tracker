import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ isLandingPage }: { isLandingPage: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { userDisplayName, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 backdrop-blur-xl bg-[#050506]/80 border-b border-white/[0.06]"
          : "py-6"
      }`}
      initial={{ y: isLandingPage ? -100 : 0 }}
      animate={{ y: 0 }}
      transition={{
        duration: isLandingPage ? 0.6 : 0,
        ease: isLandingPage ? [0.23, 1, 0.32, 1] : [0, 0, 0, 0],
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] flex items-center justify-center cursor-pointer hover:bg-[#5E6AD2]/80"
            onClick={() =>
              !isLandingPage
                ? navigate("/")
                : window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <img src="/logo.png" alt="Receipt Tracker" className="w-5 h-5" />
          </div>
          <span
            className="text-xl font-semibold text-white cursor-pointer hover:text-[#5E6AD2]"
            onClick={() =>
              !isLandingPage
                ? navigate("/")
                : window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Receipt Tracker
          </span>
        </div>

        {isLandingPage && (
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-[#8A8F98] hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-[#8A8F98] hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="#technology"
              className="text-sm text-[#8A8F98] hover:text-white transition-colors"
            >
              Technology
            </a>
          </nav>
        )}

        {!isAuthenticated && (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hidden sm:block text-[#8A8F98] hover:text-white hover:bg-white/5"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </Button>
            <Button
              className="btn-primary"
              onClick={() => navigate("/sign-up")}
            >
              Get Started
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#5e6ad2] to-[#6872d9] flex items-center justify-center shadow-lg shadow-[#5E6AD2]/20">
              <span className="text-xs font-semibold text-white">
                {userDisplayName
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "U"}
              </span>
            </div>

            <span className="hidden sm:block text-sm text-[#EDEDEF] mr-4">
              {userDisplayName || "User"}
            </span>

            <div className="hidden sm:block w-px h-6 bg-white/10" />

            <Button
              variant="ghost"
              className="text-[#8A8F98] hover:text-white hover:bg-[#5E6AD2]/80"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
