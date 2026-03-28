import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  date: string;
}

const CACHE_DURATION_MS = 60 * 60 * 1000;

async function fetchExchangeRates(
  baseCurrency: string,
): Promise<ExchangeRates> {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await response.json();

  return {
    base: data.base,
    rates: data.rates,
    date: data.date,
  };
}

export function useExchangeRates(targetCurrency: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["exchange-rates", targetCurrency],
    queryFn: () => fetchExchangeRates(targetCurrency),
    staleTime: CACHE_DURATION_MS,
    gcTime: CACHE_DURATION_MS,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const convert = useCallback(
    (amount: number, fromCurrency: string): number => {
      if (!data) return amount;
      if (fromCurrency === targetCurrency) return amount;

      const fromRate = data.rates[fromCurrency];
      const toRate = data.rates[targetCurrency];

      if (!fromRate || !toRate) {
        console.warn(
          `Exchange rate not available for ${fromCurrency} or ${targetCurrency}`,
        );
        return amount;
      }

      return amount * (toRate / fromRate);
    },
    [data, targetCurrency],
  );

  return {
    rates: data?.rates,
    isLoading,
    error,
    convert,
    refetch,
  };
}

const CURRENCY_PREF_KEY = "receipt-tracker-preferred-currency";

function getInitialCurrency(availableCurrencies: string[]): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CURRENCY_PREF_KEY);
  if (stored && availableCurrencies.includes(stored)) {
    return stored;
  }
  return availableCurrencies[0] ?? null;
}

export function useCurrencyPreference(availableCurrencies: string[]) {
  const [preferredCurrency, setPreferredCurrency] = useState<string | null>(
    () => getInitialCurrency(availableCurrencies),
  );

  const setCurrency = useCallback((currency: string) => {
    setPreferredCurrency(currency);
    localStorage.setItem(CURRENCY_PREF_KEY, currency);
  }, []);

  const activeCurrency =
    preferredCurrency && availableCurrencies.includes(preferredCurrency)
      ? preferredCurrency
      : availableCurrencies[0];

  return {
    preferredCurrency: activeCurrency,
    setCurrency,
    isReady: availableCurrencies.length > 0,
  };
}
