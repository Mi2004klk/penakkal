"use client";

import { useState, useEffect } from "react";
import { getHijriDate } from "@/lib/hijri";

export default function HijriDate({ className = "" }: { className?: string }) {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(getHijriDate());
  }, []);

  if (!dateStr) return <span className={`inline-block min-w-24 ${className}`}>...</span>;

  return <span className={className}>{dateStr}</span>;
}
