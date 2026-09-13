import React from 'react';
import Overlay from './Overlay';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Modal({ isOpen, onClose, children, className = '', ...ariaProps }: ModalProps) {
  return (
    <Overlay 
      isOpen={isOpen} 
      onClose={onClose} 
      position="center" 
      className={`rounded-cards shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}
      {...ariaProps}
    >
      {children}
    </Overlay>
  );
}
