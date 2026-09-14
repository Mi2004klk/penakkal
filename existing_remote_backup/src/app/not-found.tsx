import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import GeometricPattern from "@/components/ui/GeometricPattern";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-page)]">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 relative overflow-hidden bg-[color:var(--color-surface-card)]">
        <GeometricPattern className="opacity-10 dark:opacity-5 text-[color:var(--color-moss)]" />
        
        <div className="text-center relative z-10 p-8 max-w-xl mx-auto">
          <h1 className="text-8xl md:text-9xl font-[family-name:var(--font-display)] font-bold text-[color:var(--color-heading)] mb-4 tracking-tighter">404</h1>
          <h2 className="editorial-headline mb-6 inline-block w-full wavy-underline text-[color:var(--color-moss)]">பக்கம் கிடைக்கவில்லை</h2>
          <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] mb-10 max-w-md mx-auto">
            நீங்கள் தேடும் பக்கம் இங்கு இல்லை அல்லது மாற்றப்பட்டிருக்கலாம்.
          </p>
          <Link 
            href="/"
            className="inline-block font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold px-8 py-4 bg-[color:var(--color-moss)] text-[color:var(--color-surface-pure-white-card)] rounded-[length:var(--radius-buttons)] transition-all hover:bg-[color:var(--color-primary-green-dark)] hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] focus-visible:ring-offset-2"
          >
            முகப்புக்குச் செல்ல
          </Link>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
