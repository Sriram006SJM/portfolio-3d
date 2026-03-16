import { useEffect, useRef } from 'react'

function computeProgress() {
  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  )
  const totalHeight = docHeight - window.innerHeight
  if (totalHeight <= 0) return 0
  return Math.min(1, Math.max(0, window.scrollY / totalHeight))
}

export function useScrollProgress() {
  const progress = useRef(0)

  useEffect(() => {
    function onScroll() {
      progress.current = computeProgress()
    }

    function onResize() {
      progress.current = computeProgress()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return progress
}
