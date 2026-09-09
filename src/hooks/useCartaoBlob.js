import { useEffect } from 'react'

// Porta de js/components/cartao-blob.js: o borrão de degradê dos .cartao
// segue o ponteiro via variáveis CSS --gx/--gy. `deps` permite reanexar
// quando novos .cartao aparecem depois da montagem inicial.
export default function useCartaoBlob(deps = []) {
  useEffect(() => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const temHover = window.matchMedia('(hover:hover)').matches
    const cartoes = document.querySelectorAll('.cartao')
    if (!cartoes.length || reduzido || !temHover) return undefined

    function aoMover(e) {
      const c = e.currentTarget
      const r = c.getBoundingClientRect()
      c.style.setProperty('--gx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%')
      c.style.setProperty('--gy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%')
    }
    function aoSair(e) {
      const c = e.currentTarget
      c.style.removeProperty('--gx')
      c.style.removeProperty('--gy')
    }

    cartoes.forEach((c) => {
      c.addEventListener('pointermove', aoMover)
      c.addEventListener('pointerleave', aoSair)
    })
    return () => {
      cartoes.forEach((c) => {
        c.removeEventListener('pointermove', aoMover)
        c.removeEventListener('pointerleave', aoSair)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
