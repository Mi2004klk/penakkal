import Link from "next/link";
import { Button } from "@/components/ui/Button";
import GeometricPattern from "@/components/ui/GeometricPattern";
import BrandMark from "@/components/ui/BrandMark";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-page">
      <header className="p-6 border-b border-border-default flex justify-center">
        <BrandMark variant="header" />
      </header>
      
      <main id="main-content" tabIndex={-1} className="flex-grow flex items-center justify-center py-20 relative overflow-hidden bg-surface-card focus:outline-none">
        <GeometricPattern className="opacity-10 text-text-link" />
        
        <div className="text-center relative z-10 p-8 max-w-xl mx-auto">
          <span aria-hidden="true" className="editorial-headline mb-4 text-heading block">404</span>
          <h1 className="editorial-headline mb-6 w-fit mx-auto wavy-underline text-text-link">பக்கம் கிடைக்கவில்லை</h1>
          <p className="font-body text-body text-body-text mb-10 max-w-md mx-auto">
            நீங்கள் தேடும் பக்கம் இங்கு இல்லை அல்லது மாற்றப்பட்டிருக்கலாம்.
          </p>
          <Button href="/" size="lg">
            முகப்புப் பக்கத்திற்குச் செல்லவும்
          </Button>
        </div>
      </main>
    </div>
  );
}
