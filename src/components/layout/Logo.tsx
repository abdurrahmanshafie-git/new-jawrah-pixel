import { cn } from '@/lib/utils';

// Note: The 'variant' prop is preserved for interface compatibility.
interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  // Asset type: 'logo-navbar' for navbar version, undefined for default
  asset?: 'logo-navbar';
}

const LOGO_ASSETS = {
  default: {
    light: '/assets/logo-white.png',
    dark: '/assets/logo.png',
  },
  'logo-navbar': {
    light: '/assets/logo-navbar-white.png',
    dark: '/assets/logo-navbar.png',
  },
} as const;

export function Logo({ className, size = 'md', asset }: LogoProps) {
  const sizeMap = {
    sm: { box: 'h-8 w-8' },
    md: { box: 'h-12 w-12' },
    lg: { box: 'h-24 w-24' },
    xl: { box: 'h-36 w-36' },
    '2xl': { box: 'h-48 w-48' },
    '3xl': { box: 'h-56 w-56' },
  };

  const currentSize = sizeMap[size];
  const sources = LOGO_ASSETS[asset || 'default'];
  const isNavbar = asset === 'logo-navbar';

  return (
    <div className={cn('theme-logo-wrapper relative shrink-0 select-none group', currentSize.box, className)}>
      {/* Light Theme Logo: Switched instantaneously by CSS class */}
      <img
        src={sources.light}
        alt="Jawrah Pixel Logo"
        loading={isNavbar ? 'eager' : 'lazy'}
        decoding="sync"
        width="560"
        height="112"
        className="theme-logo-light pointer-events-none h-full w-full object-contain brightness-105"
        referrerPolicy="no-referrer"
      />

      {/* Dark Theme Logo: Switched instantaneously by CSS class */}
      <img
        src={sources.dark}
        alt="Jawrah Pixel Logo"
        loading={isNavbar ? 'eager' : 'lazy'}
        decoding="sync"
        width="560"
        height="112"
        className="theme-logo-dark pointer-events-none h-full w-full object-contain brightness-110"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
