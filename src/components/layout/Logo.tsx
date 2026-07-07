import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  // Asset type: 'logo-navbar' for navbar version, undefined for default
  asset?: 'logo-navbar';
}

// Keep both theme variants mounted so theme changes never wait on a new image request.
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

export function Logo({ className, variant = 'full', size = 'md', asset }: LogoProps) {
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
  const sources = LOGO_ASSETS[asset || 'default'];
  const imageClassName = "theme-logo-image pointer-events-none h-full max-h-full w-full max-w-full object-contain brightness-110";

  return (
    <div
      className={cn("relative flex shrink-0 items-center justify-center overflow-hidden select-none group", currentSize.box, className)}
      role="img"
      aria-label="Jawrah Pixel Logo"
    >
      <img
        src={sources.light}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className={cn(imageClassName, "opacity-100 dark:opacity-0")}
        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
      <img
        src={sources.dark}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className={cn(imageClassName, "absolute inset-0 opacity-0 dark:opacity-100")}
        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
