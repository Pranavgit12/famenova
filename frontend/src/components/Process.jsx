import useScrollReveal from '../hooks/useScrollReveal'

const STEPS = [
  { num: '01', title: 'Discovery', desc: 'Deep-dive audit of your brand, audience, competitors, and current performance metrics.' },
  { num: '02', title: 'Strategy', desc: 'Custom growth roadmap: ad creatives, content pillars, funnel architecture, and KPIs.' },
  { num: '03', title: 'Execution', desc: 'Rapid deployment of campaigns, content, and infrastructure. Data-driven iteration from day one.' },
  { num: '04', title: 'Scaling', desc: 'Systematic scaling of winning campaigns and creatives to maximize revenue and minimize waste.' },
]

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="container">
        <SectionHeader
          label="How We Work"
          title="Our Proven Methodology"
          desc="A battle-tested framework that removes the guesswork and delivers predictable results."
        />
        <div className="process-grid">
          {STEPS.map((step, i) => (
            <ProcessStep key={step.num} {...step} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessStep({ num, title, desc, delay }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`process-step reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}>
      <div className="process-step-number"><span>{num}</span></div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
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
