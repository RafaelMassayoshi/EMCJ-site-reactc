import { useEffect, useState } from 'react'

/* Pontinhos de posição para faixas deslizantes no celular (scroll-snap).
   Recebe o ref da faixa e a quantidade de itens; tocar num ponto leva ao
   item. Só aparece onde a faixa existe (o CSS da página esconde no desktop
   via .pontos-faixa). */
export default function PontosFaixa({ alvo, total, rotulo = 'Itens' }) {
  const [atual, setAtual] = useState(0)
  useEffect(() => {
    const el = alvo.current
    if (!el) return undefined
    const medir = () => {
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) { setAtual(0); return }
      setAtual(Math.round((el.scrollLeft / max) * (total - 1)))
    }
    el.addEventListener('scroll', medir, { passive: true })
    medir()
    return () => el.removeEventListener('scroll', medir)
  }, [alvo, total])
  function ir(i) {
    const el = alvo.current
    const filho = el && el.children[i]
    if (filho) el.scrollTo({ left: filho.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || 0), behavior: 'smooth' })
  }
  return (
    <div className="pontos-faixa" role="group" aria-label={rotulo}>
      {Array.from({ length: total }, (_, i) => (
        <button key={i} type="button" className={i === atual ? 'on' : ''} aria-label={`${rotulo}: item ${i + 1} de ${total}`} aria-current={i === atual} onClick={() => ir(i)} />
      ))}
    </div>
  )
}
