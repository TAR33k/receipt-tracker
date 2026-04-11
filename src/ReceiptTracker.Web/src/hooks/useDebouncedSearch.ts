import { useState, useEffect, useCallback } from "react";

interface UseDebouncedSearchResult {
  input: string;
  debounced: string;
  setInput: (value: string) => void;
  clear: () => void;
}

/**
 * Generic hook for debounced search input.
 * Returns the immediate input value and the debounced value.
 */
export function useDebouncedSearch(debounceMs = 300): UseDebouncedSearchResult {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(input);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [input, debounceMs]);

  const clear = useCallback(() => {
    setInput("");
    setDebounced("");
  }, []);

  return {
    input,
    debounced,
    setInput,
    clear,
  };
}
