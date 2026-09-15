"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DirtyStateGuard({ isDirty, message = "You have unsaved changes. Are you sure you want to leave?" }: { isDirty: boolean; message?: string }) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, message]);

  // Next.js app router doesn't natively support intercepting client-side navigation yet
  // This is a known limitation of App Router compared to Pages Router.
  // We can only reliably intercept window reloads and tab closes via beforeunload.

  return null;
}
