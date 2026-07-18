import useScrollReveal from '../hooks/useScrollReveal'

const SERVICES = [
  {
    icon: '🚀',
    color: 'blue',
    title: 'Paid Advertising',
    outcome: 'Generate targeted leads and customer enquiries through Meta & Google Ads.',
    description:
      'We build high-performance ad funnels that turn your ad spend into predictable profit \u2014 not just clicks, but paying customers.',
    tags: ['Meta Ads', 'Google Ads', 'YouTube', 'Retargeting'],
  },
  {
    icon: '🎬',
    color: 'purple',
    title: 'Short-Form Content',
    outcome: 'Build your brand presence with engaging content that attracts customers.',
    description:
      'We create scroll-stopping Reels, TikToks, and Shorts that position your brand as the go-to choice in your market.',
    tags: ['TikTok', 'Reels', 'Shorts', 'UGC'],
  },
  {
    icon: '📈',
    color: 'green',
    title: 'Lead Generation',
    outcome: 'Turn traffic into booked calls and qualified enquiries on autopilot.',
    description:
      'We set up the funnels, CRM, and automations so every lead is captured, nurtured, and converted \u2014 no lead left behind.',
    tags: ['Funnels', 'CRM Setup', 'Email Flows', 'Automation'],
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <SectionHeader
          label="What We Do"
          title="Services Built for Growth"
          desc="Three core engines working in unison to drive predictable, scalable revenue for your brand."
        />
        <div className="services-grid">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} {...service} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ label, title, desc }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`section-header reveal${isVisible ? ' visible' : ''}`}>
      <div className="section-label">
        <span className="section-label-line"></span> {label}
      </div>
      <h2 className="section-title">{title}</h2>
      <p className="section-desc">{desc}</p>
    </div>
  )
}

function ServiceCard({ icon, color, title, outcome, description, tags, delay }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`service-card reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}>
      <div className={`service-icon ${color}`}>{icon}</div>
      <h3>{title}</h3>
      <p className="service-outcome">{outcome}</p>
      <p>{description}</p>
      <div className="service-tags">
        {tags.map(tag => (
          <span className="service-tag" key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
