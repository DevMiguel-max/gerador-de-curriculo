"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/lib/store/resumeStore";

export function useResumeHydration() {
  const hasHydrated = useResumeStore((s) => s.hasHydrated);

  useEffect(() => {
    useResumeStore.persist.rehydrate();
  }, []);

  return hasHydrated;
}
