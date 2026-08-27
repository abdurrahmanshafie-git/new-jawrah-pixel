import { ArrowRight, CheckCircle2, Search, Smartphone, Users } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

const experienceAreas = [
  {
    title: 'Header and navigation',
    what: 'A compact navigation system linking Home, About Us, Why Singapore, Courses, Check Status, Contact, and Book Consultation.',
    why: 'It gives students and families direct access to the main research and enquiry paths.',
    benefit: 'The clear hierarchy reduces the effort required to move from inspiration to action.',
    seo: 'Descriptive page destinations create a crawlable information architecture around education intent.',
  },
  {
    title: 'Singapore-focused hero',
    what: 'The opening message positions Elite Education as a Singapore higher-education specialist in Sri Lanka.',
    why: 'Students need immediate confirmation that the consultancy understands their destination and context.',
    benefit: 'The destination and service proposition are understood before the user scrolls.',
    seo: 'The visible heading and supporting copy naturally target study-in-Singapore and Sri Lankan student searches.',
  },
  {
    title: 'Opportunity and trust signals',
    what: 'The homepage presents 10+ years of education expertise, 50+ global study pathways, and transparent student support.',
    why: 'Education decisions carry high perceived risk and require reassurance early in the journey.',
    benefit: 'Students and parents receive credibility cues before entering the course or enquiry flows.',
    seo: 'Specific service language gives search engines context about the consultancy and its audience.',
  },
  {
    title: 'Course catalog',
    what: 'The Courses page exposes 385 qualifications with category and qualification filters, program cards, details, and Apply actions.',
    why: 'A broad catalog needs structure so users can narrow options without relying on a sales conversation first.',
    benefit: 'Students can compare pathways and move from a broad search to a specific program.',
    seo: 'Indexable course themes, qualification names, and category language support long-tail education discovery.',
  },
  {
    title: 'Student journey section',
    what: 'The site explains Discover, Select, Achieve, and Arrive as the four stages from first conversation to first day abroad.',
    why: 'A staged process makes an unfamiliar overseas application feel more understandable.',
    benefit: 'The journey clarifies what support is expected at each point.',
    seo: 'Process-led headings reinforce admissions, application, visa, and arrival-related search themes.',
  },
  {
    title: 'Direct inquiry form',
    what: 'The contact flow asks for name, email, WhatsApp mobile, preferred field of study, and counselling question or target intake.',
    why: 'Those fields give an advisor enough context to respond to a student-specific request.',
    benefit: 'The enquiry begins with useful context instead of a generic message.',
    seo: 'The surrounding copy adds semantic relevance for course selection, admissions, and counselling intent.',
  },
  {
    title: 'Contact and support information',
    what: 'The site publishes email contacts, WhatsApp, telephone, Akurana/Kandy service location, support hours, and online counselling availability.',
    why: 'Students and families need a clear way to verify how and when to reach the consultancy.',
    benefit: 'Multiple contact modes support different levels of urgency and preference.',
    seo: 'Consistent business and location information supports local discoverability for Sri Lankan searches.',
  },
  {
    title: 'Footer authority layer',
    what: 'The footer repeats education service signals, accreditation references, social channels, and the Jawrah Pixel design and development credit.',
    why: 'The footer gives users a final trust and navigation checkpoint after the main content.',
    benefit: 'Important proof and contact routes remain available at the end of every page.',
    seo: 'Repeated, relevant service language and linked destinations strengthen site-wide topical context.',
  },
];

const journey = [
  ['Discovery', 'A student arrives for Singapore education guidance and sees the destination, audience, and support proposition immediately.'],
  ['Orientation', 'The student reviews why Singapore, study benefits, institution context, and the four-stage support journey.'],
  ['Course discovery', 'The catalog provides filters, qualification types, course cards, program details, and Apply actions.'],
  ['Enquiry', 'The student can submit a preferred field, target intake, and counselling question with direct WhatsApp support available.'],
  ['Follow-up', 'The published promise is that an expert advisor will call or reply on WhatsApp within three business hours. This is a stated service promise, not an independently measured result.'],
];

const faq = [
  ['What type of website did Jawrah Pixel deliver?', 'The live project is a Singapore-focused education consultancy website with destination content, a course catalog, enquiry pathways, contact information, and student journey guidance.'],
  ['Who is the website for?', 'The content is aimed at Sri Lankan students and families exploring higher-education pathways in Singapore.'],
  ['Can users browse courses?', 'Yes. The live Courses page presents a catalog of 385 qualifications with filters, program cards, details, and Apply actions.'],
  ['What information does the enquiry form collect?', 'It requests a full name, email, WhatsApp mobile number, preferred field of study, and a counselling question or target intake.'],
  ['Does the public site verify a student portal?', 'The navigation references Check Application Status and the site has a Student Portal link in its additional links, but the supplied check-status URL currently returns a Page Not Found page. A working secure portal should not be claimed from this review.'],
  ['Which technologies power the website?', 'The public website review confirms the rendered experience, but it does not reliably verify the underlying framework, hosting stack, database, or third-party services. Those should be documented only from source or deployment records.'],
  ['Are performance results available?', 'No measured Lighthouse, Core Web Vitals, traffic, ranking, or conversion results were supplied or independently verified for this case study.'],
  ['What SEO themes does the project support?', 'The information architecture naturally supports themes such as study in Singapore, Singapore education consultants in Sri Lanka, Singapore courses, student visa assistance, private college admissions, and international education guidance.'],
];

export function EliteEducationCaseStudy() {
  return (
    <>
      <section className="mb-32 border-y theme-border py-20 sm:py-28">
        <Reveal className="mb-14 max-w-4xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Verified project analysis</span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">A clearer route to global education.</h2>
          <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed theme-text-muted">Elite Education Sri Lanka is presented as a Singapore higher-education specialist. Jawrah Pixel&apos;s credited delivery gives the consultancy a structured digital destination for explaining opportunities, organizing course discovery, and collecting qualified student enquiries.</p>
        </Reveal>
        <StaggerContainer className="grid gap-px border theme-border sm:grid-cols-3">
          {[
            [Search, '385 qualifications', 'The live catalog states 385 qualifications across diploma, degree, postgraduate, master&apos;s, and PhD categories.'],
            [Users, 'Four journey stages', 'Discover, Select, Achieve, and Arrive explain the support model from first conversation to arrival.'],
            [Smartphone, 'Direct enquiry path', 'Students can submit study preferences and target intake details, with WhatsApp support presented alongside the form.'],
          ].map(([Icon, title, copy]) => {
            const IconComponent = Icon as typeof Search;
            return <StaggerItem key={String(title)} className="theme-bg p-7 sm:p-9"><IconComponent className="mb-7 text-brand-blue" size={22} /><h3 className="text-xl font-display uppercase theme-text-primary">{title}</h3><p className="mt-4 text-sm leading-relaxed theme-text-muted">{copy}</p></StaggerItem>;
          })}
        </StaggerContainer>
      </section>

      <section className="mb-32">
        <Reveal className="mb-14 max-w-3xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Website experience</span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">Every section has a job.</h2>
          <p className="mt-7 leading-relaxed theme-text-muted">The following analysis is based on the publicly visible website experience. It describes observable UX and SEO intent without claiming private administration, backend, or performance mechanisms that are not exposed by the live project.</p>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          {experienceAreas.map((area, index) => <Reveal key={area.title} delay={index * 0.03} className="border theme-border theme-card p-7 sm:p-9"><div className="flex items-start gap-5"><span className="font-mono text-sm text-brand-blue">{String(index + 1).padStart(2, '0')}</span><div><h3 className="text-xl font-display uppercase theme-text-primary">{area.title}</h3><p className="mt-5 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">What it is:</strong> {area.what}</p><p className="mt-3 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">Why it exists:</strong> {area.why}</p><p className="mt-3 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">UX benefit:</strong> {area.benefit}</p><p className="mt-3 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">SEO value:</strong> {area.seo}</p></div></div></Reveal>)}
        </div>
      </section>

      <section className="mb-32 grid gap-14 border-b theme-border pb-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
        <Reveal><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Student journey</span><h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">From question to consultation.</h2></Reveal>
        <div className="space-y-5">{journey.map(([title, copy], index) => <Reveal key={title} delay={index * 0.04} className="flex gap-5 border-b theme-border pb-5"><span className="font-mono text-sm text-brand-blue">0{index + 1}</span><div><h3 className="font-display uppercase theme-text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed theme-text-muted">{copy}</p></div></Reveal>)}</div>
      </section>

      <section className="mb-32 grid gap-5 md:grid-cols-2">
        <Reveal className="border theme-border theme-card p-8 sm:p-10"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-blue">SEO and technical evidence</span><h2 className="mt-5 text-3xl font-display uppercase theme-text-primary">What can be verified.</h2><ul className="mt-8 space-y-4">{['Singapore-focused page hierarchy and descriptive navigation.', 'Course catalog content structured around qualification and study intent.', 'Visible headings, supporting copy, internal links, and enquiry CTAs.', 'Public robots.txt and sitemap coverage should be checked after deployment.', 'No rankings, traffic, Core Web Vitals, or conversion results are claimed here.'].map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed theme-text-muted"><CheckCircle2 className="mt-0.5 shrink-0 text-brand-blue" size={16} />{item}</li>)}</ul></Reveal>
        <Reveal className="border theme-border theme-card p-8 sm:p-10"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-blue">Scope boundaries</span><h2 className="mt-5 text-3xl font-display uppercase theme-text-primary">Evidence over theatre.</h2><p className="mt-8 text-sm leading-relaxed theme-text-muted">The live review verifies the visible website and its stated content. It does not verify authentication, authorization, private storage, signed URLs, database security, rate limiting, framework choice, hosting, analytics, or administrative workflow. Those are intentionally excluded from the claimed delivery scope until source or deployment evidence is available.</p></Reveal>
      </section>

      <section className="mb-32">
        <Reveal className="mb-12 max-w-3xl"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Project FAQ</span><h2 className="mt-5 text-4xl font-display uppercase theme-text-primary sm:text-6xl">Questions worth answering.</h2></Reveal>
        <div className="grid gap-4 md:grid-cols-2">{faq.map(([question, answer]) => <Reveal key={question} className="border theme-border theme-card p-7"><h3 className="flex gap-3 text-lg font-display uppercase theme-text-primary"><span className="text-brand-blue">+</span>{question}</h3><p className="mt-4 text-sm leading-relaxed theme-text-muted">{answer}</p></Reveal>)}</div>
      </section>
    </>
  );
}
