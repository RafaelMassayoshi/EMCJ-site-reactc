import { useState, useRef } from 'react'

/* Componente genérico do "trilho": tablist com lista à esquerda e painel à
   direita, usado em O que fazemos ("as sete frentes") e Varejo ("os cinco
   recortes") — porta 1:1 de js/components/trilho.js (troca por clique/
   teclado com Home/End, e no mobile rola o item escolhido para a vista). */
export default function Trilho({ id, ariaLabel, items }) {
  const [ativo, setAtivo] = useState(0)
  const botoesRef = useRef([])

  function abrir(i, focar) {
    setAtivo(i)
    if (focar) {
      const btn = botoesRef.current[i]
      if (btn) {
        btn.focus()
        const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduzido ? 'auto' : 'smooth' })
      }
    }
  }

  function aoTeclado(e, i) {
    let d = 0
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') d = 1
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') d = -1
    else if (e.key === 'Home') {
      e.preventDefault()
      abrir(0, true)
      return
    } else if (e.key === 'End') {
      e.preventDefault()
      abrir(items.length - 1, true)
      return
    }
    if (!d) return
    e.preventDefault()
    abrir((i + d + items.length) % items.length, true)
  }

  return (
    <div className="trilho rv" id={id}>
      <div className="trilho-vias" role="tablist" aria-label={ariaLabel}>
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => (botoesRef.current[i] = el)}
            className="via-btn"
            type="button"
            role="tab"
            id={'vb' + (i + 1)}
            aria-controls={'vp' + (i + 1)}
            aria-selected={ativo === i}
            onClick={() => abrir(i, false)}
            onKeyDown={(e) => aoTeclado(e, i)}
          >
            <span className="via-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="via-t">{item.titulo}</span>
          </button>
        ))}
      </div>

      <div className="trilho-palco">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="via-painel"
            role="tabpanel"
            id={'vp' + (i + 1)}
            aria-labelledby={'vb' + (i + 1)}
            hidden={ativo !== i}
          >
            {item.conteudo}
          </article>
        ))}
      </div>
    </div>
  )
}
