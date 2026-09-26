import { cn } from '@/lib/utils';

// Note: The 'variant' prop is preserved for interface compatibility.
interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  // Asset type: 'logo-navbar' for navbar version, undefined for default
  asset?: 'logo-navbar';
  forceTheme?: 'light' | 'dark';
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

export function Logo({ className, size = 'md', asset, forceTheme }: LogoProps) {
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
  const boxClass = isNavbar ? 'h-8 sm:h-9 md:h-10 w-32 sm:w-36 md:w-40 flex items-center' : currentSize.box;

  if (forceTheme === 'dark') {
    return (
      <div className={cn('relative shrink-0 select-none group', boxClass, className)}>
        <img
          src={sources.dark}
          alt="Jawrah Pixel Logo"
          loading="eager"
          decoding="sync"
          width="560"
          height="112"
          className="pointer-events-none h-full w-auto max-w-full object-contain brightness-110"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (forceTheme === 'light') {
    return (
      <div className={cn('relative shrink-0 select-none group', boxClass, className)}>
        <img
          src={sources.light}
          alt="Jawrah Pixel Logo"
          loading="eager"
          decoding="sync"
          width="560"
          height="112"
          className="pointer-events-none h-full w-auto max-w-full object-contain brightness-105"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={cn('theme-logo-wrapper relative shrink-0 select-none group', boxClass, className)}>
      {/* Light Theme Logo: Switched instantaneously by CSS class */}
      <img
        src={sources.light}
        alt="Jawrah Pixel Logo"
        loading={isNavbar ? 'eager' : 'lazy'}
        decoding="sync"
        width="560"
        height="112"
        className="theme-logo-light pointer-events-none h-full w-auto max-w-full object-contain brightness-105"
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
        className="theme-logo-dark pointer-events-none h-full w-auto max-w-full object-contain brightness-110"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
