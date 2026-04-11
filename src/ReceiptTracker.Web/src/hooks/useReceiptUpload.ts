import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadReceipt } from "@/api/receipts";

interface UseReceiptUploadResult {
  upload: (file: File) => void;
  isUploading: boolean;
}

/**
 * Hook to handle receipt upload with automatic navigation and cache refresh.
 */
export function useReceiptUpload(): UseReceiptUploadResult {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
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

  const upload = useCallback(
    (file: File) => {
      mutation.mutate(file);
    },
    [mutation]
  );

  return {
    upload,
    isUploading: mutation.isPending,
  };
}
