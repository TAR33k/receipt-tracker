import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ReviewForm from "@/components/receipts/ReviewForm";
import { useReceiptDetail } from "@/hooks/useReceiptDetail";
import { ExtractedFields } from "@/components/receipt-detail/ExtractedFields";
import { ReceiptDetailHeader, BackLink } from "@/components/receipt-detail/ReceiptDetailHeader";
import {
  ProcessingBanner,
  QueuedBanner,
  FailedBanner,
  NeedsReviewBanner,
  CompletedBanner,
} from "@/components/receipts/status-banners";

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { receipt, isLoading, isError, error } = useReceiptDetail(id);

  const renderStatusBanner = () => {
    if (!receipt) return null;

    switch (receipt.status) {
      case "Uploaded":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <QueuedBanner />
          </motion.div>
        );
      case "Processing":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ProcessingBanner />
          </motion.div>
        );
      case "Failed":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <FailedBanner message={receipt.errorMessage} />
          </motion.div>
        );
      case "NeedsReview":
        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <NeedsReviewBanner />
          </motion.div>
        );
      case "Completed":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <CompletedBanner />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <BackLink to="/dashboard">All receipts</BackLink>

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
          <Button variant="ghost" size="sm" className="mt-4 btn-secondary" asChild>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ReceiptDetailHeader receipt={receipt} />
          </motion.div>

          {renderStatusBanner()}

          {(receipt.status === "Completed" || receipt.status === "NeedsReview") && (
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
                      <h2 className="text-lg font-medium text-[#EDEDEF]">Correct extracted data</h2>
                      <p className="text-sm text-[#8A8F98] mt-1">
                        Only fill in fields you want to change. Leave others as-is.
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
