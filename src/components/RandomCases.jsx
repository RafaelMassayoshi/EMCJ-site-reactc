import { useEffect, useRef, useState } from 'react'
import useMedia from '../hooks/useMedia.js'
import PontosFaixa from './PontosFaixa.jsx'

/* ==========================================================================
   Blocos da seção Cases da página Pesquisa clínica (Random).
   - EsteiraFunis: cartões padronizados em esteira lenta (pausa no hover).
   - TeiaDepoimentos: depoimentos em balões espalhados, ligados a um centro
     por fios, como uma teia de pensamentos.
   - EstudosAcordeao: cinco painéis lado a lado; o painel ativo se abre com
     uma animação própria do case (sem barra de rolagem).
   - AreasPiscando: etiquetas de áreas terapêuticas que acendem ao acaso
     enquanto a página rola.
   Estilos em styles/random/pesquisa-clinica-v7.css.
   ========================================================================== */

/* ---------------- Funis ---------------- */
export function EsteiraFunis({ funis }) {
  const cartao = (c, oculto) => (
    <article className={'funil7 funil7--' + c.tom} tabIndex={oculto ? -1 : 0}>
      <div className="funil7-topo">
        <span className="funil7-area">{c.area}</span>
        <h3>{c.titulo}</h3>
        <p className="funil7-sub">{c.subtitulo || '\u00a0'}</p>
      </div>
      <p className="funil7-destaque">{c.destaque}<span>{c.destaqueR}</span></p>
      <dl className="funil7-linhas">
        {c.linhas.map(([dt, dd]) => <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>)}
      </dl>
      <p className="funil7-leitura">{c.leitura}</p>
    </article>
  )
  return (
    <div className="esteira7 rv" role="region" aria-label="Funis de recrutamento">
      <div className="esteira7-fita esteira7-fita--funis">
        {[0, 1].map((k) => (
          <ul className="esteira7-grupo" key={k} aria-hidden={k === 1}>
            {funis.map((c) => <li key={c.titulo}>{cartao(c, k === 1)}</li>)}
          </ul>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Depoimentos em teia ---------------- */
/* posição de cada balão (em % da área) e giro; o fio sai do centro */
const TEIA = [
  { l: 0, t: 2, w: 31, r: -2.5 },
  { l: 67, t: 0, w: 31, r: 2 },
  { l: 69, t: 57, w: 30, r: -1.5 },
  { l: 1, t: 58, w: 30, r: 2.5 },
  { l: 35, t: 72, w: 30, r: -1 },
]
const CENTRO = { x: 50, y: 42 }

export function TeiaDepoimentos({ depoimentos, logo }) {
  const [foco, setFoco] = useState(null)
  return (
    <div className="teia rv">
      <svg className="teia-fios" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {depoimentos.map((d, i) => {
          const p = TEIA[i % TEIA.length]
          const x = p.l + p.w / 2
          const y = p.t + 12
          const mx = (CENTRO.x + x) / 2 + (i % 2 ? 6 : -6)
          return <path key={d.nome} className={foco === i ? 'on' : ''} d={`M${CENTRO.x} ${CENTRO.y} Q${mx} ${(CENTRO.y + y) / 2} ${x} ${y}`} vectorEffect="non-scaling-stroke" />
        })}
      </svg>

      <div className="teia-centro" aria-hidden="true">{logo}</div>

      {depoimentos.map((d, i) => {
        const p = TEIA[i % TEIA.length]
        return (
          <figure key={d.nome} className={'balao' + (foco === i ? ' on' : '')}
            style={{ '--l': p.l + '%', '--t': p.t + '%', '--w': p.w + '%', '--r': p.r + 'deg', '--i': i }}
            onMouseEnter={() => setFoco(i)} onMouseLeave={() => setFoco(null)}
            onFocus={() => setFoco(i)} onBlur={() => setFoco(null)} tabIndex={0}>
            <blockquote>{d.destaque}</blockquote>
            <figcaption><b>{d.nome}</b><span>{d.cargo}</span></figcaption>
          </figure>
        )
      })}
    </div>
  )
}

/* ---------------- Estudos de caso ---------------- */
/* Animação própria de cada case, desenhada em código (SVG + CSS). */
function Animacao({ tipo }) {
  if (tipo === 'asma') {
    return (
      <svg viewBox="0 0 200 160" className="anim anim--asma" aria-hidden="true">
        <path className="traqueia" d="M100 18v44M100 62c-8 6-18 10-26 18M100 62c8 6 18 10 26 18" />
        <g className="pulmoes">
          <path d="M92 58c-30 2-52 30-52 64 0 16 8 22 20 20 20-3 32-18 32-42z" />
          <path d="M108 58c30 2 52 30 52 64 0 16-8 22-20 20-20-3-32-18-32-42z" />
        </g>
        {[0, 1, 2, 3].map((k) => <circle key={k} className="ar" cx={78 + k * 14} cy="150" r="3" style={{ '--k': k }} />)}
      </svg>
    )
  }
  if (tipo === 'enxaqueca') {
    return (
      <svg viewBox="0 0 200 160" className="anim anim--enxaqueca" aria-hidden="true">
        <path className="cabeca" d="M78 138v-20c-16-8-26-26-26-44 0-30 24-52 54-52 28 0 50 20 50 48 0 10-4 18-10 24l8 14-12 4v14c0 8-6 12-14 12h-14v10" />
        {[0, 1, 2].map((k) => <circle key={k} className="onda" cx="112" cy="66" r="12" style={{ '--k': k }} />)}
        <circle className="foco" cx="112" cy="66" r="7" />
      </svg>
    )
  }
  if (tipo === 'cardio') {
    return (
      <svg viewBox="0 0 200 160" className="anim anim--cardio" aria-hidden="true">
        <path className="coracao" d="M100 128c-40-26-58-48-58-70 0-16 12-28 28-28 12 0 22 8 30 18 8-10 18-18 30-18 16 0 28 12 28 28 0 22-18 44-58 70z" />
        <path className="ecg" d="M10 92h46l10-24 14 52 12-40 8 12h90" />
      </svg>
    )
  }
  if (tipo === 'metabolico') {
    return (
      <svg viewBox="0 0 200 160" className="anim anim--metabolico" aria-hidden="true">
        <g className="molecula">
          <polygon points="100,44 128,60 128,92 100,108 72,92 72,60" />
          <line x1="128" y1="60" x2="156" y2="44" /><circle cx="160" cy="42" r="7" />
          <line x1="72" y1="92" x2="44" y2="108" /><circle cx="40" cy="110" r="7" />
          <line x1="100" y1="108" x2="100" y2="136" /><circle cx="100" cy="140" r="7" />
        </g>
        <path className="gota" d="M100 60c10 12 16 20 16 28a16 16 0 0 1-32 0c0-8 6-16 16-28z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 200 160" className="anim anim--funil" aria-hidden="true">
      <path className="funil-forma" d="M36 24h128l-46 58v44l-36 14V82z" />
      {[0, 1, 2, 3, 4].map((k) => <circle key={k} className="gota-funil" cx={60 + k * 20} cy="14" r="4" style={{ '--k': k }} />)}
      <text x="100" y="62" textAnchor="middle" className="funil-num">16%</text>
    </svg>
  )
}
const ANIM = ['asma', 'enxaqueca', 'cardio', 'metabolico', 'funil']

export function EstudosAcordeao({ casos, funis }) {
  const [ativo, setAtivo] = useState(0)
  const celular = useMedia('(max-width: 900px)')
  const faixaRef = useRef(null)
  return (
    <>
    <div className="acord rv" ref={faixaRef}>
      {casos.map((c, i) => {
        const f = funis[c.funil]
        const aberto = ativo === i
        return (
          <article key={c.t} className={'acord-item acord-item--' + f.tom + (aberto ? ' aberto' : '')}
            onMouseEnter={() => setAtivo(i)}>
            <button type="button" className="acord-gatilho" aria-expanded={aberto} onClick={() => setAtivo(i)} onFocus={() => setAtivo(i)}>
              <span className="acord-vertical">{c.tag}</span>
            </button>
            <div className="acord-corpo">
              <div className="acord-arte"><Animacao tipo={ANIM[i % ANIM.length]} /></div>
              <p className="acord-tag">{c.tag}</p>
              <h4>{c.t}</h4>
              <p className="acord-texto">{c.p}</p>
              <p className="acord-num"><b>{f.destaque}</b> {f.destaqueR}</p>
            </div>
          </article>
        )
      })}
    </div>
    {celular && <PontosFaixa alvo={faixaRef} total={casos.length} rotulo="Estudos de caso" />}
    </>
  )
}

/* ---------------- Áreas terapêuticas piscando na rolagem ---------------- */
export function AreasPiscando({ areas }) {
  const caixaRef = useRef(null)
  useEffect(() => {
    const caixa = caixaRef.current
    if (!caixa || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const tags = Array.from(caixa.querySelectorAll('.area7'))
    let visivel = false
    let ultimo = 0
    let anterior = -1
    let quadro = null
    const ob = new IntersectionObserver((es) => { visivel = es[0].isIntersecting }, { threshold: 0 })
    ob.observe(caixa)
    /* uma etiqueta por vez, em ordem aleatória: acende uma, depois a
       seguinte, enquanto houver rolagem */
    function acende() {
      quadro = null
      const agora = performance.now()
      if (!visivel || agora - ultimo < 320) return
      ultimo = agora
      let k = Math.floor(Math.random() * tags.length)
      if (k === anterior) k = (k + 1) % tags.length
      if (anterior >= 0) tags[anterior].classList.remove('pisca')
      anterior = k
      const el = tags[k]
      void el.offsetWidth
      el.classList.add('pisca')
    }
    function aoRolar() { if (!quadro) quadro = requestAnimationFrame(acende) }
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      ob.disconnect()
      window.removeEventListener('scroll', aoRolar)
      if (quadro) cancelAnimationFrame(quadro)
    }
  }, [])
  return (
    <div className="areas7 rv" ref={caixaRef}>
      {areas.map((a) => <span className="area7" key={a}>{a}</span>)}
    </div>
  )
}
