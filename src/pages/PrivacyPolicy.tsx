import { motion } from 'motion/react';
import { useRegion } from '@/hooks/useRegion';
import { SEO } from '@/components/layout/SEO';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/ui/Reveal';

const SECTIONS = [
  { id: 'collection', title: '01. Information Collection' },
  { id: 'use', title: '02. How We Use Information' },
  { id: 'protection', title: '03. Data Protection' },
  { id: 'third-party', title: '04. Third Party Services' },
  { id: 'cookies', title: '05. Cookies & Tracking' },
  { id: 'rights', title: '06. Your Rights' },
  { id: 'contact', title: '07. Contact Us' },
];

export default function PrivacyPolicy() {
  const { config, p, isInternational } = useRegion();
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
        title={`Privacy Policy | Jawrah Pixel`}
        description="Privacy standards and data protection policies for Jawrah Pixel clients and global digital projects."
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

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-cyan/10 to-transparent border border-brand-cyan/20">
                    <h4 className="text-white font-display text-xs uppercase tracking-widest mb-2">Need Help?</h4>
                    <p className="text-brand-gray text-xs leading-relaxed mb-4">If you have any questions regarding our privacy practices, please contact our legal team.</p>
                    <a href="mailto:hello@jawrahpixel.com" className="text-brand-cyan text-xs font-medium hover:underline">hello@jawrahpixel.com</a>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-8">
                <Reveal>
                  <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-mono uppercase tracking-widest mb-4">
                      Legal Documentation
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6">
                      Privacy <span className="text-brand-cyan italic">Policy</span>
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
                      At Jawrah Pixel, your privacy is a cornerstone of our premium service. This Privacy Policy explains how we collect, protect, and handle your data across our global digital ecosystem, ensuring transparency and security for every client.
                    </p>
                  </Reveal>

                  <div className="space-y-16">
                    <section id="collection" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">01</span>
                          Information We Collect
                        </h2>
                        <div className="space-y-6 text-brand-gray leading-relaxed">
                          <p>We collect information that helps us deliver high-end digital solutions. This is categorized into:</p>
                          <ul className="list-none space-y-4 pl-0">
                            <li className="flex gap-4">
                              <span className="text-brand-cyan mt-1.5">•</span>
                              <div>
                                <strong className="text-white block mb-1">Personal Information</strong>
                                Name, email address, phone number, and professional role provided during account creation or inquiries.
                              </div>
                            </li>
                            <li className="flex gap-4">
                              <span className="text-brand-cyan mt-1.5">•</span>
                              <div>
                                <strong className="text-white block mb-1">Project Information</strong>
                                Business goals, requirements, brand assets, and technical specifications shared during consultations.
                              </div>
                            </li>
                            <li className="flex gap-4">
                              <span className="text-brand-cyan mt-1.5">•</span>
                              <div>
                                <strong className="text-white block mb-1">Payment Information</strong>
                                Transaction records and billing details. We do not store full credit card numbers; these are processed securely by our payment partners (e.g., PayHere, Stripe).
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Reveal>
                    </section>

                    <section id="use" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">02</span>
                          How We Use Information
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-6">
                          Your data is utilized exclusively to enhance your experience and deliver excellence:
                        </p>
                        <ul className="list-none space-y-4 pl-0 text-brand-gray">
                          <li className="flex gap-4"><span className="text-brand-cyan">•</span> To manage your client workspace and project milestones.</li>
                          <li className="flex gap-4"><span className="text-brand-cyan">•</span> To communicate critical project updates and administrative notices.</li>
                          <li className="flex gap-4"><span className="text-brand-cyan">•</span> To personalize the platform based on your region and preferences.</li>
                          <li className="flex gap-4"><span className="text-brand-cyan">•</span> To ensure the security and integrity of our digital services.</li>
                        </ul>
                      </Reveal>
                    </section>

                    <section id="protection" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">03</span>
                          Data Protection
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-6">
                          We employ enterprise-grade security protocols to safeguard your assets. This includes end-to-end encryption for sensitive data, secure cloud infrastructure via Supabase/Vercel, and strict internal access controls. Your data is stored for as long as necessary to fulfill the purposes outlined or as required by law.
                        </p>
                      </Reveal>
                    </section>

                    <section id="third-party" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">04</span>
                          Third Party Services
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-6">
                          We may engage trusted third-party partners to facilitate our services (e.g., payment processors, hosting providers, analytics). These partners are contractually obligated to protect your data and are prohibited from using it for any other purpose.
                        </p>
                      </Reveal>
                    </section>

                    <section id="cookies" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">05</span>
                          Cookies & Tracking
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-6">
                          Our website uses cookies and similar technologies to analyze traffic, remember your preferences (like region settings), and optimize performance. You can manage cookie settings through your browser, though some features may be limited.
                        </p>
                      </Reveal>
                    </section>

                    <section id="rights" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">06</span>
                          Your Rights
                        </h2>
                        <p className="text-brand-gray leading-relaxed mb-6">
                          You have the right to access, correct, or request the deletion of your personal data. You may also object to processing or request data portability. To exercise these rights, please reach out to us via the contact details provided below.
                        </p>
                      </Reveal>
                    </section>

                    <section id="contact" className="scroll-mt-32">
                      <Reveal>
                        <h2 className="text-2xl text-white font-display mb-6 flex items-center gap-4">
                          <span className="text-brand-cyan/40 text-sm font-mono tracking-tighter">07</span>
                          Contact Information
                        </h2>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <p className="text-brand-gray">For any inquiries regarding this policy, please contact:</p>
                          <div className="space-y-2">
                            <p className="text-white font-medium">Jawrah Pixel Legal Department</p>
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
