import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

const SECTIONS = [
  { id: 'eligibility', title: '01. Eligibility' },
  { id: 'non-refundable', title: '02. Non-refundable Services' },
  { id: 'partial-refunds', title: '03. Partial Refund Situations' },
  { id: 'cancellation', title: '04. Cancellation Policy' },
  { id: 'chargebacks', title: '05. Chargeback Policy' },
  { id: 'requests', title: '06. How to Request' },
];

export default function RefundPolicy() {
  const { config, p } = useRegion();
  const lastUpdated = 'June 1, 2026';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-brand-black min-h-screen pt-32 pb-24 text-white overflow-hidden relative">
      <SEO 
        title={`Refund Policy | Jawrah Pixel`}
        description="Transparent refund policy and cancellation guidelines for Jawrah Pixel digital services."
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-32 space-y-12">
                <Reveal>
                  <Link 
                    to={p('/')}
                    className="group inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors mb-12"
                  >
                    <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                    Back to Agency
                  </Link>

                  <h3 className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold mb-10">Navigation</h3>
                  <nav className="space-y-4">
                    {SECTIONS.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="flex items-center justify-between w-full text-left px-6 py-4 bg-white/[0.02] border border-white/5 hover:border-brand-blue/30 text-zinc-500 hover:text-white transition-all duration-500 group"
                      >
                        <span className="text-xs font-display font-medium uppercase tracking-widest">{section.title}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      </button>
                    ))}
                  </nav>
                </Reveal>

                <Reveal delay={0.2} className="p-8 bg-brand-blue/5 border border-brand-blue/20">
                  <div className="flex gap-4 items-start">
                    <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold mb-3">Transparency First</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed font-light">We believe in clear, fair policies that protect both our clients and our creative output.</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-8">
              <Reveal className="mb-24">
                <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Commercial Protection</span>
                <h1 className="text-4xl md:text-7xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-10">
                  Refund <br /> <span className="premium-text-gradient italic">Policy</span>
                </h1>
                <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  <span>Last Updated: {lastUpdated}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                  <span>Version 2.0</span>
                </div>
              </Reveal>

              <div className="space-y-32">
                <section id="eligibility" className="scroll-mt-32">
                  <Reveal>
                    <h2 className="text-2xl font-display font-medium text-white uppercase tracking-tight mb-8">01. Eligibility</h2>
                    <div className="space-y-6 text-zinc-500 font-light leading-relaxed">
                      <p>At Jawrah Pixel, we strive for 100% satisfaction. If you are not satisfied with the initial direction of your project, you may be eligible for a refund of the deposit before significant production has commenced.</p>
                      <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0"></div>
                          <span>Refund requests must be made in writing within 7 days of the initial strategy briefing.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0"></div>
                          <span>Eligibility is void once the design lock-in phase has been completed.</span>
                        </li>
                      </ul>
                    </div>
                  </Reveal>
                </section>

                <section id="non-refundable" className="scroll-mt-32">
                  <Reveal>
                    <h2 className="text-2xl font-display font-medium text-white uppercase tracking-tight mb-8">02. Non-refundable Services</h2>
                    <div className="space-y-6 text-zinc-500 font-light leading-relaxed">
                      <p>Due to the intensive nature of architectural time and third-party costs, certain items are strictly non-refundable:</p>
                      <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0"></div>
                          <span>Strategic briefing sessions and consultation time already rendered.</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0"></div>
                          <span>Third-party license fees (Premium Fonts, Stocks, API keys).</span>
                        </li>
                        <li className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0"></div>
                          <span>Subscription payments for active maintenance plans.</span>
                        </li>
                      </ul>
                    </div>
                  </Reveal>
                </section>

                <section id="partial-refunds" className="scroll-mt-32">
                  <Reveal>
                    <h2 className="text-2xl font-display font-medium text-white uppercase tracking-tight mb-8">03. Partial Refund Situations</h2>
                    <div className="space-y-6 text-zinc-500 font-light leading-relaxed">
                      <p>In cases where a project is terminated mid-production, a partial refund may be issued based on the work completed to date, minus a 25% administrative and planning fee.</p>
                    </div>
                  </Reveal>
                </section>

                <section id="cancellation" className="scroll-mt-32">
                  <Reveal>
                    <h2 className="text-2xl font-display font-medium text-white uppercase tracking-tight mb-8">04. Cancellation Policy</h2>
                    <div className="space-y-6 text-zinc-500 font-light leading-relaxed">
                      <p>Project cancellations must be submitted via your client dashboard or official email. Upon cancellation, all work in progress remains the intellectual property of Jawrah Pixel unless full buyout is settled.</p>
                    </div>
                  </Reveal>
                </section>

                <section id="chargebacks" className="scroll-mt-32">
                  <Reveal>
                    <h2 className="text-2xl font-display font-medium text-white uppercase tracking-tight mb-8">05. Chargeback Policy</h2>
                    <div className="space-y-6 text-zinc-500 font-light leading-relaxed">
                      <p>Jawrah Pixel reserves the right to immediately suspend all services and terminate dashboard access if a chargeback is initiated without prior communication with our billing department.</p>
                    </div>
                  </Reveal>
                </section>

                <section id="requests" className="scroll-mt-32 pb-20">
                  <Reveal>
                    <h2 className="text-2xl font-display font-medium text-white uppercase tracking-tight mb-8">06. How to Request</h2>
                    <div className="space-y-10 text-zinc-500 font-light leading-relaxed">
                      <p>Official refund requests must be sent to <span className="text-white">billing@jawrahpixel.com</span> with your Project ID and reason for the request.</p>
                      <Link to={p('/contact')}>
                        <Button size="lg" className="min-w-[240px]">Contact Billing Desk</Button>
                      </Link>
                    </div>
                  </Reveal>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
