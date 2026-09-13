import React from 'react';
import Link from 'next/link';

type BadgeVariant = 'solid' | 'outline' | 'subtle';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  href?: string;
}

export function Badge({ 
  className = '', 
  variant = 'solid', 
  size = 'sm', 
  href,
  children, 
  ...props 
}: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-ui font-bold transition-colors";
  
  const variants = {
    solid: "bg-moss text-pure-white shadow-dropdown rounded-full hover:brightness-105  ",
    outline: "bg-surface-card border border-border-default text-heading shadow-sm hover:border-moss hover:text-text-link rounded-chips ",
    subtle: "bg-surface-page text-muted-text rounded-chips hover:bg-border-default",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-body-sm",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
