import { useEffect, useState } from 'react'

// true enquanto a media query casar (ex.: '(max-width: 900px)'); atualiza
// quando a tela muda de tamanho ou gira.
export default function useMedia(query) {
  const [casa, setCasa] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const ao = () => setCasa(mq.matches)
    ao()
    mq.addEventListener('change', ao)
    return () => mq.removeEventListener('change', ao)
  }, [query])
  return casa
}
