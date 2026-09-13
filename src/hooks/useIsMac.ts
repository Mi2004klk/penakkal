"use client";

import { useState, useEffect } from "react";

export function useIsMac() {
  const [isMac, setIsMac] = useState(true); // Default for SSR

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.userAgent.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  return isMac;
}
