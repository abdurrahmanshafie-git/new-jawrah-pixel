import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// Note: The 'variant' prop is currently unused in the component logic.
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

export function Logo({ className, variant = 'full', size = 'md', asset }: LogoProps) {
  const { theme } = useTheme();
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
    <div className={cn('shrink-0 select-none group', currentSize.box, className)}>
      <img
        src={sources[theme]}
        alt="Jawrah Pixel Logo"
        // The navbar logo is critical for LCP, so it should be loaded eagerly.
        // Other logos (e.g., in the footer) will use the browser's default loading (lazy).
        loading={isNavbar ? 'eager' : 'lazy'}
        decoding="async"
        // Set explicit dimensions to prevent layout shift.
        // The actual display size is controlled by the parent's class.
        width="560"
        height="112"
        className="pointer-events-none h-full w-full object-contain brightness-110"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
