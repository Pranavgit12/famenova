import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 18

export default function BackgroundFX() {
  const glowRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 3
    let tx = x
    let ty = y
    let raf

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }

    const loop = () => {
      x += (tx - x) * 0.09
      y += (ty - y) * 0.09
      glow.style.transform = `translate(${x - 250}px, ${y - 250}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="grid-bg" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />
      <div className="aurora aurora--1" aria-hidden="true" />
      <div className="aurora aurora--2" aria-hidden="true" />
      <div className="aurora aurora--3" aria-hidden="true" />
      <div className="particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <span key={i} style={particleStyle(i)} />
        ))}
      </div>
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />
    </>
  )
}

function particleStyle(i) {
  const rand = mulberry32(i * 7919 + 13)
  const size = 2 + rand() * 3.5
  const duration = 16 + rand() * 22
  const delay = -(rand() * 24)
  const opacity = 0.25 + rand() * 0.45
  return {
    left: `${rand() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    '--po': opacity,
  }
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
