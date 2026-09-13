import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: 'default' | 'narrow' | 'wide';
}

export function Container({ 
  className = '', 
  as: Component = 'div',
  size = 'default',
  children, 
  ...props 
}: ContainerProps) {
  const baseStyles = "container mx-auto px-4 lg:px-8";
  
  const sizes = {
    default: "max-w-[var(--page-max-width)]",
    narrow: "max-w-3xl",
    wide: "max-w-7xl",
  };

  const classes = `${baseStyles} ${sizes[size]} ${className}`.trim();

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
