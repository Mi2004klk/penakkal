"use client";

import { useState, useEffect } from "react";
import { getHijriDate } from "@/lib/hijri";

export default function HijriDate({ className = "" }: { className?: string }) {
  const [dateStr, setDateStr] = useState<string | null>("");

  useEffect(() => {
    setDateStr(getHijriDate());
  }, []);

  if (dateStr === "") return <span className={`inline-block min-w-24 ${className}`}>...</span>;
  if (dateStr === null) return null;

  return (
    <span 
      className={className} 
      title="மதினி அட்டவணை அடிப்படையில்; உள்ளூர் நோக்குதல் அறிவிப்பு முந்தும்"
    >
      <span className="sr-only">தோராயமான ஹிஜ்ரி தேதி: </span>
      {dateStr}
    </span>
  );
}
