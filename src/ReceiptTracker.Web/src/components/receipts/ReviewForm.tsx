import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/api/receipts";
import type { Receipt, ReceiptReviewDto } from "@/types/receipt";
import { formatDateForInput, cn } from "@/lib/utils";

type ValidationErrors = {
  merchantName?: string;
  totalAmount?: string;
  transactionDate?: string;
  currency?: string;
};

function validateMerchantName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return "Merchant name is required";
  if (trimmed.length < 2) return "Merchant name must be at least 2 characters";
  if (trimmed.length > 100)
    return "Merchant name must be less than 100 characters";
  return undefined;
}

function validateTotalAmount(amount: string): string | undefined {
  if (!amount.trim()) return "Total amount is required";
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return "Please enter a valid number";
  if (parsed <= 0) return "Amount must be greater than 0";
  if (parsed > 999999.99) return "Amount must be less than 1,000,000";
  return undefined;
}

function validateTransactionDate(date: string): string | undefined {
  if (!date) return "Transaction date is required";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "Please enter a valid date";
  const now = new Date();
  const oneYearFromNow = new Date(
    now.getFullYear() + 1,
    now.getMonth(),
    now.getDate(),
  );
  if (parsed > oneYearFromNow)
    return "Date cannot be more than 1 year in the future";
  if (parsed.getFullYear() < 1900) return "Date must be after 1900";
  return undefined;
}

function validateCurrency(currency: string): string | undefined {
  const trimmed = currency.trim();
  if (!trimmed) return "Currency is required";
  if (!/^[A-Z]{3}$/i.test(trimmed))
    return "Currency must be 3 letters (e.g., BAM, USD, EUR)";
  return undefined;
}

interface Props {
  receipt: Receipt;
}

export default function ReviewForm({ receipt }: Props) {
  const queryClient = useQueryClient();

  const [merchantName, setMerchantName] = useState(receipt.merchantName ?? "");
  const [totalAmount, setTotalAmount] = useState(
    receipt.totalAmount !== null ? String(receipt.totalAmount) : "",
  );
  const [transactionDate, setTransactionDate] = useState(
    formatDateForInput(receipt.transactionDate),
  );
  const [currency, setCurrency] = useState(receipt.currency ?? "");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { mutate: submit, isPending } = useMutation({
    mutationFn: (dto: ReceiptReviewDto) => submitReview(receipt.id, dto),
    onSuccess: (updatedReceipt) => {
      queryClient.setQueryData(["receipt", receipt.id], updatedReceipt);
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Review submitted", {
        description: "Receipt marked as completed.",
      });
    },
    onError: (error: Error) => {
      toast.error("Submission failed", { description: error.message });
    },
  });

  function validateField(field: keyof ValidationErrors, value: string): void {
    let error: string | undefined;
    switch (field) {
      case "merchantName":
        error = validateMerchantName(value);
        break;
      case "totalAmount":
        error = validateTotalAmount(value);
        break;
      case "transactionDate":
        error = validateTransactionDate(value);
        break;
      case "currency":
        error = validateCurrency(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function handleBlur(field: keyof ValidationErrors, value: string): void {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  }

  function handleMerchantChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setMerchantName(value);
    if (touched.merchantName) {
      validateField("merchantName", value);
    }
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTotalAmount(value);
    if (touched.totalAmount) {
      validateField("totalAmount", value);
    }
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTransactionDate(value);
    if (touched.transactionDate) {
      validateField("transactionDate", value);
    }
  }

  function handleCurrencyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCurrency(value);
    if (touched.currency) {
      validateField("currency", value);
    }
  }

  function validateForm(): boolean {
    const newErrors: ValidationErrors = {
      merchantName: validateMerchantName(merchantName),
      totalAmount: validateTotalAmount(totalAmount),
      transactionDate: validateTransactionDate(transactionDate),
      currency: validateCurrency(currency),
    };
    setErrors(newErrors);
    setTouched({
      merchantName: true,
      totalAmount: true,
      transactionDate: true,
      currency: true,
    });
    return !Object.values(newErrors).some(Boolean);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const dto: ReceiptReviewDto = {
      merchantName: merchantName.trim(),
      totalAmount: parseFloat(totalAmount),
      transactionDate: new Date(transactionDate).toISOString(),
      currency: currency.trim().toUpperCase(),
    };

    submit(dto);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="merchantName" className="text-[#EDEDEF]">
            Merchant name
            {receipt.merchantNameConfidence !== null &&
              receipt.merchantNameConfidence < 0.8 && (
                <span className="ml-2 text-xs text-amber-400 font-normal">
                  Low confidence
                </span>
              )}
          </Label>
          <Input
            id="merchantName"
            value={merchantName}
            onChange={handleMerchantChange}
            onBlur={(e) => handleBlur("merchantName", e.target.value)}
            placeholder="e.g. Konzum d.d."
            className={cn(
              "h-11 text-white",
              errors.merchantName && touched.merchantName
                ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                : "border-white/10 bg-white/5",
            )}
          />
          <AnimatePresence>
            {errors.merchantName && touched.merchantName && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.merchantName}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalAmount" className="text-[#EDEDEF]">
            Total amount
            {receipt.totalAmountConfidence !== null &&
              receipt.totalAmountConfidence < 0.8 && (
                <span className="ml-2 text-xs text-amber-400 font-normal">
                  Low confidence
                </span>
              )}
          </Label>
          <Input
            id="totalAmount"
            type="number"
            step="0.01"
            min="0"
            value={totalAmount}
            onChange={handleAmountChange}
            onBlur={(e) => handleBlur("totalAmount", e.target.value)}
            placeholder="0.00"
            className={cn(
              "h-11 text-white",
              errors.totalAmount && touched.totalAmount
                ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                : "border-white/10 bg-white/5",
            )}
          />
          <AnimatePresence>
            {errors.totalAmount && touched.totalAmount && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.totalAmount}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionDate" className="text-[#EDEDEF]">
            Transaction date
            {receipt.transactionDateConfidence !== null &&
              receipt.transactionDateConfidence < 0.8 && (
                <span className="ml-2 text-xs text-amber-400 font-normal">
                  Low confidence
                </span>
              )}
          </Label>
          <Input
            id="transactionDate"
            type="date"
            value={transactionDate}
            onChange={handleDateChange}
            onBlur={(e) => handleBlur("transactionDate", e.target.value)}
            className={cn(
              "h-11 text-white w-full block [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert",
              errors.transactionDate && touched.transactionDate
                ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                : "border-white/10 bg-white/5",
            )}
          />
          <AnimatePresence>
            {errors.transactionDate && touched.transactionDate && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.transactionDate}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-[#EDEDEF]">
            Currency
          </Label>
          <Input
            id="currency"
            value={currency}
            onChange={handleCurrencyChange}
            onBlur={(e) => handleBlur("currency", e.target.value)}
            placeholder="e.g. BAM"
            maxLength={3}
            className={cn(
              "h-11 text-white",
              errors.currency && touched.currency
                ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                : "border-white/10 bg-white/5",
            )}
          />
          <AnimatePresence>
            {errors.currency && touched.currency && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.currency}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full md:w-1/2 btn-primary self-center"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm and complete
          </>
        )}
      </Button>
    </form>
  );
}
