import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Spinner = ({ 
  size = "md", 
  className = "", 
  variant = "default",
  ...props 
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40
  };

  const variants = {
    default: "text-current",
    primary: "text-orange-600",
    white: "text-white",
    muted: "text-muted-foreground"
  };

  // Handle both string size variants and numeric sizes
  const spinnerSize = typeof size === 'string' ? sizeMap[size] || sizeMap.md : size;

  return (
    <Loader2 
      size={spinnerSize} 
      className={cn("animate-spin", variants[variant], className)}
      {...props}
    />
  );
};

export { Spinner };
