import useScrollReveal from '../hooks/useScrollReveal'

const CASE_STUDIES = [
  {
    featured: true,
    title: 'Cafe Growth — Before & After',
    subtitle: 'Local Restaurant & Cafe',
    description:
      'A sample campaign concept showing how strategic reels, targeted ads, and consistent content can completely transform a local cafe\'s digital presence and drive real customer enquiries.',
    before: {
      label: 'Before',
      points: ['1k followers', 'Low engagement', 'No online enquiries'],
    },
    after: {
      label: 'After',
      points: ['Better reels', 'More enquiries', 'More customers'],
    },
    metrics: [
      { value: '5x', label: 'Followers' },
      { value: '3x', label: 'Engagement' },
      { value: '40+', label: 'Enquiries/Mo' },
    ],
  },
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

function CaseCard({ featured, title, subtitle, description, before, after, metrics, delay }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`cs-card reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}${featured ? ' cs-card--featured' : ''}`}
    >
      {featured && (
        <div className="cs-card-badge">Featured Case Study</div>
      )}

      <div className="cs-card-header">
        <h3>{title}</h3>
        <span className="cs-card-subtitle">{subtitle}</span>
      </div>

      {featured && before && after && (
        <div className="cs-card-before-after">
          <div className="cs-card-ba-col cs-card-ba-col--before">
            <div className="cs-card-ba-label">{before.label}</div>
            <ul>
              {before.points.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div className="cs-card-ba-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div className="cs-card-ba-col cs-card-ba-col--after">
            <div className="cs-card-ba-label">{after.label}</div>
            <ul>
              {after.points.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>
      )}

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
