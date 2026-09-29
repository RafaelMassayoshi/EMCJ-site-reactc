import { useEffect } from 'react'

// Porta 1:1 do trecho "Rolagem" de js/main.js: barra de progresso (#barra),
// nav sólida ao rolar (.nav#nav) e o parallax do brilho/vertentes do hero
// (#heroBrilho/#vertentes) quando existirem na página atual. Como o Header
// fica montado a app inteira, este hook roda uma única vez; os elementos de
// hero são buscados a cada tick de scroll (querySelector, como no original)
// porque trocam de página para página.
export default function useCoreScrollEffects() {
  useEffect(() => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const solto = window.matchMedia('(max-width:900px)')
    let tick = false

    function aoRolar() {
      const barra = document.getElementById('barra')
      const nav = document.getElementById('nav')
      const brilho = document.getElementById('heroBrilho')
      const verts = document.getElementById('vertentes')

      const y = window.scrollY || 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barra) barra.style.width = (max > 0 ? (y / max) * 100 : 0) + '%'
      if (nav) nav.classList.toggle('solida', y > 60)
      if (!reduzido && !solto.matches && y < window.innerHeight * 1.3) {
        if (brilho) brilho.style.transform = 'translateY(calc(-50% + ' + y * 0.12 + 'px))'
        if (verts) verts.style.transform = 'translateY(calc(-50% + ' + y * -0.05 + 'px))'
      }
      tick = false
    }

    function aoRolarThrottled() {
      if (!tick) {
        window.requestAnimationFrame(aoRolar)
        tick = true
      }
    }

    window.addEventListener('scroll', aoRolarThrottled, { passive: true })
    aoRolar()

    return () => window.removeEventListener('scroll', aoRolarThrottled)
  }, [])
}
