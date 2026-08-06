import useScrollReveal from '../hooks/useScrollReveal'
import useAnimatedCounter from '../hooks/useAnimatedCounter'
import AnalyticsChart from './AnalyticsChart'

const CAFE_CASE = {
  title: 'How FameNova Helped a Local Café Triple Its Sales',
  client: 'Local Café (Name withheld for privacy)',
  industry: 'Food & Beverage',
  duration: '3 Months',
  services: [
    'Website Development',
    'Social Media Marketing',
    'Branding',
    'Meta Ads',
    'Local SEO',
  ],
  challenge:
    'When the café partnered with FameNova, it was struggling to attract consistent customers. Although the food and service were good, the business lacked a strong online presence.',
  challenges: [
    'Outdated or no professional website',
    'Low social media engagement',
    'Minimal brand recognition',
    'Very few online inquiries',
    'Limited repeat customers',
    'Low daily sales',
  ],
  goal: 'The owner wanted to increase foot traffic, improve online visibility, and grow monthly revenue.',
  strategy: [
    {
      title: 'Website',
      icon: 'globe',
      points: [
        'Designed a fast, mobile-friendly website',
        'Added an easy-to-view digital menu',
        'Integrated WhatsApp for instant inquiries',
        'Optimized the site for local search',
      ],
    },
    {
      title: 'Social Media',
      icon: 'spark',
      points: [
        'Created a consistent content calendar',
        'Produced high-quality photos & short videos',
        'Published engaging Instagram & Facebook posts',
        'Highlighted customer experiences & popular menu items',
      ],
    },
    {
      title: 'Local Marketing',
      icon: 'pin',
      points: [
        'Optimized Google Business Profile',
        'Improved local SEO',
        'Encouraged customer reviews',
        'Updated business info across online platforms',
      ],
    },
    {
      title: 'Paid Advertising',
      icon: 'target',
      points: [
        'Launched targeted Meta ad campaigns',
        'Focused on customers within the local area',
        'Promoted special offers & seasonal campaigns',
      ],
    },
  ],
  growth: [
    { label: 'Month 1', value: 1, tag: 'Before' },
    { label: 'Month 2', value: 2, tag: '' },
    { label: 'Month 3', value: 3, tag: 'After' },
  ],
  stats: [
    { target: 3, suffix: 'x', label: 'Sales Growth' },
    { target: 90, suffix: ' days', label: 'To Results' },
    { target: 6, suffix: '+', label: 'Growth Channels' },
    { target: 5, suffix: '', label: 'Services Delivered' },
  ],
  impact: [
    '3× increase in sales',
    'More walk-in customers',
    'Higher engagement on social media',
    'Increased inquiries through WhatsApp',
    'More positive Google reviews',
    'Stronger online visibility',
  ],
  beforeAfter: [
    ['Low daily sales', '3× increase in sales'],
    ['Weak online presence', 'Professional digital brand'],
    ['Inconsistent customer flow', 'Steady stream of new customers'],
    ['Limited social engagement', 'Active and growing community'],
    ['No clear digital strategy', 'Multi-channel marketing system'],
  ],
  testimonial:
    "Working with FameNova completely changed our business. Our online presence improved, more customers started visiting our café, and our sales grew beyond what we expected. The team understood our goals and delivered real results.",
  testimonialSource: 'Café Owner, Local Café',
  ctaText:
    'Whether you own a café, restaurant, gym, salon, clinic, or local business, FameNova can help you build a stronger online presence and generate more customers.',
  chart: {
    title: 'Sales Growth — 3 Months',
    foot: 'Sales index',
    legend: 'Revenue multiple',
  },
  takeaways: [
    'The right combination of branding, website optimization, social media marketing, local SEO, and targeted advertising drives real growth.',
    'Even a local café can achieve remarkable growth with a strong digital growth system.',
    "We don't just build websites — we build systems that help businesses attract more customers and grow sustainably.",
  ],
}

const REAL_ESTATE_CASE = {
  title: 'How FameNova Helped a Real Estate Company Generate More Qualified Leads',
  client: 'ABC Realty (Name withheld for privacy)',
  industry: 'Real Estate',
  duration: '6 Months',
  services: [
    'Website Development',
    'Meta Ads',
    'Google Ads',
    'Landing Page Optimization',
    'Lead Generation',
    'CRM Integration',
  ],
  challenge:
    'ABC Realty had quality residential and commercial properties, but most inquiries came through referrals. Their digital presence was weak, resulting in inconsistent lead generation.',
  challenges: [
    'Outdated website',
    'Low-quality leads',
    'Few monthly property inquiries',
    'Poor social media presence',
    'No structured digital marketing strategy',
    'Low conversion from visitors to inquiries',
  ],
  goal: 'The goal was to build a reliable system for generating qualified buyer and investor leads.',
  strategy: [
    {
      title: 'Website & Landing Pages',
      icon: 'globe',
      points: [
        'Designed a modern, mobile-friendly real estate website',
        'Created dedicated landing pages for each project',
        'Added inquiry forms and WhatsApp integration',
        'Improved website speed and user experience',
      ],
    },
    {
      title: 'Lead Generation',
      icon: 'target',
      points: [
        'Launched targeted Meta Ads',
        'Ran Google Search campaigns for high-intent buyers',
        'Retargeted previous website visitors',
        'Focused on local audiences interested in buying property',
      ],
    },
    {
      title: 'Social Media Marketing',
      icon: 'spark',
      points: [
        'Posted property walkthrough videos',
        'Created carousel posts showcasing amenities',
        'Shared customer testimonials',
        'Highlighted new project launches',
      ],
    },
    {
      title: 'Conversion Optimization',
      icon: 'pin',
      points: [
        'Connected leads to the CRM',
        'Automated follow-up messages',
        'Simplified the inquiry process',
        'Improved landing page conversion rates',
      ],
    },
  ],
  growth: [
    { label: 'Month 1', value: 1, tag: 'Before' },
    { label: 'Month 3', value: 1.5, tag: '' },
    { label: 'Month 6', value: 2, tag: 'After' },
  ],
  stats: [
    { target: 2, suffix: 'x', label: 'Sales Growth' },
    { target: 8, prefix: '₹', suffix: '–10L', label: 'Avg Monthly Revenue' },
    { target: 6, suffix: ' months', label: 'To Results' },
    { target: 6, suffix: '+', label: 'Growth Channels' },
  ],
  impact: [
    '2× sales growth',
    '₹8–10 lakh average monthly revenue',
    '2× increase in qualified leads',
    'Higher inquiry volume',
    'Lower cost per lead',
    'More property site visits scheduled',
  ],
  beforeAfter: [
    ['Few monthly inquiries', '2× more qualified leads'],
    ['Outdated website', 'Modern conversion-focused website'],
    ['Manual lead tracking', 'Automated lead management'],
    ['Weak online presence', 'Strong digital brand'],
    ['Low conversion rate', 'Higher inquiry conversion'],
  ],
  testimonial:
    'FameNova transformed our digital presence. The new website, targeted advertising, and lead generation strategy helped us attract more serious buyers and significantly increased qualified inquiries.',
  testimonialSource: 'ABC Realty, Real Estate Developer',
  ctaText:
    "Whether you're a real estate developer, broker, or property consultant, FameNova can help you generate more qualified leads, improve your online presence, and grow your business.",
  chart: {
    title: 'Sales Growth — 6 Months',
    foot: 'Sales index',
    legend: 'Lead growth multiple',
  },
  takeaways: [
    'Combining high-converting website design, performance marketing, landing page optimization, and local targeting creates a repeatable system for attracting potential buyers.',
    'Instead of relying only on referrals, a structured digital strategy generates consistent qualified leads.',
    "We don't just build websites — we build systems that help businesses attract more customers and grow sustainably.",
  ],
}

const FEATURED_CASES = [CAFE_CASE, REAL_ESTATE_CASE]

const CASE_STUDIES = [
  {
    title: 'E-Commerce Brand — Skincare',
    subtitle: 'D2C Skincare Brand',
    description:
      'Scaled from $4K to $82K/month in 90 days through Meta Ads and UGC-driven content strategy.',
    metrics: [
      { value: '5.2x', label: 'ROAS' },
      { value: '$82K', label: 'Monthly Rev' },
      { value: '90 Days', label: 'Timeline' },
    ],
  },
  {
    title: 'Local Service Business',
    subtitle: 'Home Services Company',
    description:
      'Reduced cost per lead by 68% and generated 340+ qualified leads per month through Google Ads and landing page optimization.',
    metrics: [
      { value: '-68%', label: 'Cost/Lead' },
      { value: '340+', label: 'Leads/Month' },
      { value: '4.8x', label: 'ROAS' },
    ],
  },
]

export default function CaseStudies() {
  return (
    <section className="case-studies-section" id="case-studies">
      <div className="container">
        <SectionHeader />
        {FEATURED_CASES.map((data, i) => (
          <FeaturedCaseStudy
            key={data.title}
            data={data}
            badge={i === 0 ? 'Featured Case Study' : 'Case Study'}
          />
        ))}
        <div className="case-studies-grid">
          {CASE_STUDIES.map((cs, i) => (
            <CaseCard key={cs.title} {...cs} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeader() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`section-header reveal${isVisible ? ' visible' : ''}`}>
      <div className="section-label">
        <span className="section-label-line"></span> Case Studies
      </div>
      <h2 className="section-title">Real Results, Real Businesses</h2>
      <p className="section-desc">
        We let our work do the talking. Here's how we've helped businesses like yours grow.
      </p>
    </div>
  )
}

function FeaturedCaseStudy({ data, badge }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 })

  return (
    <div
      ref={ref}
      className={`cs-detail reveal${isVisible ? ' visible' : ''}`}
    >
      <div className="cs-detail-badge">{badge}</div>

      <div className="cs-detail-head">
        <div className="cs-detail-head-info">
          <h3 className="cs-detail-title">{data.title}</h3>
          <p className="cs-detail-subtitle">
            {data.client} · {data.industry} · {data.duration}
          </p>
        </div>
        <ul className="cs-detail-chips">
          {data.services.map(s => <li key={s}>{s}</li>)}
        </ul>
      </div>

      <div className="cs-detail-cols cs-detail-cols--intro">
        <div className="cs-block">
          <h4 className="cs-block-title">
            <span className="cs-block-icon cs-block-icon--red"></span> The Challenge
          </h4>
          <p className="cs-block-text">{data.challenge}</p>
          <ul className="cs-block-list">
            {data.challenges.map(c => <li key={c}>{c}</li>)}
          </ul>
          <p className="cs-block-goal">{data.goal}</p>
        </div>
        <div className="cs-block">
          <h4 className="cs-block-title">
            <span className="cs-block-icon cs-block-icon--emerald"></span> Results at a Glance
          </h4>
          <div className="cs-stats">
            {data.stats.map((stat, i) => (
              <CsStat key={stat.label} {...stat} delay={i + 1} />
            ))}
          </div>
        </div>
      </div>

      <div className="cs-block">
        <h4 className="cs-block-title">
          <span className="cs-block-icon cs-block-icon--indigo"></span> Our Strategy
        </h4>
        <div className="cs-strategy-grid">
          {data.strategy.map(s => (
            <div className="cs-strategy-card" key={s.title}>
              <div className="cs-strategy-head">
                <span className="cs-strategy-icon">{STRATEGY_ICONS[s.icon]}</span>
                <span className="cs-strategy-title">{s.title}</span>
              </div>
              <ul className="cs-strategy-list">
                {s.points.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="cs-visual-row">
        <AnalyticsChart data={data.growth} {...data.chart} />
      </div>

      <div className="cs-detail-cols">
        <div className="cs-block">
          <h4 className="cs-block-title">
            <span className="cs-block-icon cs-block-icon--emerald"></span> Business Impact
          </h4>
          <ul className="cs-impact-list">
            {data.impact.map(i => (
              <li key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="cs-block">
          <h4 className="cs-block-title">
            <span className="cs-block-icon cs-block-icon--indigo"></span> Before vs After
          </h4>
          <div className="cs-ba-table">
            <div className="cs-ba-row cs-ba-row--head">
              <span>Before</span>
              <span>After</span>
            </div>
            {data.beforeAfter.map(([before, after]) => (
              <div className="cs-ba-row" key={before}>
                <span className="cs-ba-before">{before}</span>
                <span className="cs-ba-after">{after}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <blockquote className="cs-testimonial">
        <svg className="cs-testimonial-quote" viewBox="0 0 24 24" fill="currentColor"><path d="M9.583 17.321C8.553 16.227 8 15 8 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm-8 0C.553 16.227 0 15 0 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C6.409 11.678 7.831 13.159 7.831 15a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>
        <p>{data.testimonial}</p>
        <footer>— {data.testimonialSource}</footer>
      </blockquote>

      <div className="cs-takeaways">
        <h4 className="cs-block-title">
          <span className="cs-block-icon cs-block-icon--emerald"></span> Key Takeaways
        </h4>
        <ul>
          {data.takeaways.map(t => (
            <li key={t}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="cs-cta">
        <h4>Ready to Grow Your Business?</h4>
        <p>{data.ctaText}</p>
        <a className="cs-cta-btn" href="#booking">
          Book Your Free Strategy Call
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  )
}

function CsStat({ target, suffix, label, delay }) {
  const { ref, value } = useAnimatedCounter(target, { suffix })
  const { ref: revealRef, isVisible } = useScrollReveal()

  return (
    <div
      ref={node => {
        ref.current = node
        revealRef.current = node
      }}
      className={`cs-stat reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}
    >
      <div className="cs-stat-value">{value}</div>
      <div className="cs-stat-label">{label}</div>
    </div>
  )
}

const STRATEGY_ICONS = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
}

function CaseCard({ title, subtitle, description, metrics, delay }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`cs-card reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}
    >
      <div className="cs-card-header">
        <h3>{title}</h3>
        <span className="cs-card-subtitle">{subtitle}</span>
      </div>

      <p className="cs-card-desc">{description}</p>

      <div className="cs-card-metrics">
        {metrics.map(m => (
          <div className="cs-card-metric" key={m.label}>
            <span className="cs-card-metric-value">{m.value}</span>
            <span className="cs-card-metric-label">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
