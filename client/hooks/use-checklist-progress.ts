import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "stardew-checklist-progress";

function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useChecklistProgress() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    loadProgress(),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const setMany = useCallback((ids: string[], value: boolean) => {
    setChecked((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = value;
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChecked({});
  }, []);

  return { checked, toggle, setMany, reset };
}
