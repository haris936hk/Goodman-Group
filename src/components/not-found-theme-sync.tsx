"use client";

import { useEffect, useLayoutEffect } from "react";
import { syncDocumentTheme } from "@/lib/site-theme";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function NotFoundThemeSync(): null {
  useIsomorphicLayoutEffect(() => {
    syncDocumentTheme();
  }, []);

  return null;
}
