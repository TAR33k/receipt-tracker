import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Receipt as ReceiptIcon,
  Loader2,
  Calendar,
  Camera,
  Upload,
  X,
  Wallet,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getReceipts, uploadReceipt } from "@/api/receipts";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "sonner";
import type { Receipt } from "@/types/receipt";
import { cn, formatAmount, DEFAULT_CURRENCY } from "@/lib/utils";
import ReceiptCard from "@/components/receipts/ReceiptCard";
import Layout from "@/components/layout/Layout";

function WelcomeHeader({ userId }: { userId: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const shortId = userId.slice(0, 8);

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[#8A8F98] text-sm">{greeting},</span>
        <span className="text-[#EDEDEF] text-sm font-medium">{shortId}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white">
        Your <span className="text-gradient-accent">Dashboard</span>
      </h1>
    </motion.div>
  );
}

function SpendingSummaryCard({ receipts }: { receipts: Receipt[] }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthReceipts = receipts.filter((r) => {
    if (!r.transactionDate || r.status !== "Completed") return false;
    const date = new Date(r.transactionDate);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const lastMonthReceipts = receipts.filter((r) => {
    if (!r.transactionDate || r.status !== "Completed") return false;
    const date = new Date(r.transactionDate);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return (
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    );
  });

  const thisMonthTotal = thisMonthReceipts.reduce(
    (sum, r) => sum + (r.totalAmount || 0),
    0,
  );
  const lastMonthTotal = lastMonthReceipts.reduce(
    (sum, r) => sum + (r.totalAmount || 0),
    0,
  );

  const percentChange =
    lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;
  const isPositive = percentChange >= 0;

  const currencyCode = receipts[0]?.currency || DEFAULT_CURRENCY;

  return (
    <motion.div
      className="glass rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#5E6AD2]" />
          </div>
          <div>
            <p className="text-sm text-[#8A8F98]">Total Spent This Month</p>
            <p className="text-3xl font-bold text-white">
              {formatAmount(thisMonthTotal, currencyCode)}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
            isPositive
              ? "bg-red-500/10 text-red-400"
              : "bg-emerald-500/10 text-emerald-400",
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {isPositive ? "+" : ""}
          {percentChange.toFixed(1)}% from last month
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-[#8A8F98]">
          <ReceiptIcon className="w-4 h-4" />
          {thisMonthReceipts.length} receipts this month
        </div>
        <div className="flex items-center gap-2 text-[#8A8F98]">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </motion.div>
  );
}

function MerchantChart({ receipts }: { receipts: Receipt[] }) {
  const merchantData = useMemo(() => {
    const completed = receipts.filter(
      (r) => r.status === "Completed" && r.merchantName,
    );
    const grouped = completed.reduce(
      (acc, receipt) => {
        const name = receipt.merchantName || "Unknown";
        acc[name] = (acc[name] || 0) + (receipt.totalAmount || 0);
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [receipts]);

  const COLORS = ["#6366F1", "#5E6AD2", "#818CF8", "#A5B4FC", "#C7D2FE"];

  const currencyCode =
    receipts.find((r) => r.currency)?.currency || DEFAULT_CURRENCY;

  if (merchantData.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 h-[300px] flex items-center justify-center">
        <div className="text-center">
          <BarChart className="w-12 h-12 text-[#8A8F98] mx-auto mb-3" />
          <p className="text-[#8A8F98]">No data yet</p>
          <p className="text-sm text-[#8A8F98]/70">
            Upload receipts to see analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-white mb-6">
        Spending by Merchant
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={merchantData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#8A8F98"
              fontSize={12}
              tickFormatter={(value) =>
                formatAmount(Number(value), currencyCode, {
                  notation: "compact",
                  maximumFractionDigits: 0,
                })
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#8A8F98"
              fontSize={12}
              width={120}
              tickFormatter={(value) =>
                value.length > 30 ? value.slice(0, 30) + "..." : value
              }
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#0a0a0b",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px",
                color: "#EDEDEF",
              }}
              formatter={(value) => [
                <span style={{ color: "#EDEDEF" }}>
                  {formatAmount(Number(value), currencyCode)}
                </span>,
              ]}
              cursor={{
                fill: "rgba(255,255,255,0.1)",
                stroke: "rgba(255,255,255,0.1)",
                strokeWidth: 0.5,
              }}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
              {merchantData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function ProcessingReceiptCard() {
  return (
    <motion.div
      className="glass rounded-2xl p-5 overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#5E6AD2]/5 via-purple-500/5 to-[#5E6AD2]/5 animate-pulse" />

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#5E6AD2] animate-spin" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-white">Processing receipt...</p>
          <p className="text-sm text-[#8A8F98]">AI is extracting data</p>
        </div>
        <div className="text-right">
          <Clock className="w-5 h-5 text-[#5E6AD2] mb-1" />
          <span className="text-xs text-[#8A8F98]">~5s</span>
        </div>
      </div>

      <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#5E6AD2] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "40%", "70%", "90%"] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

function DesktopUploadArea({ onUpload }: { onUpload: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <motion.div
      className="hidden md:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Upload Receipt
        </h3>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
            isDragging
              ? "border-[#5E6AD2] bg-[#5E6AD2]/10"
              : "border-white/10 hover:border-white/20 hover:bg-white/5",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-[#5E6AD2]" />
          </div>
          <p className="text-white font-medium mb-1">Drop your receipt here</p>
          <p className="text-sm text-[#8A8F98]">
            or click to browse • Images and PDF files
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MobileFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      className="md:hidden fixed bottom-6 right-8 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-[#5E6AD2] flex items-center justify-center shadow-[0_0_30px_rgba(94,106,210,0.5),0_4px_12px_rgba(0,0,0,0.3)]"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Plus className="w-7 h-7 text-white" />
    </motion.button>
  );
}

function MobileUploadModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0b] border-t border-white/10 rounded-t-3xl p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add Receipt</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5 text-[#8A8F98]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="glass p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-[#5E6AD2]/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-[#5E6AD2]" />
                </div>
                <span className="text-white font-medium">Take Photo</span>
              </button>

              <button
                className="glass p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-[#5E6AD2]/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-[#5E6AD2]" />
                </div>
                <span className="text-white font-medium">Upload</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
export default function Dashboard() {
  const { userId } = useUserId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileUploadOpen, setMobileUploadOpen] = useState(false);

  const { data: receipts, isLoading } = useQuery({
    queryKey: ["receipts"],
    queryFn: getReceipts,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      return data.some(
        (r) => r.status === "Uploaded" || r.status === "Processing",
      )
        ? 3000
        : false;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadReceipt,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt uploaded", {
        description: "AI extraction started...",
      });
      navigate(`/receipts/${data.receiptId}`);
    },
    onError: (error: Error) => {
      toast.error("Upload failed", { description: error.message });
    },
  });

  const handleUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  const activeReceipts =
    receipts?.filter(
      (r) => r.status === "Uploaded" || r.status === "Processing",
    ) || [];
  const recentReceipts =
    receipts?.filter(
      (r) => r.status !== "Uploaded" && r.status !== "Processing",
    ) || [];

  if (!userId) {
    navigate("/");
    return null;
  }

  return (
    <Layout>
      <WelcomeHeader userId={userId} />

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="space-y-6">
          {receipts && <SpendingSummaryCard receipts={receipts} />}
          {receipts && <MerchantChart receipts={receipts} />}
          <DesktopUploadArea onUpload={handleUpload} />
        </div>
      </div>

      <AnimatePresence>
        {activeReceipts.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-[#5E6AD2] animate-spin" />
              Processing
            </h3>
            <div className="space-y-3">
              {activeReceipts.map((receipt) => (
                <ProcessingReceiptCard key={receipt.id} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Receipts</h3>
        </div>

        {isLoading ? (
          <div className="glass rounded-2xl p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#5E6AD2] animate-spin" />
          </div>
        ) : recentReceipts.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center mx-auto mb-4">
              <ReceiptIcon className="w-4 h-4" />
            </div>
            <p className="text-white font-medium mb-2">No receipts yet</p>
            <p className="text-sm text-[#8A8F98]">
              Upload your first receipt to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReceipts.map((receipt) => (
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))}
          </div>
        )}
      </div>

      <MobileFAB onClick={() => setMobileUploadOpen(true)} />

      <MobileUploadModal
        isOpen={mobileUploadOpen}
        onClose={() => setMobileUploadOpen(false)}
        onUpload={handleUpload}
      />
    </Layout>
  );
}
