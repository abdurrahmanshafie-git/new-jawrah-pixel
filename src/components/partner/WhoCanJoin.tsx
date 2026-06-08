import { BriefcaseBusiness, Megaphone, Network, Sparkles } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { partnerAudience } from '@/data/partnerAudience';

const iconMap = {
  consultant: BriefcaseBusiness,
  marketing: Megaphone,
  connector: Network,
  ambitious: Sparkles,
};

export function WhoCanJoin() {
  return (
    <section id="who-can-join" className="scroll-mt-28 py-20 md:py-28">
      <div className="container mx-auto px-6">
        <Reveal className="max-w-3xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-cyan">
            Who Can Join
          </span>
          <h2 className="mt-5 text-3xl font-display font-semibold uppercase leading-tight tracking-normal text-white md:text-5xl">
            Built for people with trusted business access
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-500">
            You do not need to be technical. You need good judgment, ethical introductions, and access to
            businesses that care about high-quality digital execution.
          </p>
        </Reveal>

        <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {partnerAudience.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <StaggerItem
                key={item.title}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-brand-cyan/30 hover:bg-white/[0.055]"
              >
                <Icon className="mb-8 h-7 w-7 text-brand-cyan" />
                <h3 className="text-lg font-display font-semibold uppercase tracking-normal text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500">{item.description}</p>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
