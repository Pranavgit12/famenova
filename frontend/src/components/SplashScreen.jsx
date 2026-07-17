import { useState, useEffect } from 'react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('exit'), 2200)
    const timer2 = setTimeout(() => onComplete(), 3000)
    return () => { clearTimeout(timer1); clearTimeout(timer2) }
  }, [onComplete])

  const letters = 'FAMENOVA'.split('')

  return (
    <div className={`splash-screen ${phase}`}>
      <div className="splash-content">
        <div className="splash-letters">
          {letters.map((letter, i) => (
            <span
              key={i}
              className="splash-letter"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="splash-line" />
        <p className="splash-tagline">Scale Your Brand</p>
      </div>
    </div>
  )
}
