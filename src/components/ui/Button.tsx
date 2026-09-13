import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'alert';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'alert';
  size?: ButtonSize;
  href?: string;
}

export function buttonStyles({ variant = 'primary', size = 'md' }: { variant?: ButtonVariant; size?: ButtonSize }) {
  const baseStyles = "inline-flex items-center justify-center font-ui font-normal rounded-buttons transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-moss text-pure-white hover:brightness-105 focus-visible:ring-moss  ",
    secondary: "bg-surface-page text-heading border border-border-default hover:bg-surface-cream-paper hover:border-moss focus-visible:ring-moss ",
    ghost: "bg-transparent text-heading border-[1.5px] border-heading hover:bg-heading hover:text-pure-white focus-visible:ring-moss   ",
    alert: "bg-ember-coral text-true-black hover:brightness-105 focus-visible:ring-ember-coral",
  };

  const sizes = {
    sm: "px-4 py-2 text-body-sm",
    md: "px-6 py-3 text-body font-bold",
    lg: "px-8 py-4 text-body font-bold",
  };

  return `${baseStyles} ${variants[variant]} ${sizes[size]}`;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', href, ...props }, ref) => {
    const classes = `${buttonStyles({ variant, size })} ${className}`.trim();
    
    if (href) {
      return (
        <Link href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {props.children}
        </Link>
      );
    }
    
    return (
      <button ref={ref} className={classes} {...props} />
    );
  }
);

Button.displayName = "Button";
