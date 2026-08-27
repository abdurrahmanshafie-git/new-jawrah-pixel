import { CheckCircle2, Image, ShoppingBag, Smartphone, Sparkles } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';

const experienceAreas = [
  {
    title: 'Editorial storefront entry',
    what: 'The homepage leads with ZENVOR, The Zenith Series, premium modern streetwear positioning, and an Acquire Pieces action.',
    why: 'A fashion brand needs to communicate its point of view before asking a visitor to browse products.',
    benefit: 'The customer understands the mood, material direction, and collection context before entering the shop.',
    seo: 'The visible brand, streetwear, luxury essentials, and collection language establishes topical relevance for fashion searches.',
  },
  {
    title: 'Product presentation',
    what: 'The public homepage surfaces named products including Zenith Mountain Tee / Black, Zenith Mountain Tee / White, Enso Circular Tee / Black, and Enso Circular Tee / Navy.',
    why: 'Product-led discovery shortens the distance between brand story and a concrete item.',
    benefit: 'Visitors can move directly from campaign content into a specific product route.',
    seo: 'Descriptive product names and individual product URLs create a foundation for product-intent discovery.',
  },
  {
    title: 'Collection and archive paths',
    what: 'The site links to New Drops, The Studio, Archive, Shop, Collections, and Lookbook destinations.',
    why: 'A premium catalogue benefits from multiple browsing modes: current releases, editorial context, and older work.',
    benefit: 'Different customer intents have a clear starting point without forcing every visitor through one page.',
    seo: 'Distinct collection and editorial routes can support category, collection, and brand-search intent when indexable.',
  },
  {
    title: 'Commerce reassurance',
    what: 'The public homepage states islandwide delivery in 2-4 working days, secure checkout, WhatsApp support, and 7-day fit exchange support.',
    why: 'Fashion shoppers need delivery, support, and fit reassurance before committing to a purchase.',
    benefit: 'The information reduces uncertainty around fulfilment and post-purchase fit concerns.',
    seo: 'Shipping and exchange language adds useful commerce context around Sri Lankan fashion shopping intent.',
  },
  {
    title: 'Account and wishlist surfaces',
    what: 'The public site exposes login and wishlist destinations in its additional links.',
    why: 'Account and wishlist patterns are relevant to returning shoppers and product consideration.',
    benefit: 'They provide a visible foundation for repeat visits and saved-product behaviour.',
    seo: 'These surfaces are useful UX signals, although their underlying behaviour was not independently verified in the crawl.',
  },
  {
    title: 'Studio and manifesto content',
    what: 'The brand explains its philosophy through lines such as “Where form follows silence” and links to a Manifesto.',
    why: 'Premium fashion is bought through meaning and identity as well as product utility.',
    benefit: 'The editorial layer differentiates Zenvor from a generic product grid.',
    seo: 'Original brand language supports branded and non-transactional searches around modern streetwear and luxury essentials.',
  },
  {
    title: 'Support and policy navigation',
    what: 'The footer links to Order Tracking, FAQ, Shipping Info, Returns & Exchanges, Privacy, and Terms.',
    why: 'Customers need answers around fulfilment, policies, and order support before and after purchase.',
    benefit: 'Policy discovery is kept close to the shopping experience instead of hidden away.',
    seo: 'Clear policy destinations improve semantic completeness and can reduce ambiguity for crawlers and shoppers.',
  },
  {
    title: 'Mobile commerce direction',
    what: 'The project is presented as a responsive storefront with direct product, support, and collection actions; the public crawl does not provide a reliable device-by-device audit.',
    why: 'Sri Lankan fashion shoppers may discover products on mobile before deciding whether to purchase.',
    benefit: 'Short routes to product and WhatsApp support are appropriate for high-intent mobile sessions.',
    seo: 'Mobile-first content hierarchy is important for product discovery, but measured mobile performance is not claimed here.',
  },
];

const funnel = [
  ['Landing', 'The homepage establishes Zenvor as premium modern streetwear and presents the active Zenith Series.'],
  ['Browse', 'Visitors can follow Shop, Collections, New Drops, The Studio, Archive, or Lookbook routes exposed by the public site.'],
  ['Product', 'Visible product cards name specific tees, fabric weights such as 450 GSM and 300 GSM, fit descriptions, prices, and S/M/L/XL size options.'],
  ['Consideration', 'Account, wishlist, FAQ, shipping, returns, order tracking, WhatsApp support, and fit exchange messaging address common purchase questions.'],
  ['Checkout', 'The site publicly references secure checkout and a protected order flow, but the crawl did not verify the full cart, payment, or order-completion sequence.'],
  ['Purchase and support', 'Islandwide delivery, WhatsApp support, and a 7-day fit exchange message are visible service assurances; sales or purchase results are not supplied.'],
];

const faq = [
  ['What type of project is Zenvor?', 'Zenvor is presented as a premium modern streetwear and luxury essentials e-commerce experience for the Sri Lankan market.'],
  ['What products are visible on the public site?', 'The homepage exposes Zenith Mountain Tee / Black, Zenith Mountain Tee / White, Enso Circular Tee / Black, and Enso Circular Tee / Navy product routes.'],
  ['Are prices visible?', 'Yes. The public homepage shows LKR 4,500.00 for the Zenith Mountain Tee variants and LKR 4,200.00 for the Enso Circular Tee variants shown in the crawl.'],
  ['Are sizes visible?', 'The crawled product cards show S, M, L, and XL choices. Product-level variant behaviour was not independently tested.'],
  ['Does Zenvor support Sri Lankan delivery?', 'The homepage states islandwide delivery in 2-4 working days across Sri Lanka.'],
  ['Does the site offer support?', 'Yes. The public site exposes WhatsApp support and lists the number +94 78 475 7411.'],
  ['Are wishlist and account features present?', 'Login and wishlist destinations are publicly exposed. The underlying authenticated behaviour was not verified in this review.'],
  ['Was a payment gateway verified?', 'No. The public site references secure checkout, but a specific gateway or payment integration is not claimed.'],
  ['What technology powers Zenvor?', 'The public review does not reliably verify the underlying framework, database, hosting, commerce engine, or integrations.'],
  ['Are sales or conversion results available?', 'No sales, revenue, customer, traffic, ranking, conversion, or performance metrics were supplied or independently verified.'],
];

export function ZenvorCaseStudy() {
  return (
    <>
      <section className="mb-32 border-y theme-border py-20 sm:py-28">
        <Reveal className="mb-14 max-w-4xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Verified project analysis</span>
          <h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">Luxury essentials, given a digital silhouette.</h2>
          <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed theme-text-muted">Zenvor is a premium modern streetwear storefront built around heavyweight cotton, architectural silhouettes, quiet confidence, and limited collection language. Jawrah Pixel&apos;s credited delivery turns that positioning into an editorial commerce experience with direct product discovery and visible support reassurance.</p>
        </Reveal>
        <StaggerContainer className="grid gap-px border theme-border sm:grid-cols-3">
          {[
            [Sparkles, 'Premium streetwear', 'The brand positions itself around luxury essentials, heavyweight fabric, sharp proportion, and cinematic restraint.'],
            [ShoppingBag, 'Product-led discovery', 'Named products, prices, fabric weights, fit descriptions, and size options are visible from the public storefront crawl.'],
            [Image, 'Editorial commerce', 'Manifesto, studio, lookbook, collection, and archive routes let the brand story sit beside the shop journey.'],
          ].map(([Icon, title, copy]) => {
            const IconComponent = Icon as typeof Sparkles;
            return <StaggerItem key={String(title)} className="theme-bg p-7 sm:p-9"><IconComponent className="mb-7 text-brand-blue" size={22} /><h3 className="text-xl font-display uppercase theme-text-primary">{title}</h3><p className="mt-4 text-sm leading-relaxed theme-text-muted">{copy}</p></StaggerItem>;
          })}
        </StaggerContainer>
      </section>

      <section className="mb-32">
        <Reveal className="mb-14 max-w-3xl"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Product experience</span><h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">A storefront built around considered choice.</h2><p className="mt-7 leading-relaxed theme-text-muted">The public crawl verifies product-led entry points and commerce reassurance. It does not verify every interaction behind the linked account, wishlist, checkout, or policy routes, so those boundaries remain explicit below.</p></Reveal>
        <div className="grid gap-5 lg:grid-cols-2">{experienceAreas.map((area, index) => <Reveal key={area.title} delay={index * 0.03} className="border theme-border theme-card p-7 sm:p-9"><div className="flex items-start gap-5"><span className="font-mono text-sm text-brand-blue">{String(index + 1).padStart(2, '0')}</span><div><h3 className="text-xl font-display uppercase theme-text-primary">{area.title}</h3><p className="mt-5 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">What it is:</strong> {area.what}</p><p className="mt-3 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">Why it exists:</strong> {area.why}</p><p className="mt-3 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">UX benefit:</strong> {area.benefit}</p><p className="mt-3 text-sm leading-relaxed theme-text-secondary"><strong className="theme-text-primary">SEO value:</strong> {area.seo}</p></div></div></Reveal>)}</div>
      </section>

      <section className="mb-32 grid gap-14 border-b theme-border pb-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
        <Reveal><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Conversion funnel</span><h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">From campaign mood to purchase intent.</h2></Reveal>
        <div className="space-y-5">{funnel.map(([title, copy], index) => <Reveal key={title} delay={index * 0.04} className="flex gap-5 border-b theme-border pb-5"><span className="font-mono text-sm text-brand-blue">0{index + 1}</span><div><h3 className="font-display uppercase theme-text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed theme-text-muted">{copy}</p></div></Reveal>)}</div>
      </section>

      <section className="mb-32 grid gap-5 md:grid-cols-2">
        <Reveal className="border theme-border theme-card p-8 sm:p-10"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-blue">SEO implementation</span><h2 className="mt-5 text-3xl font-display uppercase theme-text-primary">Search-ready commerce foundations.</h2><ul className="mt-8 space-y-4">{['Descriptive product names and individual product routes are visible in the public homepage crawl.', 'Shop, collections, archive, studio, manifesto, lookbook, FAQ, shipping, returns, and tracking destinations create a meaningful information hierarchy.', 'Product cards expose commercial details such as LKR pricing, fabric weight, fit, and sizes.', 'Image-heavy fashion presentation needs careful alt text, dimensions, compression, lazy loading, and Core Web Vitals measurement.', 'No rankings, traffic, sales, conversion, structured-data coverage, or measured performance results are claimed without verification.'].map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed theme-text-muted"><CheckCircle2 className="mt-0.5 shrink-0 text-brand-blue" size={16} />{item}</li>)}</ul></Reveal>
        <Reveal className="border theme-border theme-card p-8 sm:p-10"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-blue">Mobile commerce</span><h2 className="mt-5 text-3xl font-display uppercase theme-text-primary">Small-screen confidence matters.</h2><p className="mt-8 text-sm leading-relaxed theme-text-muted">The visible product-first structure, short collection routes, WhatsApp support, delivery promise, and fit-exchange reassurance are appropriate building blocks for mobile shoppers. A complete device audit, tap-target review, checkout test, and measured mobile performance report still require direct browser testing or source access.</p><Smartphone className="mt-8 text-brand-blue" size={24} /></Reveal>
      </section>

      <section className="mb-32">
        <Reveal className="mb-12 max-w-3xl"><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">Project FAQ</span><h2 className="mt-5 text-4xl font-display uppercase theme-text-primary sm:text-6xl">Questions worth answering.</h2></Reveal>
        <div className="grid gap-4 md:grid-cols-2">{faq.map(([question, answer]) => <Reveal key={question} className="border theme-border theme-card p-7"><h3 className="flex gap-3 text-lg font-display uppercase theme-text-primary"><span className="text-brand-blue">+</span>{question}</h3><p className="mt-4 text-sm leading-relaxed theme-text-muted">{answer}</p></Reveal>)}</div>
      </section>
    </>
  );
}
