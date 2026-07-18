import useScrollReveal from '../hooks/useScrollReveal'

const INDUSTRIES = [
  { icon: '🍽', name: 'Restaurants & Cafes' },
  { icon: '🏥', name: 'Clinics' },
  { icon: '🏋', name: 'Gyms' },
  { icon: '🏠', name: 'Real Estate' },
  { icon: '💇', name: 'Salons' },
  { icon: '🛍', name: 'Local Businesses' },
]

export default function Industries() {
  return (
    <section className="industries" id="industries">
      <div className="container">
        <SectionHeader
          label="Who We Help"
          title="Industries We Serve"
          desc="We work with businesses that are ready to grow. Whether you're a local shop or a scaling brand, we understand your market."
        />
        <div className="industries-grid">
          {INDUSTRIES.map((industry, i) => (
            <IndustryCard key={industry.name} {...industry} delay={i + 1} />
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

function IndustryCard({ icon, name, delay }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`industry-card reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}>
      <div className="industry-icon">{icon}</div>
      <h3>{name}</h3>
    </div>
  )
}
