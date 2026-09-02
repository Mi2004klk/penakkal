"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import GeometricPattern from "@/components/ui/GeometricPattern";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-page)]">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 relative overflow-hidden bg-[color:var(--color-surface-card)]">
        <GeometricPattern className="opacity-10 dark:opacity-5 text-[color:var(--color-ember-coral)]" />
        
        <div className="text-center relative z-10 p-8 max-w-xl mx-auto">
          <h1 className="text-8xl md:text-9xl font-[family-name:var(--font-display)] font-bold text-[color:var(--color-heading)] mb-4 tracking-tighter">500</h1>
          <h2 className="editorial-headline mb-6 inline-block w-full wavy-underline text-[color:var(--color-ember-coral)]">ஏதோ தவறு நடந்துவிட்டது</h2>
          <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] mb-10 max-w-md mx-auto">
            மன்னிக்கவும், எதிர்பாராத பிழை ஏற்பட்டுள்ளது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => reset()}
              className="inline-block font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold px-8 py-4 bg-[color:var(--color-ember-coral)] text-[color:var(--color-surface-pure-white-card)] rounded-[length:var(--radius-buttons)] transition-all hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ember-coral)] focus-visible:ring-offset-2"
            >
              மீண்டும் முயற்சிக்க
            </button>
            <Link 
              href="/"
              className="inline-block font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold px-8 py-4 bg-[color:var(--color-surface-page)] text-[color:var(--color-heading)] border border-[color:var(--color-border-default)] rounded-[length:var(--radius-buttons)] transition-all hover:bg-[color:var(--color-surface-cream-paper)] dark:hover:bg-[color:var(--color-slate)] hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
            >
              முகப்புக்குச் செல்ல
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
