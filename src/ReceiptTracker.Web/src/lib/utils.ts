import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { dark } from "@clerk/themes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DateFormatStyle = "short" | "medium" | "long" | "full" | "input" | "month";

export function formatDate(
  dateString: string | null | undefined,
  style: DateFormatStyle = "short"
): string {
  if (!dateString) return "—";
  dateString = dateString.endsWith("Z") ? dateString : dateString + "Z";

  const date = new Date(dateString);

  switch (style) {
    case "input":
      return dateString.split("T")[0];

    case "short":
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    case "medium":
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    case "long":
      return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    case "full":
      return date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    case "month":
      return date.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });

    default:
      return date.toLocaleDateString("en-GB");
  }
}

export function formatDateTime(dateString: string): string {
  return formatDate(dateString, "full");
}

export function formatDateForInput(dateString: string | null | undefined): string {
  return formatDate(dateString, "input");
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateString, "short");
}

export const DEFAULT_CURRENCY = "BAM";

export function formatAmount(
  amount: number | null | undefined,
  currency?: string | null,
  options?: Intl.NumberFormatOptions
): string {
  if (amount === null || amount === undefined) return "—";

  const currencyCode = currency || DEFAULT_CURRENCY;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

export function formatAmountSimple(
  amount: number | null | undefined,
  currency?: string | null
): string {
  if (amount === null || amount === undefined) return "—";

  const currencyCode = currency || DEFAULT_CURRENCY;
  return `${amount.toFixed(2)} ${currencyCode}`.trim();
}

export function formatAmountCompact(amount: number, currency?: string): string {
  const currencyCode = currency || DEFAULT_CURRENCY;

  if (amount >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }

  return formatAmount(amount, currencyCode);
}

export function normalizeMerchantName(name: string | null | undefined): string {
  if (!name) return "";

  let normalizedName = name
    .replace(/["'”’‘“]/g, "")
    .replace(/[\s\-_]+/g, " ")
    .trim()
    .toLowerCase();

  const suffixPattern =
    /(?:j[.,]\s*)?(?:d|cl|1|&|ol|c)?[.,]\s*[o0c][.,]\s*[o0c][.,]?|\b(?:doo|d00|jdoo|sro|dno|dd|ad|md|pj|sp|vl)\b|\bd\s*o\s*o\b|\b(?:d[.,]\s*d|a[.,]\s*d|j[.,]\s*d|s[.,]\s*p|p[.,]\s*j|v[.,]\s*l)[.,]?|\bs[.,]\s*r[.,]\s*o[.,]?|\bspol\s*s\s*r[.,]\s*o[.,]?|o\.o\./g;

  const match = suffixPattern.exec(normalizedName);

  if (match) {
    if (match.index === 0) {
      normalizedName = normalizedName.replace(suffixPattern, "");
    } else {
      normalizedName = normalizedName.substring(0, match.index);
    }
  }

  return normalizedName.replace(/[,.\-\s]+$/, "").trim();
}

export function formatMerchantName(name: string | null | undefined): string {
  if (!name) return "Unknown";

  const normalized = normalizeMerchantName(name);

  if (!normalized) return "Unknown";

  const acronyms = new Set([
    "d.o.o.",
    "a.d.",
    "d.d.",
    "s.r.o.",
    "spol.",
    "s.r.o",
    "j.d.o.o.",
    "d.n.o.",
    "o.o.",
    "p.j.",
    "pj",
    "md",
    "doo",
    "sp",
    "s.p.",
  ]);

  return normalized
    .split(" ")
    .map((word) => {
      if (acronyms.has(word)) {
        return word;
      }
      return word.toUpperCase();
    })
    .join(" ");
}

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#5E6AD2",
    colorBackground: "#0a0a0c",
    colorInputBackground: "rgba(255, 255, 255, 0.05)",
    colorInputText: "#EDEDEF",
    colorText: "#EDEDEF",
    colorTextSecondary: "#8A8F98",
    colorNeutral: "#8A8F98",
    borderRadius: "0.75rem",
    fontFamily: '"Inter", "Geist Sans", system-ui, sans-serif',
  },
  elements: {
    card: "shadow-none bg-transparent",
    rootBox: "w-full flex justify-center",
  },
} as const;
