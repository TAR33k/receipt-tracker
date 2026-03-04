import { TrendingUp } from "lucide-react";

export default function Footer({ isLandingPage }: { isLandingPage: boolean }) {
  return (
    <footer
      className={`relative ${isLandingPage ? "py-16" : "py-8"} border-t border-white/[0.06]`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {isLandingPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 mb-12">
            <div>
              <div className="flex justify-center md:justify-start items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Receipt Tracker"
                    className="w-5 h-5"
                  />
                </div>
                <span className="text-xl font-semibold text-white text-center md:text-left">
                  Receipt Tracker
                </span>
              </div>
              <p className="text-[#8A8F98] max-w-sm mb-6 text-center md:text-left">
                AI-powered receipt management.
                <br />
                Simplify your expense tracking.
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <div>
                <h4 className="font-medium text-white mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-[#8A8F98]">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-white transition-colors"
                    >
                      How it works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#technology"
                      className="hover:text-white transition-colors"
                    >
                      Technology
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div
          className={`pt-8 ${isLandingPage ? "border-t border-white/[0.06]" : ""} flex flex-col sm:flex-row items-center justify-between gap-4`}
        >
          <p className="text-sm text-[#8A8F98]">
            © {new Date().getFullYear()} Receipt Tracker
          </p>
          <div className="flex items-center gap-6 text-sm text-[#8A8F98]">
            <TrendingUp className="w-4 h-4" />
            <a
              href="https://github.com/TAR33k/receipt-tracker"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
