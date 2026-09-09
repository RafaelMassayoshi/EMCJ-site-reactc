import { useEffect, useRef } from 'react'

/* Contador que sobe de zero ao entrar na tela, uma vez só — porta do padrão
   repetido em js/pages/home.js (#metrica) e js/pages/varejo.js (.cnt).
   Com movimento reduzido, mostra direto o valor final. */
export default function CountUp({
  as: Tag = 'span',
  className,
  alvo,
  dec = 0,
  prefixo = '',
  sufixo = '',
  sep = false,
  duracao = 1500,
  threshold = 0.5,
  style,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    function formatar(v) {
      let s = v.toFixed(dec)
      if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      else if (dec > 0) s = s.replace('.', ',')
      return prefixo + s + sufixo
    }

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido) {
      el.textContent = formatar(alvo)
      return undefined
    }

    el.textContent = formatar(0)

    if (!('IntersectionObserver' in window)) {
      el.textContent = formatar(alvo)
      return undefined
    }

    let quadro = null
    function conta() {
      let ini = null
      function passo(t) {
        if (ini === null) ini = t
        const p = Math.min((t - ini) / duracao, 1)
        el.textContent = formatar(alvo * (1 - Math.pow(1 - p, 3)))
        if (p < 1) quadro = requestAnimationFrame(passo)
      }
      quadro = requestAnimationFrame(passo)
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return
          obs.unobserve(e.target)
          conta()
        })
      },
      { threshold },
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      if (quadro) cancelAnimationFrame(quadro)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Tag ref={ref} className={className} style={style} data-alvo={alvo} />
}
