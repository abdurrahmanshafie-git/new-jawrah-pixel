import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  // Asset type: 'logo-navbar' for navbar version, undefined for default
  asset?: 'logo-navbar';
}

// Explicit mapping: theme + asset → image path
const LOGO_MAP = {
  dark: {
    default: '/assets/logo.png',
    'logo-navbar': '/assets/logo-navbar.png',
  },
  light: {
    default: '/assets/logo-white.png',
    'logo-navbar': '/assets/logo-navbar-white.png',
  },
} as const;

export function Logo({ className, variant = 'full', size = 'md', asset }: LogoProps) {
  const { theme } = useTheme();
  
  // Determine the correct logo path based on theme and asset
  const getLogoPath = (currentTheme: 'dark' | 'light', assetType?: 'logo-navbar') => {
    const assetKey = assetType || 'default';
    return LOGO_MAP[currentTheme]?.[assetKey] || LOGO_MAP[currentTheme].default;
  };

  const [src, setSrc] = React.useState(() => getLogoPath(theme, asset));

  // Update src when theme or asset changes
  React.useEffect(() => {
    setSrc(getLogoPath(theme, asset));
  }, [theme, asset]);

  const handleError = () => {
    // Fallback to default logo
    const fallback = LOGO_MAP[theme].default;
    if (src !== fallback) setSrc(fallback);
  };

  // Dimensions map
  const sizeMap = {
    sm: { box: 'h-8 w-8' },
    md: { box: 'h-12 w-12' },
    lg: { box: 'h-24 w-24' },
    xl: { box: 'h-36 w-36' },
    '2xl': { box: 'h-48 w-48' },
    '3xl': { box: 'h-56 w-56' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden select-none group", currentSize.box, className)}>
      <img 
        src={src} 
        alt="Jawrah Pixel Logo" 
        className="h-full max-h-full w-full max-w-full object-contain brightness-110"
        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        onError={handleError}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
