import { useState } from "react";

const STORAGE_KEY = "receipt_tracker_user_id";

export function useUserId() {
  const [userId, setUserIdState] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  );

  function saveUserId(id: string) {
    const trimmed = id.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setUserIdState(trimmed);
    window.location.reload();
  }

  function clearUserId() {
    localStorage.removeItem(STORAGE_KEY);
    setUserIdState(null);
    window.location.reload();
  }

  return { userId, saveUserId, clearUserId };
}
