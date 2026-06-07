import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { Button } from '@/components/ui/Button';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { useRegion } from '@/hooks/useRegion';
import { toAbsoluteUrl } from '@/lib/env';
import { cn } from '@/lib/utils';

const founderStats = [
  {
    value: '01',
    label: 'Strategic Direction',
    copy: 'Positioning every engagement around authority, conversion, and lasting brand equity.',
  },
  {
    value: '02',
    label: 'Luxury Design Systems',
    copy: 'Building interfaces with restraint, rhythm, hierarchy, and a premium editorial standard.',
  },
  {
    value: '03',
    label: 'Software Craft',
    copy: 'Engineering stable, scalable foundations for commerce, portals, automation, and growth.',
  },
];

const expertisePillars = [
  {
    title: 'Leadership Philosophy',
    copy: 'Lead with clarity. Remove noise. Protect standards. Make every decision serve the client, the product, and the long-term brand.',
  },
  {
    title: 'Design Philosophy',
    copy: 'Design is not a surface layer. It is how a brand is perceived, trusted, remembered, and chosen.',
  },
  {
    title: 'Software Philosophy',
    copy: 'Great software feels calm. The complexity stays behind the glass so the user only feels precision.',
  },
];

const founderPhilosophy = [
  {
    number: '01',
    title: 'Design is not decoration.',
    copy: 'Design is perception engineering.',
  },
  {
    number: '02',
    title: 'Technology should disappear.',
    copy: 'Users should only feel simplicity.',
  },
  {
    number: '03',
    title: 'Every pixel must earn its place.',
    copy: 'Anything without purpose weakens the experience.',
  },
  {
    number: '04',
    title: 'Luxury is clarity, not complexity.',
    copy: 'The strongest brands make confidence feel effortless.',
  },
];

const operations = ['Client Relations', 'Brand Operations', 'Project Coordination', 'Growth Strategy'];

const visionTimeline = [
  ['2026', 'Foundation'],
  ['2027', 'Regional Expansion'],
  ['2028', 'Global Partnerships'],
  ['2029', 'Premium Product Ecosystem'],
  ['2030', 'International Studio Presence'],
];

const processStages = [
  ['01', 'Strategy', 'Define positioning, market intent, audience psychology, and the digital architecture required to win.'],
  ['02', 'Design', 'Translate strategy into a premium interface system with hierarchy, restraint, motion, and brand memory.'],
  ['03', 'Engineering', 'Build performant, maintainable software that feels invisible to the client and effortless to the user.'],
  ['04', 'Growth', 'Refine the experience through analytics, SEO structure, conversion paths, and long-term product thinking.'],
];

const trustItems = [
  ['Official Website', 'jawrahpixel.com'],
  ['Business Email', 'hello@jawrahpixel.com'],
  ['Project Discovery Calls', 'Available'],
  ['Client Portal', 'Secure Access'],
  ['Country Support', 'Sri Lanka / Pakistan / International'],
];

const centeredFinalCardClass = 'col-span-2 justify-self-center w-[calc(50%_-_0.5rem)] md:col-span-1 md:w-auto md:justify-self-auto';
const centeredFinalFlushCardClass = 'col-span-2 justify-self-center w-[calc(50%_-_0.5px)] md:col-span-1 md:w-auto md:justify-self-auto';

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'mb-4 block text-[10px] font-mono font-bold uppercase tracking-[0.42em] text-zinc-500 md:mb-6',
        className,
      )}
    >
      {children}
    </span>
  );
}

function EditorialDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent',
        className,
      )}
    />
  );
}

function FounderPortrait() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[320px] md:max-w-[540px]"
    >
      <div className="absolute -inset-6 bg-white/[0.035] blur-[80px]" />
      <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.13),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(0,0,0,0.96)_56%)] shadow-[0_40px_120px_rgba(0,0,0,0.95)] sm:aspect-[4/5]">
        <img
          src="/assets/founder-image.png"
          alt="Portrait of Abdurrahman Shafie, founder of Jawrah Pixel"
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_62%,rgba(0,0,0,0.28)),radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_34%)]" />
        <div className="absolute inset-4 border border-white/[0.045]" />
        <div className="absolute inset-0 premium-grid-overlay opacity-10" />
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[39%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055]"
          animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.98, 1.03, 0.98] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

function Timeline({
  items,
  compact = false,
}: {
  items: Array<string[]>;
  compact?: boolean;
}) {
  return (
    <StaggerContainer className={cn('relative grid auto-rows-fr gap-4', compact ? 'grid-cols-2 md:grid-cols-1 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-5')}>
      <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 md:block" />
      {items.map(([number, title, copy], index) => {
        const isCenteredFinal = items.length % 2 === 1 && index === items.length - 1;

        return (
        <StaggerItem
          key={`${number}-${title}`}
          className={cn('relative h-full', isCenteredFinal && centeredFinalCardClass)}
        >
          <div className="group h-full min-w-0 border border-white/[0.06] bg-white/[0.018] p-4 transition-all duration-700 hover:border-white/[0.14] hover:bg-white/[0.035] md:p-7">
            <div className="mb-4 flex items-center gap-4 md:mb-8">
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-white/10 bg-brand-black text-[10px] font-mono text-zinc-400 transition-colors duration-500 group-hover:text-white">
                {number}
              </span>
              <div className="h-px flex-1 bg-white/[0.08] md:hidden" />
            </div>
            <h3 className="mb-2 text-xl font-display font-medium uppercase leading-tight text-white md:mb-4 md:text-2xl">
              {title}
            </h3>
            {copy && <p className="text-sm font-light leading-relaxed text-zinc-500">{copy}</p>}
          </div>
        </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

export default function Leadership() {
  const { p, config, currentRegion } = useRegion();
  const contactPath = p('/contact');
  const discoveryPath = `${contactPath}?intent=discovery`;
  const seoTitle = `Founder & Leadership | Jawrah Pixel ${config.countryName}`;
  const seoDescription =
    'Meet the founders and leadership vision behind Jawrah Pixel, a premium digital studio building luxury websites, ecommerce systems, and software ecosystems for ambitious brands.';

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-black text-white">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={toAbsoluteUrl(p('/leadership'))}
        keywords={[
          'Jawrah Pixel leadership',
          'Jawrah Pixel founder',
          'Abdurrahman Shafie',
          'Jaweriya Hafeez',
          `premium digital studio ${config.countryName}`,
        ]}
        schemaData={[
          {
            '@type': 'AboutPage',
            '@id': `${toAbsoluteUrl(p('/leadership'))}#leadership`,
            name: 'Jawrah Pixel Leadership',
            description: seoDescription,
            url: toAbsoluteUrl(p('/leadership')),
            mainEntity: {
              '@type': 'Organization',
              name: 'Jawrah Pixel',
              founder: {
                '@type': 'Person',
                name: 'Abdurrahman Shafie',
                jobTitle: 'Founder & Creative Director',
              },
              employee: {
                '@type': 'Person',
                name: 'Jaweriya Hafeez',
                jobTitle: 'Co-Founder & Brand Operations Lead',
              },
            },
          },
        ]}
        region={currentRegion}
      />

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-[0.14]" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 bg-white/[0.035] blur-[150px]" />
        <div className="absolute bottom-[12%] right-0 h-[460px] w-[460px] bg-white/[0.025] blur-[130px]" />
      </div>

      <section className="relative z-10 min-h-[auto] pt-24 pb-10 md:min-h-[92svh] md:pt-40 md:pb-28">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid items-center gap-8 md:gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16 xl:gap-24">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 inline-flex border border-white/[0.08] bg-white/[0.025] px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.46em] text-zinc-400 md:mb-8"
              >
                Leadership
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 max-w-5xl text-5xl font-display font-medium uppercase leading-[0.88] tracking-tight text-white sm:text-6xl md:mb-8 md:text-8xl xl:text-9xl"
              >
                The Minds Behind Jawrah Pixel.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl text-lg font-light leading-relaxed text-zinc-500 md:text-xl"
              >
                Jawrah Pixel was founded with a singular vision: to architect digital monopolies for ambitious
                brands through exceptional design, software craftsmanship, and strategic execution.
              </motion.p>
            </div>

            <FounderPortrait />
          </div>
        </div>
      </section>

      <EditorialDivider />

      <section className="relative z-10 py-10 md:py-32">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid gap-8 md:gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <SectionLabel>Founder</SectionLabel>
              <h2 className="mb-5 text-4xl font-display font-medium uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
                Abdurrahman Shafie
              </h2>
              <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.36em] text-zinc-500 md:mb-10">
                Founder & Creative Director
              </p>
              <div className="space-y-3 text-base font-light leading-relaxed text-zinc-500 md:space-y-6 md:text-lg">
                <p>
                  Abdurrahman Shafie founded Jawrah Pixel with the belief that modern businesses deserve more
                  than generic websites and recycled templates.
                </p>
                <p>
                  His vision is to build digital experiences that combine strategy, luxury aesthetics, and
                  engineering precision to help ambitious brands establish authority in their industries.
                </p>
                <p>
                  From premium jewellery brands and ecommerce ventures to modern software ecosystems, his focus
                  remains the same: creating digital experiences that feel timeless, purposeful, and unforgettable.
                </p>
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <StaggerContainer className="mb-6 grid auto-rows-fr grid-cols-2 gap-4 md:mb-8 md:grid-cols-3">
                {founderStats.map((item, index) => (
                  <StaggerItem
                    key={item.label}
                    className={cn('h-full', index === founderStats.length - 1 && centeredFinalCardClass)}
                  >
                    <div className="h-full min-w-0 border border-white/[0.06] bg-white/[0.018] p-4 transition-all duration-700 hover:border-white/[0.14] hover:bg-white/[0.035] md:p-6">
                      <span className="mb-6 block text-[11px] font-mono text-zinc-600 md:mb-10">{item.value}</span>
                      <h3 className="mb-3 text-lg font-display font-medium uppercase leading-tight text-white md:mb-4">
                        {item.label}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-zinc-500">{item.copy}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <StaggerContainer className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-1">
                {expertisePillars.map((item, index) => (
                  <StaggerItem
                    key={item.title}
                    className={cn('h-full', index === expertisePillars.length - 1 && centeredFinalCardClass)}
                  >
                    <div className="grid h-full min-w-0 gap-3 border border-white/[0.06] bg-white/[0.014] p-4 transition-all duration-700 hover:border-white/[0.12] hover:bg-white/[0.03] md:grid-cols-[0.36fr_1fr] md:gap-5 md:p-8">
                      <h3 className="text-sm font-display font-medium uppercase tracking-tight text-white md:text-xl">
                        {item.title}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-zinc-500 md:text-base">{item.copy}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/5 bg-white/[0.012] py-10 md:py-28">
        <div className="container mx-auto px-5 sm:px-6">
          <Reveal className="mb-8 max-w-3xl md:mb-20">
            <SectionLabel>Founder Philosophy</SectionLabel>
            <h2 className="text-4xl font-display font-medium uppercase leading-[1] tracking-tight text-white md:text-6xl">
              Principles That Shape The Work.
            </h2>
          </Reveal>

          <StaggerContainer className="grid auto-rows-fr grid-cols-2 gap-px overflow-hidden border border-white/[0.06] bg-white/[0.06] md:grid-cols-2">
            {founderPhilosophy.map((item) => (
              <StaggerItem key={item.number} y={26} className="h-full">
                <div className="group h-full min-h-[200px] min-w-0 bg-brand-black p-4 transition-colors duration-700 hover:bg-zinc-950 md:min-h-[260px] md:p-10">
                  <span className="mb-8 block text-[11px] font-mono text-zinc-600 transition-colors duration-500 group-hover:text-zinc-300 md:mb-16">
                    {item.number}
                  </span>
                  <h3 className="mb-4 max-w-xl text-2xl font-display font-medium uppercase leading-tight text-white md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="text-lg font-light leading-relaxed text-zinc-500">{item.copy}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="relative z-10 py-10 md:py-32">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid gap-8 md:gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-5">
              <SectionLabel>Co-Founder</SectionLabel>
              <h2 className="mb-5 text-4xl font-display font-medium uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
                Jaweriya Hafeez
              </h2>
              <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.36em] text-zinc-500 md:mb-10">
                Co-Founder & Brand Operations Lead
              </p>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal>
                <div className="mb-6 space-y-3 text-base font-light leading-relaxed text-zinc-500 md:mb-10 md:space-y-6 md:text-lg">
                  <p>
                    Jaweriya Hafeez plays a key role in shaping the client experience, operational systems, and
                    long-term growth strategy behind Jawrah Pixel.
                  </p>
                  <p>
                    Her focus is ensuring every project is delivered with precision, consistency, and a
                    client-first approach while maintaining the premium standards the studio is known for.
                  </p>
                </div>
              </Reveal>

              <StaggerContainer className="grid auto-rows-fr grid-cols-2 gap-4">
                {operations.map((item, index) => (
                  <StaggerItem key={item} className="h-full">
                    <div className="group flex h-full min-h-[112px] min-w-0 flex-col justify-between border border-white/[0.06] bg-white/[0.018] p-4 transition-all duration-700 hover:border-white/[0.14] hover:bg-white/[0.035] md:min-h-[150px] md:p-6">
                      <span className="text-[11px] font-mono text-zinc-600">0{index + 1}</span>
                      <h3 className="text-2xl font-display font-medium uppercase tracking-tight text-white">
                        {item}
                      </h3>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      <EditorialDivider />

      <section className="relative z-10 py-10 md:py-32">
        <div className="container mx-auto px-5 sm:px-6">
          <Reveal className="mb-8 max-w-4xl md:mb-20">
            <SectionLabel>Our Vision</SectionLabel>
            <h2 className="mb-5 text-4xl font-display font-medium uppercase leading-[1] tracking-tight text-white md:mb-8 md:text-7xl">
              Building The Future Of Premium Digital Experiences.
            </h2>
            <div className="max-w-2xl space-y-3 text-base font-light leading-relaxed text-zinc-500 md:space-y-5 md:text-lg">
              <p>
                Jawrah Pixel exists to help ambitious brands compete at a global level through exceptional design,
                intelligent systems, and world-class digital execution.
              </p>
              <p>
                We believe the next generation of category leaders will be built through digital excellence. Our
                mission is to help create them.
              </p>
            </div>
          </Reveal>

          <Timeline items={visionTimeline} />
        </div>
      </section>

      <section className="relative z-10 border-y border-white/5 bg-white/[0.012] py-10 md:py-28">
        <div className="container mx-auto px-5 sm:px-6">
          <Reveal className="mb-8 flex flex-col justify-between gap-4 md:mb-20 md:flex-row md:items-end md:gap-6">
            <div>
              <SectionLabel>Process</SectionLabel>
              <h2 className="text-4xl font-display font-medium uppercase leading-[1] tracking-tight text-white md:text-7xl">
                How We Build.
              </h2>
            </div>
            <p className="max-w-md text-sm font-light leading-relaxed text-zinc-500 md:text-base">
              Strategy, design, engineering, and growth operate as one disciplined system.
            </p>
          </Reveal>

          <Timeline items={processStages} compact />
        </div>
      </section>

      <section className="relative z-10 py-8 md:py-32">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="grid gap-6 md:gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-4">
              <SectionLabel className="mb-3 md:mb-6">Trust</SectionLabel>
              <h2 className="mb-3 text-[2.1rem] font-display font-medium uppercase leading-[0.98] tracking-tight text-white md:mb-8 md:text-6xl">
                Built On Transparency.
              </h2>
              <p className="max-w-xl text-sm font-light leading-relaxed text-zinc-500 md:text-base">
                Clear access points, secure collaboration, and regional support for serious project conversations.
              </p>
            </Reveal>

            <div className="lg:col-span-8">
              <StaggerContainer className="grid auto-rows-fr grid-flow-row-dense grid-cols-1 gap-px overflow-hidden border border-white/[0.06] bg-white/[0.06] min-[360px]:grid-cols-2 md:grid-cols-2">
                {trustItems.map(([label, value]) => (
                  <StaggerItem
                    key={label}
                    className={cn(
                      'h-full',
                      label === 'Business Email' && 'min-[360px]:col-span-2 md:col-span-1',
                    )}
                  >
                    <div className="flex h-full min-h-[74px] min-w-0 flex-col justify-start gap-2.5 bg-brand-black p-3 transition-colors duration-700 hover:bg-zinc-950 min-[360px]:min-h-[86px] md:min-h-[150px] md:justify-between md:gap-0 md:p-8">
                      <span className="text-[8px] font-mono uppercase leading-none tracking-[0.16em] text-zinc-600 md:text-[10px] md:tracking-[0.32em]">
                        {label}
                      </span>
                      {value.includes('@') ? (
                        <a
                          href="mailto:hello@jawrahpixel.com"
                          className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap text-[0.95rem] font-display font-medium uppercase leading-none tracking-normal text-white transition-colors duration-500 hover:text-zinc-300 md:mt-8 md:gap-3 md:text-2xl md:tracking-tight"
                        >
                          <Mail className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
                          {value}
                        </a>
                      ) : label === 'Country Support' ? (
                        <>
                          <div className="grid gap-0.5 text-[0.88rem] font-display font-medium uppercase leading-none tracking-normal text-white md:hidden">
                            {value.split(' / ').map((region) => (
                              <span key={region}>{region}</span>
                            ))}
                          </div>
                          <p className="hidden break-words font-display font-medium uppercase tracking-tight text-white md:mt-8 md:block md:text-2xl">
                            {value}
                          </p>
                        </>
                      ) : (
                        <p className="break-words text-[0.95rem] font-display font-medium uppercase leading-none tracking-normal text-white md:mt-8 md:text-2xl md:tracking-tight">
                          {value}
                        </p>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      <Reveal className="relative z-10 border-t border-white/5 py-10 md:py-32">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden border border-white/[0.08] bg-white/[0.018] px-6 py-10 text-center md:px-16 md:py-24">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-white/[0.055] blur-[100px]" />
            <SectionLabel>Begin</SectionLabel>
            <h2 className="relative z-10 mx-auto mb-8 max-w-4xl text-4xl font-display font-medium uppercase leading-[1] tracking-tight text-white md:text-7xl">
              Let&apos;s Build Something Exceptional.
            </h2>
            <p className="relative z-10 mx-auto mb-10 max-w-2xl text-base font-light leading-relaxed text-zinc-500 md:text-lg">
              Whether you&apos;re launching a luxury brand, scaling an ecommerce business, or building a digital
              ecosystem, we&apos;re ready to help architect the next chapter of your growth.
            </p>
            <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to={contactPath}>
                <Button size="lg" className="w-full sm:min-w-[230px]">
                  Start Your Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={discoveryPath}>
                <Button variant="outline" size="lg" className="w-full sm:min-w-[250px]">
                  Book A Discovery Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
