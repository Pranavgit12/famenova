import { useMemo, useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const W = 440
const H = 320
const padL = 20
const padR = 20
const padT = 46
const padB = 34
const plotW = W - padL - padR
const plotH = H - padT - padB

export default function AnalyticsChart({ data, title, foot, legend = 'Revenue multiple' }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })
  const series = useMemo(() => buildSeries(data), [data])
  const maxV = Math.max(...series)
  const [active, setActive] = useState(series.length - 1)

  const pts = series.map((v, i) => ({
    x: padL + (i / (series.length - 1)) * plotW,
    y: padT + plotH - (v / maxV) * plotH,
    v,
    month: MONTHS[i],
  }))

  const lineD = smooth(pts.map(p => [p.x, p.y]))
  const areaD = `${lineD} L ${pts[pts.length - 1].x} ${padT + plotH} L ${pts[0].x} ${padT + plotH} Z`
  const activePt = pts[active]
  const growth = Math.round((maxV - 1) * 100)

  return (
    <div
      ref={ref}
      className={`analytics-chart reveal${isVisible ? ' visible' : ''}`}
    >
      <div className="ac-glow" aria-hidden="true" />

      <div className="ac-head">
        <div className="ac-label">{title}</div>
        <div className="ac-live" aria-hidden="true"><span></span> Live</div>
      </div>

      <div className="ac-stat">{formatMultiple(maxV)}x</div>
      <div className="ac-growth"><span className="ac-arrow">&#8599;</span>+{growth}% Revenue Growth</div>

      <div className="ac-chart">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="ac-svg"
          role="img"
          aria-label={`${title} chart from 1x to ${formatMultiple(maxV)}x`}
          onMouseLeave={() => setActive(series.length - 1)}
        >
          <defs>
            <linearGradient id="ac-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7ab8ff" />
              <stop offset="100%" stopColor="#4f8cff" />
            </linearGradient>
            <linearGradient id="ac-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#4f8cff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="ac-dot-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#7ab8ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7ab8ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {Array.from({ length: 4 }, (_, k) => {
            const y = padT + (k / 3) * plotH
            return <line key={k} x1={padL} y1={y} x2={W - padR} y2={y} className="ac-grid" />
          })}

          <path d={areaD} className="ac-area" />
          <path d={lineD} pathLength="1" className="ac-line" />

          {pts.map((p, i) => (
            <circle
              key={p.month}
              cx={p.x}
              cy={p.y}
              r={12}
              className="ac-hit"
              onMouseEnter={() => setActive(i)}
            />
          ))}
          {pts.map((p, i) => (
            <circle key={p.month} cx={p.x} cy={p.y} r={3} className="ac-dot" />
          ))}

          <g className="ac-active" transform={`translate(${activePt.x}, ${activePt.y})`}>
            <circle r={20} className="ac-halo" />
            <circle r={7} className="ac-pulse" />
            <circle r={4.5} className="ac-core" />
          </g>

          {pts.map((p, i) => (
            <text key={p.month} x={p.x} y={H - 12} className="ac-x">{p.month}</text>
          ))}
        </svg>

        <div
          className="ac-tooltip"
          style={{ left: `${(activePt.x / W) * 100}%`, top: `${(activePt.y / H) * 100}%` }}
        >
          <div className="ac-tooltip-inner">Revenue x{formatMultiple(activePt.v)}</div>
          <div className="ac-tooltip-caret" />
        </div>
      </div>

      <div className="ac-foot">
        <span>{foot}</span>
        <span className="ac-foot-legend">
          <span className="ac-foot-swatch"></span> {legend}
        </span>
      </div>
    </div>
  )
}

function formatMultiple(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

function buildSeries(anchors) {
  const n = anchors.length
  const out = new Array(12).fill(0)
  if (n < 2) {
    for (let i = 0; i < 12; i++) out[i] = anchors[0] ? anchors[0].value : 1
    return out
  }
  const idx = anchors.map((_, i) => Math.round((i / (n - 1)) * 11))
  for (let i = 0; i < n - 1; i++) {
    const a = anchors[i].value
    const b = anchors[i + 1].value
    const ia = idx[i]
    const ib = idx[i + 1]
    const span = ib - ia || 1
    for (let m = ia; m <= ib; m++) {
      out[m] = a + ((b - a) * (m - ia)) / span
    }
  }
  out[11] = anchors[n - 1].value
  return out
}

function smooth(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`
  }
  return d
}
