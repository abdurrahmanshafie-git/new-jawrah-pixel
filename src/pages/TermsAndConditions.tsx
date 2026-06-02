import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/ui/Reveal';

const SECTIONS = [
  { id: 'acceptance', title: '01. Acceptance of Terms' },
  { id: 'services', title: '02. Services Offered' },
  { id: 'timelines', title: '03. Project Timelines' },
  { id: 'responsibilities', title: '04. Client Responsibilities' },
  { id: 'ip', title: '05. Intellectual Property' },
  { id: 'payments', title: '06. Payments & Invoices' },
  { id: 'revisions', title: '07. Revisions Policy' },
  { id: 'liability', title: '08. Limitation of Liability' },
  { id: 'governing-law', title: '09. Governing Law' },
];

export default function TermsAndConditions() {
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
        title={`Terms & Conditions | Jawrah Pixel`}
        description="Standard terms of service and agreement guidelines for Jawrah Pixel clients and global digital projects."
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
        <div className="container mx-auto px-5 sm:px-6">
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

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-purple/10 to-transparent border border-brand-purple/20">
                    <h4 className="text-white font-display text-xs uppercase tracking-widest mb-2">Legal Notice</h4>
                    <p className="text-brand-gray text-xs leading-relaxed mb-4">By engaging our services, you acknowledge that you have read and agreed to these terms.</p>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-8">
                <Reveal>
                  <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-mono uppercase tracking-widest mb-4">
                      Service Agreement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                      Terms & <span className="text-brand-purple italic">Conditions</span>
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
                      Welcome to Jawrah Pixel. These Terms and Conditions govern your use of our website and the delivery of our premium digital services. By accessing our platform or commissioning a project, you agree to be bound by these terms.
                    </p>
                  </Reveal>

                  <div className="space-y-16">
                    <section id="acceptance" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">01</span>
                          Acceptance of Terms
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          By using the services provided by Jawrah Pixel ("we", "us", or "our"), you ("Client") agree to these Terms and Conditions. If you do not agree, please refrain from using our services. These terms apply to all projects, including web design, development, branding, and e-commerce solutions.
                        </p>
                      </Reveal>
                    </section>

                    <section id="services" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">02</span>
                          Services Offered
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="text-white font-medium mb-2">Web Design & Development</h3>
                            <p className="text-brand-gray text-sm">Custom-built, high-performance websites and enterprise-grade web applications.</p>
                          </div>
                          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="text-white font-medium mb-2">Branding & Identity</h3>
                            <p className="text-brand-gray text-sm">Comprehensive visual identity systems and strategic brand positioning.</p>
                          </div>
                          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="text-white font-medium mb-2">E-Commerce Solutions</h3>
                            <p className="text-brand-gray text-sm">Scalable online stores optimized for conversion and seamless user experience.</p>
                          </div>
                          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="text-white font-medium mb-2">AI & Systems</h3>
                            <p className="text-brand-gray text-sm">Integration of intelligent systems and automated workflows for digital efficiency.</p>
                          </div>
                        </div>
                      </Reveal>
                    </section>

                    <section id="timelines" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">03</span>
                          Project Timelines
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          Project timelines are estimated based on the scope of work. While we strive for punctuality, timelines may be adjusted due to feedback delays, scope changes, or technical complexities. We will communicate any adjustments promptly through your client dashboard.
                        </p>
                      </Reveal>
                    </section>

                    <section id="responsibilities" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">04</span>
                          Client Responsibilities
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-4">To ensure project success, the Client agrees to:</p>
                        <ul className="list-none space-y-3 pl-0 text-brand-gray">
                          <li className="flex gap-4"><span className="text-brand-purple">•</span> Provide necessary brand assets, content, and information in a timely manner.</li>
                          <li className="flex gap-4"><span className="text-brand-purple">•</span> Appoint a single point of contact for feedback and approvals.</li>
                          <li className="flex gap-4"><span className="text-brand-purple">•</span> Review and provide feedback on deliverables within the agreed timeframe.</li>
                        </ul>
                      </Reveal>
                    </section>

                    <section id="ip" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">05</span>
                          Intellectual Property
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          Upon full payment of all project invoices, Jawrah Pixel transfers the intellectual property rights of the final deliverables to the Client. We retain the right to showcase the work in our portfolio and marketing materials unless a non-disclosure agreement (NDA) is in place.
                        </p>
                      </Reveal>
                    </section>

                    <section id="payments" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">06</span>
                          Payments & Invoices
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-6">
                          Payments are structured based on project milestones. Invoices must be settled within the timeframe specified on the invoice. Failure to make timely payments may result in service suspension. All payments are processed securely through our authorized payment gateways.
                        </p>
                      </Reveal>
                    </section>

                    <section id="revisions" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">07</span>
                          Revisions Policy
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          Each project includes a specific number of revision rounds as outlined in the proposal. Additional revisions or major scope changes requested after approval will be billed at our standard hourly rate or as a separate add-on.
                        </p>
                      </Reveal>
                    </section>

                    <section id="liability" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">08</span>
                          Limitation of Liability
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          Jawrah Pixel shall not be held liable for any indirect, incidental, special, or consequential damages, including loss of profits, data, or business opportunities, arising from the use of our services or website.
                        </p>
                      </Reveal>
                    </section>

                    <section id="governing-law" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">09</span>
                          Governing Law
                        </h2>
                        <p className="text-brand-gray leading-relaxed">
                          These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Jawrah Pixel operates, without regard to its conflict of law provisions.
                        </p>
                      </Reveal>
                    </section>

                    <section id="contact" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-purple/40 text-sm font-mono tracking-tighter">10</span>
                          Contact Information
                        </h2>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <p className="text-brand-gray">For any questions regarding these terms, please contact us:</p>
                          <div className="space-y-2">
                            <p className="text-white font-medium">Jawrah Pixel</p>
                            <p className="text-brand-gray text-sm">Email: hello@jawrahpixel.com</p>
                            <p className="text-brand-gray text-sm">Website: https://www.jawrahpixel.com</p>
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
