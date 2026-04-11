import { Loader2, Receipt as ReceiptIcon } from "lucide-react";
import ReceiptCard from "@/components/receipts/ReceiptCard";
import type { Receipt } from "@/types/receipt";

interface Pagination {
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ReceiptsListSectionProps {
  receipts: Receipt[];
  pagination: Pagination | undefined;
  isLoading: boolean;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
}

export function ReceiptsListSection({
  receipts,
  pagination,
  isLoading,
  searchInput,
  onSearchChange,
  onClearSearch,
  onPageChange,
}: ReceiptsListSectionProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h3 className="text-lg font-semibold text-white">Your Receipts</h3>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by merchant name..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#8A8F98] focus:outline-none focus:border-[#5E6AD2]/50 focus:ring-1 focus:ring-[#5E6AD2]/50 transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchInput && (
            <button
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F98] hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="glass rounded-2xl p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#5E6AD2] animate-spin" />
        </div>
      ) : receipts.length === 0 ? (
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
          {receipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-[#8A8F98]">
            Page {pagination.page} of {pagination.totalPages}
            <span className="ml-2">({pagination.totalCount} total)</span>
          </span>
          <button
            onClick={() =>
              onPageChange(Math.min(pagination.totalPages, pagination.page + 1))
            }
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
