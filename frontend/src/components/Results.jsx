import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import useAnimatedCounter from '../hooks/useAnimatedCounter'

const STATS = [
  { target: 3.5, suffix: 'x', label: 'Average ROI' },
  { target: 10, suffix: 'M+', label: 'Views Generated' },
  { target: 150, suffix: '+', label: 'Brands Scaled' },
  { target: 8.4, prefix: '$', suffix: 'M+', label: 'Revenue Driven' },
]

const CASE_STUDIES = [
  {
    mediaLabel: 'Video Testimonial',
    videoSrc: '/videos/skincare.mp4',
    title: 'E-Commerce Brand \u2014 Skincare',
    description:
      'Scaled from $4K to $82K/month in 90 days through Meta Ads and UGC-driven content strategy.',
    metrics: [
      { value: '5.2x', label: 'ROAS' },
      { value: '$78K', label: 'Monthly Rev' },
      { value: '90 Days', label: 'Timeline' },
    ],
  },
  {
    mediaLabel: 'Screenshots & Results',
    videoSrc: '/videos/cafe.mp4',
    title: 'Local Service Business \u2014 CAFE',
    description:
      'Reduced cost per lead by 68% and generated 340+ qualified leads per month through Google Ads + landing page optimization.',
    metrics: [
      { value: '-68%', label: 'Cost/Lead' },
      { value: '340+', label: 'Leads/Month' },
      { value: '4.8x', label: 'ROAS' },
    ],
  },
]

export default function Results() {
  return (
    <section className="results" id="results">
      <div className="container">
        <SectionHeader
          label="Our Track Record"
          title="Results That Speak for Themselves"
          desc="We let the numbers do the talking. Every campaign is measured, optimized, and scaled relentlessly."
        />

        <div className="results-grid">
          {STATS.map((stat, i) => (
            <ResultStat key={stat.label} {...stat} delay={i + 1} />
          ))}
        </div>

        <div className="case-studies">
          {CASE_STUDIES.map((cs, i) => (
            <CaseCard key={cs.title} {...cs} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ResultStat({ target, prefix, suffix, label, delay }) {
  const { ref, value } = useAnimatedCounter(target, { prefix, suffix })
  const { ref: revealRef, isVisible } = useScrollReveal()

  return (
    <div
      ref={node => {
        ref.current = node
        revealRef.current = node
      }}
      className={`result-stat reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}
    >
      <div className="result-stat-value">{value}</div>
      <div className="result-stat-label">{label}</div>
    </div>
  )
}

function CaseCard({ mediaLabel, videoSrc, title, description, metrics, delay }) {
  const { ref, isVisible } = useScrollReveal()
  const [playing, setPlaying] = useState(false)

  return (
    <div ref={ref} className={`case-card reveal${isVisible ? ' visible' : ''} reveal-delay-${delay}`}>
      <div
        className={`case-card-media${videoSrc ? ' has-video' : ''}`}
        onClick={videoSrc && !playing ? () => setPlaying(true) : undefined}
        style={videoSrc ? { cursor: 'pointer' } : undefined}
      >
        {playing && videoSrc ? (
          <video
            className="case-card-video"
            src={videoSrc}
            autoPlay
            controls
            playsInline
          />
        ) : videoSrc ? (
          <div className="case-card-media-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{mediaLabel}</span>
          </div>
        ) : (
          <div className="case-card-media-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{mediaLabel}</span>
          </div>
        )}
        <div className="case-card-overlay"></div>
      </div>
      <div className="case-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="case-card-metrics">
          {metrics.map(m => (
            <div className="case-metric" key={m.label}>
              <span className="case-metric-value">{m.value}</span>
              <span className="case-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
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
