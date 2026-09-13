import React from 'react';
import Overlay from './Overlay';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Drawer({ isOpen, onClose, position = 'right', children, className = '', id, ...ariaProps }: DrawerProps) {
  return (
    <Overlay 
      isOpen={isOpen} 
      onClose={onClose} 
      position={position} 
      className={`h-full overflow-y-auto shadow-modal ${className}`}
      id={id}
      {...ariaProps}
    >
      {children}
    </Overlay>
  );
}
