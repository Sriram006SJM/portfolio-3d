import { useEffect, useRef } from 'react'

export function useScrollProgress() {
  const progress = useRef(0)

  useEffect(() => {
    function onScroll() {
      const totalHeight = document.body.scrollHeight - window.innerHeight
      progress.current = Math.min(1, Math.max(0, window.scrollY / totalHeight))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return progress
}
