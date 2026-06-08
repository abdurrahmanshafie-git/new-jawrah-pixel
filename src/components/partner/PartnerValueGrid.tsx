import {
  BadgeDollarSign,
  Code2,
  Headphones,
  LineChart,
  Repeat2,
  ShieldCheck,
} from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { partnerValueItems } from '@/data/partnerDefaults';

const iconMap = {
  commission: BadgeDollarSign,
  noCode: Code2,
  delivery: ShieldCheck,
  tracking: LineChart,
  repeat: Repeat2,
  services: Headphones,
};

export function PartnerValueGrid() {
  return (
    <section id="partner-value" className="scroll-mt-28 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <Reveal className="max-w-3xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
            Partner Value
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
            What partners get from the network
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-500 md:text-lg">
            Jawrah Pixel gives partners a serious delivery engine to stand behind. You bring qualified
            relationships; we turn those opportunities into premium digital systems.
          </p>
        </Reveal>

        <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partnerValueItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <StaggerItem
                key={item.title}
                className="group rounded-lg border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-brand-cyan/35 hover:bg-white/[0.055]"
              >
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-md border border-brand-cyan/25 bg-brand-cyan/10 text-brand-cyan">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-semibold uppercase tracking-normal text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500 group-hover:text-zinc-400">
                  {item.description}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
