import { useEffect, useRef, useState } from 'react'

export default function useAnimatedCounter(target, { prefix = '', suffix = '', duration = 1500 } = {}) {
  const [value, setValue] = useState(prefix + '0' + suffix)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animate()
          observer.unobserve(element)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [target, prefix, suffix, duration])

  function animate() {
    const start = performance.now()
    const isFloat = target % 1 !== 0

    function update(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = (target * eased).toFixed(isFloat ? 1 : 0)
      setValue(prefix + current + suffix)
      if (progress < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }

  return { ref, value }
}
