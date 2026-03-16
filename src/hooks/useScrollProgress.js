import { useEffect, useRef } from 'react'

export function useScrollProgress() {
  const progress = useRef(0)

  useEffect(() => {
    const totalHeight = document.body.scrollHeight - window.innerHeight

    function onScroll() {
      progress.current = window.scrollY / totalHeight
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return progress
}
