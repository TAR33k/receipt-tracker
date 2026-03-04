import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ReceiptStatusBadge from "@/components/receipts/ReceiptStatusBadge";
import ReviewForm from "@/components/receipts/ReviewForm";
import { getReceipt } from "@/api/receipts";
import type { Receipt } from "@/types/receipt";
import { TERMINAL_STATUSES } from "@/types/receipt";
import {
  cn,
  formatAmountSimple,
  formatDate,
  formatDateTime,
} from "@/lib/utils";

function ConfidenceBar({ value }: { value: number | null }) {
  if (value === null) return null;
  const pct = Math.round(value * 100);
  const color =
    pct >= 90 ? "bg-emerald-500" : pct >= 80 ? "bg-teal-500" : "bg-amber-500";

  return (
    <div className="flex items-center gap-2 mt-0.5">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs tabular-nums font-medium",
          pct >= 90
            ? "text-emerald-400"
            : pct >= 80
              ? "text-teal-400"
              : "text-amber-400",
        )}
      >
        {pct}%
      </span>
    </div>
  );
}

interface FieldRowProps {
  label: string;
  value: string | null;
  confidence?: number | null;
}

function FieldRow({ label, value, confidence }: FieldRowProps) {
  return (
    <div className="py-4">
      <p className="text-xs text-[#8A8F98] uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={cn(
          "text-base font-medium",
          value ? "text-[#EDEDEF]" : "text-[#8A8F98] italic",
        )}
      >
        {value ?? "Not detected"}
      </p>
      {confidence !== undefined && <ConfidenceBar value={confidence} />}
    </div>
  );
}

function ProcessingBanner() {
  return (
    <div className="glass card-spotlight p-6 flex flex-col items-center gap-4 text-center rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/15 border border-[#5E6AD2]/30 flex items-center justify-center shadow-[0_0_20px_rgba(94,106,210,0.2)]">
        <Loader2 className="w-7 h-7 text-[#5E6AD2] animate-spin" />
      </div>
      <div>
        <p className="font-medium text-lg text-[#EDEDEF]">
          AI extraction in progress
        </p>
        <p className="text-sm text-[#8A8F98] mt-1 max-w-sm">
          Document Intelligence is reading your receipt. This usually takes 5–15
          seconds.
        </p>
      </div>
    </div>
  );
}

function QueuedBanner() {
  return (
    <div className="glass card-spotlight p-6 flex flex-col items-center gap-4 text-center rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
        <Clock className="w-7 h-7 text-[#818CF8]" />
      </div>
      <div>
        <p className="font-medium text-lg text-[#EDEDEF]">
          Waiting to be processed
        </p>
        <p className="text-sm text-[#8A8F98] mt-1">
          Your receipt is queued. Processing will start shortly.
        </p>
      </div>
    </div>
  );
}

function FailedBanner({ message }: { message: string | null }) {
  return (
    <div className="glass border-red-500/20 p-6 flex items-start gap-4 rounded-2xl">
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <XCircle className="w-6 h-6 text-red-400" />
      </div>
      <div>
        <p className="font-medium text-base text-red-400">Processing failed</p>
        <p className="text-sm text-[#8A8F98] mt-1">
          {message ??
            "An unknown error occurred. The file may not contain a readable receipt."}
        </p>
      </div>
    </div>
  );
}

function NeedsReviewBanner() {
  return (
    <div className="glass border-amber-500/20 p-5 flex items-start gap-4 rounded-2xl">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <p className="font-medium text-base text-amber-400">Review required</p>
        <p className="text-sm text-[#8A8F98] mt-0.5">
          One or more fields were extracted with low confidence. Please verify
          and correct them below.
        </p>
      </div>
    </div>
  );
}

function CompletedBanner() {
  return (
    <div className="glass border-emerald-500/20 p-5 flex items-center gap-4 rounded-2xl">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
      </div>
      <p className="text-base text-emerald-400 font-medium">
        Extraction complete — all fields verified
      </p>
    </div>
  );
}

function ExtractedFields({ receipt }: { receipt: Receipt }) {
  return (
    <div className="glass card-spotlight divide-y divide-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-6">
        <FieldRow
          label="Merchant"
          value={receipt.merchantName}
          confidence={receipt.merchantNameConfidence}
        />
      </div>
      <div className="px-6">
        <FieldRow
          label="Total"
          value={formatAmountSimple(receipt.totalAmount, receipt.currency)}
          confidence={receipt.totalAmountConfidence}
        />
      </div>
      <div className="px-6">
        <FieldRow
          label="Transaction date"
          value={formatDate(receipt.transactionDate, "long")}
          confidence={receipt.transactionDateConfidence}
        />
      </div>
    </div>
  );
}

function MetaRow({ receipt }: { receipt: Receipt }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#8A8F98] mt-2">
      <span>Uploaded {formatDateTime(receipt.createdAt)}</span>
      {receipt.processedAt && (
        <span>Processed {formatDateTime(receipt.processedAt)}</span>
      )}
    </div>
  );
}

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [shouldPoll, setShouldPoll] = useState(true);

  const {
    data: receipt,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["receipt", id],
    queryFn: () => getReceipt(id!),
    refetchInterval: shouldPoll ? 3000 : false,
    enabled: !!id,
  });

  useEffect(() => {
    if (receipt && TERMINAL_STATUSES.includes(receipt.status)) {
      setShouldPoll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt?.status]);

  return (
    <Layout>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[#8A8F98] hover:text-[#EDEDEF] transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        All receipts
      </Link>

      {isLoading && (
        <motion.div
          className="glass flex items-center justify-center py-16 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Loader2 className="w-6 h-6 animate-spin text-[#8A8F98]" />
        </motion.div>
      )}

      {isError && (
        <motion.div
          className="glass p-8 text-center rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-red-400">
            {error instanceof Error
              ? error.message.includes("404")
                ? "Receipt not found"
                : error.message
              : "Receipt not found"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 btn-secondary"
            asChild
          >
            <Link to="/">Go back</Link>
          </Button>
        </motion.div>
      )}

      {receipt && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-start justify-between gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div>
              <h1
                className={cn(
                  "text-2xl sm:text-3xl font-semibold tracking-tight",
                  receipt.merchantName
                    ? "text-[#EDEDEF]"
                    : "text-[#8A8F98] italic",
                )}
              >
                {receipt.merchantName ?? "Receipt"}
              </h1>
              <MetaRow receipt={receipt} />
            </div>
            <ReceiptStatusBadge
              status={receipt.status}
              className="mt-1 flex-shrink-0"
            />
          </motion.div>

          {receipt.status === "Uploaded" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <QueuedBanner />
            </motion.div>
          )}
          {receipt.status === "Processing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ProcessingBanner />
            </motion.div>
          )}
          {receipt.status === "Failed" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <FailedBanner message={receipt.errorMessage} />
            </motion.div>
          )}
          {receipt.status === "NeedsReview" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <NeedsReviewBanner />
            </motion.div>
          )}
          {receipt.status === "Completed" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <CompletedBanner />
            </motion.div>
          )}

          {(receipt.status === "Completed" ||
            receipt.status === "NeedsReview") && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <ExtractedFields receipt={receipt} />

              {receipt.status === "NeedsReview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="section-divider" />
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-lg font-medium text-[#EDEDEF]">
                        Correct extracted data
                      </h2>
                      <p className="text-sm text-[#8A8F98] mt-1">
                        Only fill in fields you want to change. Leave others
                        as-is.
                      </p>
                    </div>
                    <ReviewForm receipt={receipt} />
                  </section>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </Layout>
  );
}
