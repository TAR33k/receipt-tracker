import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserId } from "@/hooks/useUserId";
import { useNavigate } from "react-router-dom";

export default function UserSetup() {
  const { saveUserId } = useUserId();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      saveUserId(name.trim());
    }
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />

      <motion.div
        className="glass card-spotlight w-full max-w-md p-8 sm:p-10 space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-[#5E6AD2]/15 border border-[#5E6AD2]/30 flex items-center justify-center shadow-[0_0_0_1px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <img src="/logo.png" alt="Receipt Tracker" className="w-8 h-8" />
          </motion.div>
          <div className="text-center space-y-2">
            <motion.h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-gradient"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Receipt Tracker
            </motion.h1>
            <motion.p
              className="text-sm text-[#8A8F98] flex items-center justify-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI-powered receipt processing
            </motion.p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#EDEDEF]">
              Your name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Tarik"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="off"
              className="h-12 bg-white/5 border-white/10 focus:border-[#5E6AD2]/50 focus:ring-[#5E6AD2]/20 text-[#EDEDEF] placeholder:text-white/30"
            />
            <p className="text-xs text-[#8A8F98]">
              Used to identify your receipts. Authentication coming in a future
              update.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full btn-primary h-12 text-base"
              disabled={!name.trim()}
            >
              Get started
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
