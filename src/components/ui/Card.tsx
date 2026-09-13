import React from 'react';

type CardVariant = 'default' | 'transparent' | 'paper';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardRadius = 'none' | 'default';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  withShadow?: boolean;
}

export function Card({ 
  className = '', 
  variant = 'default', 
  padding = 'md', 
  radius = 'default',
  withShadow = false,
  children, 
  ...props 
}: CardProps) {
  const baseStyles = "relative overflow-hidden";
  
  const variants = {
    default: "bg-surface-card border border-border-default",
    transparent: "bg-transparent",
    paper: "bg-surface-pure-white-card border border-border-default",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const radii = {
    none: "rounded-none",
    default: "rounded-cards",
  };

  const shadow = withShadow ? "shadow-card" : "";

  const classes = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${radii[radius]} ${shadow} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
