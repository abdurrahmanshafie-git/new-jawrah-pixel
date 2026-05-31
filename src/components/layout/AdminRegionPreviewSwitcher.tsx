import { useLocation, useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegion } from '@/hooks/useRegion';
import { REGION_OPTIONS } from '@/data/regions';
import { cn } from '@/lib/utils';
import { getExplicitRegionFromPathname, persistAdminRegion, regionPath } from '@/lib/region';
import type { RegionCode } from '@/types';

interface AdminRegionPreviewSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function AdminRegionPreviewSwitcher({ compact = false, className }: AdminRegionPreviewSwitcherProps) {
  const { profile } = useAuth();
  const { currentRegion } = useRegion();
  const location = useLocation();
  const navigate = useNavigate();

  if (profile?.role !== 'admin') return null;

  const handleRegionChange = (region: RegionCode) => {
    persistAdminRegion(region);

    if (getExplicitRegionFromPathname(location.pathname)) {
      navigate(`${regionPath(region, location.pathname)}${location.search}${location.hash}`);
    }
  };

  return (
    <div
      className={cn(
        'flex shrink-0 items-center',
        compact ? 'flex-col items-end gap-1' : 'gap-2',
        className,
      )}
    >
      <span
        className={cn(
          'whitespace-nowrap font-mono font-bold uppercase leading-none text-brand-cyan/60',
          compact ? 'text-[7px] tracking-[0.1em]' : 'text-[9px] tracking-[0.18em]',
        )}
      >
        Admin Region Preview
      </span>
      <div
        className={cn(
          'flex items-center border border-brand-cyan/20 bg-brand-cyan/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl',
          compact ? 'h-8 gap-0.5 rounded-full px-1' : 'gap-1 rounded-xl p-1.5',
        )}
        role="group"
        aria-label="Admin Region Preview"
      >
        <Globe className={cn('h-3.5 w-3.5 text-brand-cyan/70', compact && 'sr-only')} />
        {REGION_OPTIONS.map((region) => {
          const isActive = currentRegion === region.id;

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => handleRegionChange(region.id)}
              className={cn(
                'rounded-full text-center font-mono font-bold uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40',
                compact
                  ? 'grid h-6 min-w-6 place-items-center px-1.5 text-[9px] tracking-[0.08em]'
                  : 'min-w-[40px] px-2.5 py-1.5 text-[10px] tracking-[0.14em]',
                isActive
                  ? 'bg-white/10 text-brand-cyan ring-1 ring-brand-cyan/25'
                  : 'text-zinc-400 hover:bg-white/10 hover:text-white',
              )}
              aria-pressed={isActive}
              aria-label={`Preview ${region.label}`}
              title={region.label}
            >
              {region.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
