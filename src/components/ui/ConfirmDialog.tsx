"use client";

import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-card/80 backdrop-blur-sm animate-fade-in">
      <div 
        ref={dialogRef}
        role="alertdialog" 
        aria-modal="true" 
        className="bg-surface-page border border-border-default shadow-elevated rounded-cards w-full max-w-md overflow-hidden animate-slide-up"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="flex-shrink-0 p-2 bg-semantic-error/10 text-semantic-error rounded-full">
                <AlertCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-display font-bold text-heading mb-2">{title}</h2>
              <p className="text-muted-text font-ui text-body-sm">{description}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-card border-t border-border-default p-4 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 font-ui font-bold text-body-sm text-heading hover:bg-surface-page rounded-buttons transition-colors"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 font-ui font-bold text-body-sm text-pure-white rounded-buttons transition-colors ${
              isDestructive ? 'bg-semantic-error hover:bg-semantic-error/90' : 'bg-moss hover:bg-moss/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
