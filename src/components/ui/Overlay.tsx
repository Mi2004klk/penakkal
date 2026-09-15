"use client";

import { useEffect, useRef } from "react";
import { SPRING } from "@/lib/motion";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type OverlayPosition = 'center' | 'left' | 'right' | 'bottom';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  position?: OverlayPosition;
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export default function Overlay({ 
  isOpen, 
  onClose, 
  position = 'center', 
  children, 
  className = "",
  id,
  ...ariaProps
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const overlayId = Math.random().toString(36).substring(7);
      const close = () => onCloseRef.current();

      // Scroll Lock & Scrollbar Compensation
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // History state integration
      window.history.pushState({ overlay: overlayId }, '');

      const handlePopState = (e: PopStateEvent) => {
        if (e.state?.overlay !== overlayId) {
          close();
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;

        window.removeEventListener('popstate', handlePopState);

        // Use requestAnimationFrame to avoid racing with router.push
        requestAnimationFrame(() => {
          if (window.history.state?.overlay === overlayId) {
            window.history.back();
          }
        });

        // Focus Restore
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  useFocusTrap(overlayRef, isOpen, onClose);

  if (typeof document === 'undefined') return null;

  const getAnimationConfig = () => {
    switch (position) {
      case 'left':
        return { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } };
      case 'right':
        return { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };
      case 'bottom':
        return { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };
      case 'center':
      default:
        return { initial: { opacity: 0, scale: 0.95, y: -20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 } };
    }
  };

  const getContainerClass = () => {
    switch (position) {
      case 'left': return "fixed inset-y-0 left-0 h-full z-10 flex";
      case 'right': return "fixed inset-y-0 right-0 h-full z-10 flex";
      case 'bottom': return "fixed bottom-0 left-0 w-full z-10 flex";
      case 'center':
      default: return "relative z-10 w-full flex items-center justify-center pointer-events-none p-4 mt-20 sm:mt-0"; // mt-20 for top positioning like search modal
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal flex items-start sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-overlay backdrop-blur-sm pointer-events-auto"
            aria-hidden="true"
          />
          
          {/* Content Container */}
          <div className={getContainerClass()}>
            <motion.div
              ref={overlayRef}
              id={id}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING}
              className={`bg-surface-pure-white-card pointer-events-auto overflow-hidden outline-none ${className}`}
              {...ariaProps}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
