import useScrollReveal from '../hooks/useScrollReveal'

const SERVICES = [
  {
    icon: '🚀',
    color: 'blue',
    title: 'Paid Advertising',
    description:
      'Meta Ads, Google Ads, and YouTube campaigns engineered for maximum ROAS. We build data-driven funnels that turn ad spend into profit.',
    tags: ['Meta Ads', 'Google Ads', 'YouTube', 'Retargeting'],
  },
  {
    icon: '🎬',
    color: 'purple',
    title: 'Short-Form Content',
    description:
      'Viral TikToks, Reels, and Shorts that stop the scroll. We create thumb-stopping content that builds brand authority and drives organic reach.',
    tags: ['TikTok', 'Reels', 'Shorts', 'UGC'],
  },
  {
    icon: '📈',
    color: 'green',
    title: 'Lead Generation',
    description:
      'End-to-end lead capture infrastructure: landing pages, CRM integration, automated follow-ups, and conversion optimization.',
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

function ServiceCard({ icon, color, title, description, tags, delay }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`service-card reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}>
      <div className={`service-icon ${color}`}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="service-tags">
        {tags.map(tag => (
          <span className="service-tag" key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
