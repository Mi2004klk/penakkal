"use client";

import { Share2, Link as LinkIcon, Printer, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import WhatsAppIcon from "../icons/WhatsAppIcon";
import FacebookIcon from "../icons/FacebookIcon";
import XIcon from "../icons/XIcon";

export default function ShareBar({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getFullUrl = () => {
    return typeof window !== 'undefined' ? `${window.location.origin}${path}` : `https://penakkal.com${path}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: getFullUrl(),
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    }
  };

  const copyToClipboard = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const url = getFullUrl();
    let success = false;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        success = true;
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement("textarea");
        textArea.value = url;
        // Make it invisible
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Copy failed:", err);
      success = false;
    }

    if (success) {
      setCopied(true);
      setCopyStatus("இணைப்பு நகலெடுக்கப்பட்டது");
      timerRef.current = setTimeout(() => {
        setCopied(false);
        setCopyStatus("");
      }, 2000);
    } else {
      setCopied(false);
      setCopyStatus("நகலெடுக்க முடியவில்லை");
      timerRef.current = setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Accessibility announcement for clipboard */}
      <div aria-live="polite" className="sr-only">
        {copyStatus}
      </div>
      
      <span className="font-ui text-body-sm font-bold text-body-text mr-2">பகிரவும்:</span>
      
      {/* Native Share (Mobile/Tablet) */}
      <button 
        onClick={handleShare}
        className="xl:hidden touch-target w-10 h-10 flex items-center justify-center bg-moss text-pure-white rounded-full hover:bg-moss/90 transition-colors"
        title="பகிரவும்"
        aria-label="பகிரவும்"
      >
        <Share2 className="w-5 h-5" aria-hidden="true" focusable="false" />
      </button>

      {/* Copy Link */}
      <button 
        onClick={copyToClipboard}
        className="touch-target w-10 h-10 flex items-center justify-center text-heading bg-surface-page hover:bg-border-default rounded-full transition-colors"
        title="இணைப்பை நகலெடுக்கவும்"
        aria-label="இணைப்பை நகலெடுக்கவும்"
      >
        {copied ? <Check className="w-5 h-5 text-text-link" aria-hidden="true" focusable="false" /> : <LinkIcon className="w-5 h-5" aria-hidden="true" focusable="false" />}
      </button>

      {/* WhatsApp */}
      <button 
        onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + getFullUrl())}`, '_blank', 'noopener,noreferrer')}
        className="hidden xl:flex touch-target w-10 h-10 items-center justify-center bg-[#25D366] text-[#075E54] hover:bg-[#128C7E] hover:text-pure-white rounded-full transition-colors shadow-card"
        title="வாட்ஸ்அப்பில் பகிரவும்"
        aria-label="வாட்ஸ்அப்பில் பகிரவும்"
      >
        <WhatsAppIcon className="w-5 h-5" />
      </button>

      {/* Facebook */}
      <button 
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getFullUrl())}`, '_blank', 'noopener,noreferrer')}
        className="hidden xl:flex touch-target w-10 h-10 items-center justify-center bg-[#1877F2] text-pure-white hover:bg-[#0c59c2] rounded-full transition-colors shadow-card"
        title="பேஸ்புக்கில் பகிரவும்"
        aria-label="பேஸ்புக்கில் பகிரவும்"
      >
        <FacebookIcon className="w-5 h-5" />
      </button>

      {/* X (Twitter) */}
      <button 
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getFullUrl())}`, '_blank', 'noopener,noreferrer')}
        className="hidden xl:flex touch-target w-10 h-10 items-center justify-center bg-true-black text-pure-white hover:opacity-80 rounded-full transition-opacity"
        title="எக்ஸ் தளத்தில் பகிரவும்"
        aria-label="எக்ஸ் தளத்தில் பகிரவும்"
      >
        <XIcon className="w-4 h-4" />
      </button>

      {/* Print */}
      <button
        onClick={() => window.print()}
        className="hidden xl:flex touch-target w-10 h-10 items-center justify-center bg-surface-card border border-border-default text-muted-text hover:text-text-link hover:border-moss rounded-full transition-colors"
        title="அச்சிடவும்"
        aria-label="அச்சிடவும்"
      >
        <Printer className="w-5 h-5" aria-hidden="true" focusable="false" />
      </button>
    </div>
  );
}
