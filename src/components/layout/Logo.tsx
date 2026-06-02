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
    sm: { box: 'h-8 w-8' },
    md: { box: 'h-12 w-12' },
    lg: { box: 'h-24 w-24' },
    xl: { box: 'h-48 w-48' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden select-none group", currentSize.box, className)}>
      <img 
        src="/assets/logo.png" 
        alt="Jawrah Pixel Logo" 
        className="h-full max-h-full w-full max-w-full object-contain brightness-110"
        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
