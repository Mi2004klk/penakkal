"use client";

import { Share2, Link as LinkIcon, Printer, Check } from "lucide-react";
import { useState } from "react";

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://penakkal.com${url}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: fullUrl,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold text-[color:var(--color-body-text)] mr-2">பகிரவும்:</span>
      
      {/* Native Share (Mobile) */}
      <button 
        onClick={handleShare}
        className="md:hidden w-10 h-10 flex items-center justify-center bg-[color:var(--color-moss)]/10 text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] rounded-full hover:bg-[color:var(--color-moss)]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        title="பகிரவும்"
        aria-label="பகிரவும்"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Copy Link */}
      <button 
        onClick={copyToClipboard}
        className="w-10 h-10 flex items-center justify-center text-[color:var(--color-heading)] bg-[color:var(--color-surface-page)] hover:bg-[color:var(--color-border-default)] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        title="இணைப்பை நகலெடுக்கவும்"
        aria-label="இணைப்பை நகலெடுக்கவும்"
      >
        {copied ? <Check className="w-5 h-5 text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]" /> : <LinkIcon className="w-5 h-5" />}
      </button>

      {/* WhatsApp */}
      <a 
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex w-10 h-10 items-center justify-center bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        title="வாட்ஸ்அப்பில் பகிரவும்"
        aria-label="வாட்ஸ்அப்பில் பகிரவும்"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      </a>

      {/* Facebook */}
      <button 
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank')}
        className="w-10 h-10 flex items-center justify-center text-[#1877F2] bg-[#1877F2]/10 dark:bg-[#1877F2]/20 hover:bg-[#1877F2]/20 dark:hover:bg-[#1877F2]/30 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        title="பேஸ்புக்கில் பகிரவும்"
        aria-label="பேஸ்புக்கில் பகிரவும்"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-1.127 0-2.515.244-2.515 2.404v1.57h3.645l-.475 3.667h-3.17v7.98h-4.566Z"/></svg>
      </button>

      {/* X (Twitter) */}
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex w-10 h-10 items-center justify-center bg-black/5 dark:bg-white/10 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        title="எக்ஸ் தளத்தில் பகிரவும்"
        aria-label="எக்ஸ் தளத்தில் பகிரவும்"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>

      {/* Print */}
      <button 
        onClick={() => window.print()}
        className="hidden md:flex w-10 h-10 items-center justify-center bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] text-[color:var(--color-muted-text)] hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        title="அச்சிடவும்"
        aria-label="அச்சிடவும்"
      >
        <Printer className="w-5 h-5" />
      </button>
    </div>
  );
}
