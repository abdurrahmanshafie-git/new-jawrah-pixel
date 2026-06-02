import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className, variant = 'full', size = 'md' }: LogoProps) {
  // Dimensions map
  const sizeMap = {
    sm: { box: 'h-8', img: 'h-8 w-auto' },
    md: { box: 'h-12', img: 'h-12 w-auto' },
    lg: { box: 'h-24', img: 'h-24 w-auto' },
    xl: { box: 'h-48', img: 'h-48 w-auto' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex items-center justify-center select-none group", currentSize.box, className)}>
      <img 
        src="/assets/logo.png" 
        alt="Jawrah Pixel Logo" 
        className={cn(currentSize.img, "object-contain brightness-110")}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
