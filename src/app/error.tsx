"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import GeometricPattern from "@/components/ui/GeometricPattern";
import BrandMark from "@/components/ui/BrandMark";

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
    <div className="min-h-screen flex flex-col bg-surface-page">
      <header className="p-6 border-b border-border-default flex justify-center">
        <BrandMark variant="header" />
      </header>
      
      <main id="main-content" tabIndex={-1} className="flex-grow flex items-center justify-center py-20 relative overflow-hidden bg-surface-card focus:outline-none">
        <GeometricPattern className="opacity-10 text-error" />
        
        <div className="text-center relative z-10 p-8 max-w-xl mx-auto">
          <span aria-hidden="true" className="editorial-headline mb-4 text-heading block">500</span>
          <h1 className="editorial-headline mb-6 w-fit mx-auto wavy-underline text-error">ஏதோ தவறு நடந்துவிட்டது</h1>
          <p className="font-body text-body text-body-text mb-10 max-w-md mx-auto">
            மன்னிக்கவும், எதிர்பாராத பிழை ஏற்பட்டுள்ளது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => reset()}
              variant="alert"
              size="lg"
            >
              மீண்டும் முயற்சிக்கவும்
            </Button>
            <Button 
              href="/"
              variant="secondary"
              size="lg"
            >
              முகப்புப் பக்கம்
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
