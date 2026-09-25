import React, { useState } from 'react';
import { 
  Check,
  CheckCircle2, 
  Coins,
  Cpu, 
  Database, 
  ExternalLink, 
  Flame, 
  Layers3, 
  LayoutDashboard, 
  LockKeyhole, 
  Maximize2, 
  Monitor, 
  Scale, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Tablet, 
  Workflow 
} from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

const experienceAreas = [
  {
    title: 'Daily factory workbook & stage sign-off',
    what: 'A high-density operational grid allowing supervisors and goldsmiths to log raw bullion intake, casting weights, filing recovery, and polishing loss with immutable end-of-day locks.',
    why: 'Physical gold shifts form across workstations; without instantaneous digital sign-offs, precious metal scrap and purity discrepancies cannot be isolated.',
    benefit: 'Factory supervisors can reconcile workshop balances in seconds rather than spending hours cross-checking manual paper logs.',
    seo: 'Establishes clear topical authority around gold manufacturing software, factory automation, and digital workshop workbooks.',
  },
  {
    title: 'Dual-balance 24K conversion algorithm',
    what: 'An automated purity calculation engine that preserves both physical gross weight (grams) and canonical 24K pure gold obligations simultaneously across 24K, 22K, 21K, 18K, and 14K alloys.',
    why: 'Jewellery pieces vary in alloy composition, but financial obligations and bullion settlements must always be calculated against 24K pure fine gold standard.',
    benefit: 'Guarantees 0.001g calculation precision with zero rounding drift across multi-karat casting batches and customer orders.',
    seo: 'Targets technical intent for dual-balance gold accounting, purity conversion software, and precious metal ERP systems.',
  },
  {
    title: 'Ready-stock vault & RK serial identification',
    what: 'An authoritative vault inventory system assigning unique RK serial identifiers, karat stamps, net gold weights, and stone weights to finished stock items.',
    why: 'Showroom sales staff and wholesale representatives need real-time certainty over vault availability without physical count interruptions.',
    benefit: 'Enables instant catalog lookup, digital barcode verification, and immediate reservation for high-value B2B orders.',
    seo: 'Optimizes for jewellery ready-stock inventory, vault management systems, and RFID jewellery tracking software.',
  },
  {
    title: 'B2B wholesale sales custody & invoicing',
    what: 'A structured sales dispatch workflow managing stock transfers to retail partners, merchant credit lines, and customer obligations in both pure gold and local currency.',
    why: 'B2B jewellery sales frequently settle via metal exchange rather than pure fiat cash, requiring specialized multi-asset invoice ledgers.',
    benefit: 'Both the buyer and the manufacturer maintain transparent visibility into outstanding gold weight and cash balances.',
    seo: 'Strengthens relevance for B2B jewellery sales platforms, wholesale gold distribution, and custom invoicing engines.',
  },
  {
    title: 'Controlled return quarantine gate',
    what: 'A strict multi-stage inspection flow where returned jewellery is isolated in quarantine for metallurgical purity testing before re-vaulting or refinery re-melting.',
    why: 'Silently re-adding unverified returns to stock risks contaminating inventory with under-karat alloys or inaccurate weight recordings.',
    benefit: 'Protects the manufacturer against inventory corruption and guarantees that only verified pieces re-enter circulation.',
    seo: 'Demonstrates expertise in high-security inventory workflows, return authorization gates, and jewellery quality assurance.',
  },
  {
    title: 'Tripartite accounting matrix',
    what: 'An isolated tripartite ledger architecture that independently tracks gold weight balances, fiat cash payments, and post-dated cheque clearing pipelines.',
    why: 'Gold weight obligations and banking clearing cycles operate on fundamentally different timelines and accounting rules.',
    benefit: 'Eliminates audit blind spots, prevents premature revenue recognition, and gives executives crystal-clear cash and metal solvency reporting.',
    seo: 'Demonstrates robust financial systems engineering, multi-currency ledger design, and custom business accounting software.',
  },
  {
    title: 'Machine & overhead cost allocation',
    what: 'An operational cost module that factors machine depreciation, consumable chemicals, casting gas, and labor rates into every finished batch.',
    why: 'Pricing finished jewellery requires accurate cost attribution beyond raw gold market value alone.',
    benefit: 'Enables exact profit-margin calculation per product line and identifies production cost bottlenecks across workshop equipment.',
    seo: 'Focuses on manufacturing cost accounting, jewellery production costing, and custom enterprise resource planning.',
  },
  {
    title: 'PostgreSQL RLS & workshop role authorization',
    what: 'A granular security architecture built with Supabase PostgreSQL Row-Level Security ensuring staff only access authorized factory or financial modules.',
    why: 'Workshop operators require simple numeric entry screens without exposure to company-wide financial ledgers or client balances.',
    benefit: 'Maintains enterprise-grade data isolation, tamper-proof audit trails, and strict role-based access control across all branches.',
    seo: 'Reinforces full-stack engineering standards with PostgreSQL, Row-Level Security, and enterprise authentication.',
  },
];

const lifecycleSteps = [
  ['Bullion Ingot Intake', '24K fine bullion is weighed, verified with scale calibration, and logged into the factory ledger.'],
  ['Alloy Calculation & Casting', 'Master alloys are blended to exact target karat (22K, 21K, 18K) and cast via vacuum pressure casting.'],
  ['Workshop Goldsmith Finish', 'Artisans file, assemble, mount gemstones, polish, and recover micro-scrap in sealed suction trays.'],
  ['Vault Entry & RK Tagging', 'Finished pieces receive unique RK serial tags with dual-balance gross and pure 24K weights logged.'],
  ['B2B Custody & Merchant Sales', 'Stock is allocated to wholesale clients with transparent gold weight or currency settlement terms.'],
  ['Quarantine & Ledger Reconciliation', 'Returned items undergo metallurgical appraisal, and tripartite ledgers settle cash, cheques, and metal.'],
];

const faq = [
  ['What type of system did Jawrah Pixel engineer for Rankala Gold?', 'Jawrah Pixel designed and built a connected digital operations platform uniting factory floor manufacturing, gold purity calculations, ready-stock vaulting, B2B sales custody, customer returns, payments, costing, and live reporting.'],
  ['How does dual-balance gold accounting work in the platform?', 'The system continuously computes two balances for every transaction: physical gross weight in grams and the canonical 24K pure gold equivalent (e.g. 100g of 22K = 91.667g of 24K pure gold), eliminating purity loss ambiguities.'],
  ['Can workshop goldsmiths use the platform on mobile tablets?', 'Yes. The interface includes high-density responsive views optimized for touchscreens and workshop desks, enabling rapid numeric weight entry and stage sign-offs.'],
  ['What is the return quarantine gate?', 'Returned jewellery items are placed in a quarantined state for metallurgical testing before they can either be re-vaulted as ready stock or routed to the refinery for re-melting.'],
  ['How are payments and gold exchanges separated?', 'The platform implements a tripartite accounting matrix that isolates physical gold weight balances, fiat cash settlements, and post-dated cheque clearing pipelines into independent ledger tracks.'],
  ['What technology stack powers the Rankala Gold platform?', 'The platform is engineered using React, TypeScript, Tailwind CSS, Node.js, and Supabase PostgreSQL with Row-Level Security (RLS) for multi-tenant data protection.'],
  ['Is the public website accessible live?', 'Yes. The front-facing digital customer catalogue and live gold rate experience is available at rankala.lk.'],
  ['What SEO themes does this case study support?', 'Themes include custom software development Sri Lanka, gold manufacturing ERP, dual-balance gold accounting, jewellery operations platform, and secure business management systems.'],
];

const systemScreens = [
  {
    id: 'desktop',
    title: 'Desktop Catalogue Experience',
    tag: 'Customer & Partner Storefront',
    image: '/assets/case-studies/rankala/desktop.jpeg',
    desc: 'The customer-facing digital catalogue interface designed for jewellery buyers, retail partners, and live gold rate discovery.',
  },
  {
    id: 'mobile',
    title: 'Mobile Commerce View',
    tag: 'Responsive Mobile Surface',
    image: '/assets/case-studies/rankala/mobile.jpeg',
    desc: 'Touch-optimized mobile interface allowing showroom visitors and sales representatives to browse ready stock on the go.',
  },
  {
    id: 'system1',
    title: 'Admin Portal — Operations',
    tag: 'Factory & Vault Engine',
    image: '/assets/case-studies/rankala/system.jpeg',
    desc: 'The internal operating portal managing daily factory workbooks, ready stock vaulting, and workstation stage handovers.',
  },
  {
    id: 'system2',
    title: 'Admin Portal — Costing & Ledgers',
    tag: 'Financial & Ledger Matrix',
    image: '/assets/case-studies/rankala/system2.jpeg',
    desc: 'The financial analytics matrix tracking machine depreciation, overhead expenses, cheque clearing, and tripartite settlements.',
  },
];

// Detailed breakdown for the 3 balance images (Mobile, Admin Operations, Admin Costing)
const balanceScreensAnalysis = [
  {
    id: 'mobile-screen',
    number: '01',
    title: 'Mobile Storefront & Field Sales Interface',
    tag: 'Mobile Surface',
    image: '/assets/case-studies/rankala/mobile.jpeg',
    imageType: 'mobile' as const,
    role: 'Showroom Visitors & Traveling Sales Representatives',
    summary: 'A dedicated mobile-first digital experience engineering rapid product discovery, live daily gold rate synchronization, and instant WhatsApp consultation for mobile clients across Sri Lanka.',
    architectureDetails: [
      {
        heading: 'Live Gold Rate Barometer',
        text: 'Synchronizes live 24K and 22K per-gram market pricing with immediate calculation of customer piece values.',
      },
      {
        heading: 'One-Tap WhatsApp Consultation',
        text: 'Pre-fills product serial codes, karat stamps, and weight specifications directly into client messaging threads.',
      },
      {
        heading: 'Lightweight Mobile Asset Streaming',
        text: 'Sub-second image loading optimized for low-bandwidth cellular environments in wholesale jewellery markets.',
      },
      {
        heading: 'Touch-First Catalog Navigation',
        text: 'Large finger-friendly filters for ring sizes, bangles, necklaces, and bridal sets with zero cumulative layout shift.',
      },
    ],
  },
  {
    id: 'system1-screen',
    number: '02',
    title: 'Admin Portal — Factory Operations & Vault Management',
    tag: 'Factory & Vault Engine',
    image: '/assets/case-studies/rankala/system.jpeg',
    imageType: 'desktop' as const,
    role: 'Workshop Supervisors, Goldsmiths & Vault Managers',
    summary: 'The central operational nervous system of Rankala Gold, providing daily factory workbook logging, workstation stage custody handovers, scrap recovery balances, and authoritative vault serial tagging.',
    architectureDetails: [
      {
        heading: 'Daily Factory Workbook Grid',
        text: 'Dense tabular interface tailored for workshop desks to log bullion melting, sprue filing, setting, and buffing weights.',
      },
      {
        heading: 'RK Serial Number Generation',
        text: 'Automatically mints unique RK serial tags linking gross weight, net gold weight, alloy purity, and gem specifications.',
      },
      {
        heading: 'Immutable EOD Finalization Locks',
        text: 'Locks daily workstation balances at close of business to guarantee that past audit logs cannot be edited.',
      },
      {
        heading: 'PostgreSQL RLS Multi-Role Security',
        text: 'Ensures factory operators only interact with workshop queues while executive ledgers remain strictly confidential.',
      },
    ],
  },
  {
    id: 'system2-screen',
    number: '03',
    title: 'Admin Portal — Financial Ledgers & Return Quarantine',
    tag: 'Ledgers & Cost Engine',
    image: '/assets/case-studies/rankala/system2.jpeg',
    imageType: 'desktop' as const,
    role: 'Managing Directors, Accountants & Chief Controllers',
    summary: 'The financial and intelligence matrix governing tripartite ledger accounting, machine runtime depreciation, customer credit lines, and the strict quarantine inspection protocol for returned items.',
    architectureDetails: [
      {
        heading: 'Tripartite Accounting Separation',
        text: 'Isolates physical gold weight obligations, fiat cash reserves, and post-dated cheque clearing pipelines into independent tracks.',
      },
      {
        heading: 'Machine & Overhead Cost Allocation',
        text: 'Distributes vacuum casting gas, chemical consumables, and equipment depreciation into exact unit product costs.',
      },
      {
        heading: 'Controlled Return Quarantine Gate',
        text: 'Isolates merchant returns in quarantine pending metallurgical appraisal, preventing unverified ready-stock inflation.',
      },
      {
        heading: 'Real-Time Enterprise Solvency Yield',
        text: 'Provides instant executive visibility into total enterprise gold balances, bullion reserves, and merchant receivables.',
      },
    ],
  },
];

export function RankalaGoldCaseStudy() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const activeScreen = systemScreens[activeScreenIndex];

  return (
    <>
      {/* 01 / VERIFIED PROJECT ANALYSIS & CORE PILLARS */}
      <section className="mb-32 border-y theme-border py-20 sm:py-28">
        <Reveal className="mb-14 max-w-4xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">
            Verified Project Analysis
          </span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">
            Factory floor to B2B sales in one connected system.
          </h2>
          <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed theme-text-muted">
            Rankala Gold is a custom-engineered business operations platform built by Jawrah Pixel. It replaces fragmented paper workbooks and spreadsheets with an authoritative digital ecosystem governing gold manufacturing, purity conversions, vault inventory, B2B sales custody, and financial ledgers.
          </p>
        </Reveal>

        <StaggerContainer className="grid gap-px border theme-border sm:grid-cols-3">
          {[
            { 
              icon: Scale, 
              title: 'Dual-Balance Purity Engine', 
              copy: 'Continuous milligram-precision tracking of both gross physical weight and pure 24K gold obligations across all alloy karats.' 
            },
            { 
              icon: Workflow, 
              title: '10-Stage Factory Lifecycle', 
              copy: 'End-to-end custody tracking from bullion melting, alloy casting, goldsmith assembly, setting, and polishing to vault storage.' 
            },
            { 
              icon: ShieldCheck, 
              title: 'Quarantine & Isolated Ledgers', 
              copy: 'Strict return quarantine checkpoints preventing stock inflation and tripartite isolation of gold, cash, and cheque lifecycles.' 
            },
          ].map(({ icon: IconComponent, title, copy }) => (
            <StaggerItem key={title} className="theme-bg p-7 sm:p-9">
              <IconComponent className="mb-7 text-brand-blue" size={22} />
              <h3 className="text-xl font-display uppercase theme-text-primary">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed theme-text-muted">{copy}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 02 / REAL SYSTEM & WORKSTATION SCREENS SHOWCASE (INTERACTIVE TABS) */}
      <section className="mb-32">
        <Reveal className="mb-12 max-w-3xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">
            System Showcase
          </span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">
            Real workstations, real production screens.
          </h2>
          <p className="mt-6 leading-relaxed theme-text-muted">
            Explore the deployed customer catalogue, responsive mobile storefront, and internal administrative operational portals engineered by Jawrah Pixel for Rankala Gold.
          </p>
        </Reveal>

        {/* Screen Selector Tabs in matching card style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {systemScreens.map((screen, idx) => {
            const isSelected = activeScreenIndex === idx;
            return (
              <button
                key={screen.id}
                onClick={() => setActiveScreenIndex(idx)}
                className={cn(
                  "p-5 text-left border transition-all duration-300 flex flex-col justify-between group",
                  isSelected
                    ? "border-brand-blue bg-brand-blue/10 theme-text-primary"
                    : "theme-border theme-card theme-text-muted hover:border-brand-blue/40 hover:theme-text-primary"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-blue">
                    0{idx + 1}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border theme-border">
                    {screen.tag}
                  </span>
                </div>
                <h4 className="font-display uppercase text-sm font-medium tracking-wide theme-text-primary">
                  {screen.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Visual Display Frame */}
        <Reveal className="border theme-border theme-card overflow-hidden">
          <div className="px-6 py-4 border-b theme-border theme-bg-tertiary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-[10px] font-mono uppercase tracking-widest theme-text-caption">
                {activeScreen.tag} &middot; rankala.lk
              </span>
            </div>
            <a
              href={activeScreen.image}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 border theme-border text-[10px] font-mono uppercase tracking-wider theme-text-muted hover:theme-text-primary transition-colors"
            >
              <Maximize2 size={12} />
              Inspect Full Size
            </a>
          </div>

          <div className="relative bg-black/5 dark:bg-black/40 min-h-[380px] sm:min-h-[540px] flex items-center justify-center p-4 sm:p-8">
            <img
              src={activeScreen.image}
              alt={activeScreen.title}
              className={cn(
                "border theme-border object-contain shadow-2xl max-h-[620px] w-auto transition-transform duration-500",
                activeScreen.id === 'mobile' ? "max-w-[340px]" : "w-full max-w-5xl"
              )}
            />
          </div>

          <div className="p-6 sm:p-8 border-t theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display uppercase tracking-tight theme-text-primary mb-1">
                {activeScreen.title}
              </h3>
              <p className="text-sm font-light leading-relaxed theme-text-muted">
                {activeScreen.desc}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Production Verified
            </span>
          </div>
        </Reveal>
      </section>

      {/* 03 / DEDICATED BREAKDOWN OF THE BALANCE 3 APPLICATION SURFACES WITH EXPLANATIONS */}
      <section className="mb-32 border-t theme-border pt-24">
        <Reveal className="mb-16 max-w-4xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">
            Detailed Screen Analysis
          </span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">
            In-depth walkthrough of the core operational screens.
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed theme-text-muted">
            Detailed architectural breakdown of the responsive mobile commerce experience and the two administrative portals governing factory manufacturing, inventory vaults, and tripartite financial accounting.
          </p>
        </Reveal>

        <div className="space-y-24">
          {balanceScreensAnalysis.map((screenItem, index) => (
            <Reveal 
              key={screenItem.id}
              className="border theme-border theme-card overflow-hidden"
            >
              {/* Card Header Bar */}
              <div className="p-6 sm:p-8 border-b theme-border theme-bg-tertiary flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-blue">
                      Screen {screenItem.number}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 border theme-border">
                      {screenItem.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-tight theme-text-primary">
                    {screenItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider theme-text-caption">
                    Role: <strong className="theme-text-primary font-medium">{screenItem.role}</strong>
                  </span>
                  <a
                    href={screenItem.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border theme-border text-[10px] font-mono uppercase tracking-wider theme-text-muted hover:theme-text-primary transition-colors shrink-0"
                  >
                    <Maximize2 size={12} />
                    Inspect
                  </a>
                </div>
              </div>

              {/* Grid: Image Left/Center, Structured Explanation Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                {/* Visual Viewport */}
                <div className={cn(
                  "lg:col-span-6 bg-black/5 dark:bg-black/40 p-6 sm:p-10 flex items-center justify-center border-b lg:border-b-0 lg:border-r theme-border",
                  screenItem.imageType === 'mobile' ? "min-h-[460px]" : "min-h-[380px]"
                )}>
                  <img
                    src={screenItem.image}
                    alt={screenItem.title}
                    className={cn(
                      "border theme-border object-contain shadow-2xl transition-transform duration-500 hover:scale-[1.01]",
                      screenItem.imageType === 'mobile' ? "max-h-[520px] max-w-[300px]" : "w-full max-w-xl max-h-[420px]"
                    )}
                  />
                </div>

                {/* Structured Text & Architecture Breakdown */}
                <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-brand-blue block mb-2">
                      Operational Context & Purpose
                    </span>
                    <p className="text-base font-light leading-relaxed theme-text-secondary mb-8">
                      {screenItem.summary}
                    </p>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-brand-blue block mb-4">
                      Key Technical & Operational Capabilities
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {screenItem.architectureDetails.map((detail, idx) => (
                        <div key={idx} className="border theme-border theme-bg-tertiary p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Check size={14} className="text-brand-cyan shrink-0" />
                            <h5 className="font-display uppercase text-xs tracking-wide theme-text-primary">
                              {detail.heading}
                            </h5>
                          </div>
                          <p className="text-xs font-light leading-relaxed theme-text-muted">
                            {detail.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t theme-border flex items-center justify-between text-[10px] font-mono uppercase tracking-wider theme-text-caption">
                    <span>Rankala Gold Operating Layer</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Verified
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 04 / OPERATIONAL & FEATURE ANALYSIS CARDS */}
      <section className="mb-32">
        <Reveal className="mb-14 max-w-3xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">
            Operational Architecture
          </span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">
            A system built for precision and accountability.
          </h2>
          <p className="mt-7 leading-relaxed theme-text-muted">
            The platform addresses the unique challenges of gold manufacturing, where weight conservation, alloy conversions, and strict custody handovers make generic ERP software unworkable.
          </p>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-2">
          {experienceAreas.map((area, index) => (
            <Reveal key={area.title} delay={index * 0.03} className="border theme-border theme-card p-7 sm:p-9">
              <div className="flex items-start gap-5">
                <span className="font-mono text-sm text-brand-blue">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-xl font-display uppercase theme-text-primary">{area.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed theme-text-secondary">
                    <strong className="theme-text-primary">What it is:</strong> {area.what}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed theme-text-secondary">
                    <strong className="theme-text-primary">Why it exists:</strong> {area.why}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed theme-text-secondary">
                    <strong className="theme-text-primary">UX benefit:</strong> {area.benefit}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed theme-text-secondary">
                    <strong className="theme-text-primary">SEO value:</strong> {area.seo}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 05 / MANUFACTURING & SALES LIFECYCLE */}
      <section className="mb-32 grid gap-14 border-b theme-border pb-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
        <Reveal>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">
            Production Lifecycle
          </span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">
            From raw bullion ingot to customer dispatch.
          </h2>
        </Reveal>
        <div className="space-y-5">
          {lifecycleSteps.map(([title, copy], index) => (
            <Reveal key={title} delay={index * 0.04} className="flex gap-5 border-b theme-border pb-5">
              <span className="font-mono text-sm text-brand-blue">0{index + 1}</span>
              <div>
                <h3 className="font-display uppercase theme-text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed theme-text-muted">{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 06 / 2-COLUMN CARDS: SEO & MOBILE TABLET ARCHITECTURE */}
      <section className="mb-32 grid gap-5 md:grid-cols-2">
        <Reveal className="border theme-border theme-card p-8 sm:p-10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-blue">
            System & SEO Architecture
          </span>
          <h2 className="mt-5 text-3xl font-display uppercase theme-text-primary">
            Engineered for longevity & discoverability.
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              'Custom React and TypeScript architecture with clean modular component boundaries.',
              'Supabase PostgreSQL database with Row-Level Security ensuring strict RBAC access control.',
              'Dual-balance purity conversion engine enforcing milligram-level 0.001g calculation precision.',
              'Structured data representation with CreativeWork, SoftwareApplication, and Organization schema.',
              'Clean crawlable information architecture targeting gold ERP, manufacturing, and business software searches.'
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed theme-text-muted">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-blue" size={16} />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="border theme-border theme-card p-8 sm:p-10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-blue">
            Workshop & Mobile Usability
          </span>
          <h2 className="mt-5 text-3xl font-display uppercase theme-text-primary">
            Built for factory floor tablets and mobile sales.
          </h2>
          <p className="mt-8 text-sm leading-relaxed theme-text-muted">
            The platform was engineered specifically for noisy, high-pressure workshop environments. Goldsmiths and scale operators interact with high-contrast, large numeric touch controls that provide immediate visual feedback. Sales representatives on the road access live vault stock availability with offline-ready caching and instant WhatsApp quote generation.
          </p>
          <div className="mt-8 flex items-center gap-6 text-brand-blue">
            <Tablet size={26} />
            <Smartphone size={26} />
            <Monitor size={26} />
          </div>
        </Reveal>
      </section>

      {/* 07 / PROJECT FAQ */}
      <section className="mb-32">
        <Reveal className="mb-12 max-w-3xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">
            Project FAQ
          </span>
          <h2 className="mt-5 text-4xl font-display uppercase theme-text-primary sm:text-6xl">
            Questions worth answering.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {faq.map(([question, answer]) => (
            <Reveal key={question} className="border theme-border theme-card p-7">
              <h3 className="flex gap-3 text-lg font-display uppercase theme-text-primary">
                <span className="text-brand-blue">+</span>{question}
              </h3>
              <p className="mt-4 text-sm leading-relaxed theme-text-muted">{answer}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
