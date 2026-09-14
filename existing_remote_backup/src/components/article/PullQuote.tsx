import React from 'react';

interface PullQuoteProps {
  children: React.ReactNode;
  citation?: string;
}

export default function PullQuote({ children, citation }: PullQuoteProps) {
  return (
    <div className="relative my-10 px-8 py-6 text-center">
      <div className="absolute top-0 left-0 text-[color:var(--color-moss)] opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C20 11.0457 11.0457 20 0 20C11.0457 20 20 28.9543 20 40C20 28.9543 28.9543 20 40 20C28.9543 20 20 11.0457 20 0Z" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="absolute bottom-0 right-0 text-[color:var(--color-moss)] opacity-20 rotate-180">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C20 11.0457 11.0457 20 0 20C11.0457 20 20 28.9543 20 40C20 28.9543 28.9543 20 40 20C28.9543 20 20 11.0457 20 0Z" fill="currentColor"/>
        </svg>
      </div>

      <blockquote className="relative z-10 m-0 border-0 bg-transparent p-0 before:content-none after:content-none">
        <p className="font-[family-name:var(--font-display)] text-[length:var(--text-heading-sm)] font-bold italic leading-snug text-[color:var(--color-heading)]">
          {children}
        </p>
        {citation && (
          <footer className="mt-4 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] uppercase tracking-wider text-[color:var(--color-muted-text)]">
            — {citation}
          </footer>
        )}
      </blockquote>
    </div>
  );
}
