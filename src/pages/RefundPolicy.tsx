import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="bg-brand-navy min-h-screen">
      <SEO 
        title={`Refund Policy | Jawrah Pixel`}
        description="Transparent refund policy and cancellation guidelines for Jawrah Pixel digital services."
      />

      {/* Sticky Back Button */}
      <div className="fixed top-24 left-4 md:left-8 z-40">
        <Link 
          to={p('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-brand-gray hover:text-white hover:border-brand-cyan/50 transition-all duration-300 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-32 space-y-8">
                  <div>
                    <h3 className="text-white font-display text-sm uppercase tracking-[0.2em] mb-6">Contents</h3>
                    <nav className="space-y-2">
                      {SECTIONS.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/5 text-brand-gray hover:text-brand-cyan transition-all duration-300 group"
                        >
                          <span className="text-[13px] font-medium">{section.title}</span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-cyan/10 to-transparent border border-brand-cyan/20">
                    <h4 className="text-white font-display text-xs uppercase tracking-widest mb-2">Transparency First</h4>
                    <p className="text-brand-gray text-xs leading-relaxed mb-4">We believe in clear, fair policies that protect both our clients and our creative output.</p>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-8">
                <Reveal>
                  <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-widest mb-4">
                      Billing & Refunds
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                      Refund <span className="text-brand-cyan italic">Policy</span>
                    </h1>
                    <div className="flex items-center gap-4 text-brand-gray/60 text-xs font-mono uppercase tracking-wider">
                      <span>Last Updated: {lastUpdated}</span>
                      <span className="w-1 h-1 rounded-full bg-brand-gray/30"></span>
                      <span>Version 2.0</span>
                    </div>
                  </div>
                </Reveal>

                <div className="prose prose-invert max-w-none">
                  <Reveal delay={0.1}>
                    <p className="text-lg text-brand-gray leading-relaxed mb-12">
                      At Jawrah Pixel, we strive for absolute client satisfaction. However, due to the nature of digital creative services and the resources allocated to each project, we maintain a clear policy regarding refunds and cancellations.
                    </p>
                  </Reveal>

                  <div className="space-y-16">
                    <section id="eligibility" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">01</span>
                          Eligibility
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          Refund eligibility is determined based on the stage of the project and the type of services rendered. As a digital agency, our primary costs are human expertise and time, which cannot be recovered once spent.
                        </p>
                      </Reveal>
                    </section>

                    <section id="non-refundable" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">02</span>
                          Non-refundable Services
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-4">The following services and fees are strictly non-refundable:</p>
                        <ul className="list-none space-y-4 pl-0 text-brand-gray">
                          <li className="flex gap-4">
                            <span className="text-brand-cyan mt-1.5">•</span>
                            <div>
                              <strong className="text-white block mb-1">Consultation Fees</strong>
                              Fees paid for strategic consultations and expert advice.
                            </div>
                          </li>
                          <li className="flex gap-4">
                            <span className="text-brand-cyan mt-1.5">•</span>
                            <div>
                              <strong className="text-white block mb-1">Discovery & Planning</strong>
                              Initial research, wireframing, and project scoping phases.
                            </div>
                          </li>
                          <li className="flex gap-4">
                            <span className="text-brand-cyan mt-1.5">•</span>
                            <div>
                              <strong className="text-white block mb-1">Completed Work</strong>
                              Any milestone that has been delivered and approved by the Client.
                            </div>
                          </li>
                          <li className="flex gap-4">
                            <span className="text-brand-cyan mt-1.5">•</span>
                            <div>
                              <strong className="text-white block mb-1">Custom Development</strong>
                              Bespoke coding, API integrations, and specialized software development.
                            </div>
                          </li>
                        </ul>
                      </Reveal>
                    </section>

                    <section id="partial-refunds" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">03</span>
                          Partial Refund Situations
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          If a project is cancelled before any design or development work has commenced, a partial refund of the initial deposit may be considered, minus administrative costs and planning fees (typically 25% of the deposit). Once work has started, refunds are not guaranteed and are at the sole discretion of Jawrah Pixel management.
                        </p>
                      </Reveal>
                    </section>

                    <section id="cancellation" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">04</span>
                          Cancellation Policy
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          Clients may cancel their project at any time. Upon cancellation, the Client will be billed for all work completed up to the date of cancellation. For subscription-based maintenance services, cancellations must be requested at least 7 days before the next renewal date.
                        </p>
                      </Reveal>
                    </section>

                    <section id="chargebacks" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">05</span>
                          Chargeback Policy
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          We encourage clients to contact us directly to resolve any billing disputes. Fraudulent chargebacks will result in the immediate suspension of all services, legal action where appropriate, and reporting to relevant credit agencies.
                        </p>
                      </Reveal>
                    </section>

                    <section id="requests" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">06</span>
                          How to Request
                        </h2>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <p className="text-brand-gray leading-relaxed">
                            All refund requests must be submitted in writing to our billing department. Please include your Project ID and a detailed explanation for the request.
                          </p>
                          <div className="pt-4 space-y-2">
                            <p className="text-white font-medium">Billing Department</p>
                            <p className="text-brand-gray text-sm">Email: hello@jawrahpixel.com</p>
                            <p className="text-brand-gray text-sm">Subject: REFUND REQUEST - [Your Project ID]</p>
                          </div>
                        </div>
                      </Reveal>
                    </section>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
