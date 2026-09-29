import { useEffect } from 'react'

// Porta da revelação por IntersectionObserver de js/main.js: qualquer
// elemento .rv/.esc presente no documento no momento em que o efeito roda
// ganha a classe "dentro" ao entrar na tela (e só uma vez). `deps` permite
// reobservar elementos que aparecem depois do carregamento inicial da
// página (ex.: cards do blog preenchidos após o fetch da API do WordPress),
// espelhando o EMCJ.observarRevelacao do script original.
export default function useReveal(deps = []) {
  useEffect(() => {
    const alvos = document.querySelectorAll('.rv:not(.dentro), .esc:not(.dentro)')
    if (!alvos.length) return undefined

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido || !('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.classList.add('dentro'))
      return undefined
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('dentro')
            obs.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    alvos.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
