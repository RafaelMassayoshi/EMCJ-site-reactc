import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/* ==========================================================================
   Vitrine de cases da página Pesquisa clínica (Random): uma "mesa"
   bagunçada de janelas vivas.

   Cada trabalho é uma janela com o conteúdo real carregado (portal na home,
   landing page, PDF no leitor do Drive, vídeo, reel num celular), espalhada
   em ângulos diferentes e sobreposta. Interações:
   - arrastar pela barra da janela reposiciona e traz para a frente;
   - o primeiro clique no conteúdo "ativa" a janela (antes disso, rolar a
     página por cima dela não fica preso dentro do site embutido);
   - ⤢ abre o trabalho em tela cheia; ↗ abre em nova aba.
   Os iframes só carregam quando a mesa se aproxima da tela.
   Portais e reel são renderizados no tamanho real (1280 px / 360 px) e
   reduzidos por escala, então aparecem como a pessoa veria no navegador.
   Abaixo de 900 px a mesa vira uma pilha levemente torta, sem arrastar.
   Dados: VITRINE em pesquisa-clinica-dados.js. Estilos: pesquisa-clinica-v7.css
   (prefixos .mesa / .janela / .visor7).
   ========================================================================== */

const TIPO = {
  site: { rot: 'Portal', base: [1280, 800] },
  lp: { rot: 'Landing page', base: [1280, 800] },
  plano: { rot: 'Plano de campanha' },
  apres: { rot: 'Apresentação' },
  video: { rot: 'Vídeo' },
  reel: { rot: 'Reel', base: [360, 640] },
}

/* posição na mesa (desktop): left/top em % da mesa, largura em %, giro em graus */
const LAYOUT = {
  onconecta: { l: 0, t: 2, w: 44, r: -3 },
  asma: { l: 48, t: 0, w: 45, r: 2.5 },
  'brtrials-depressao': { l: 21, t: 33, w: 40, r: -1.5 },
  'plano-1': { l: -1, t: 41, w: 25, r: 4 },
  'plano-2': { l: 55, t: 38, w: 25, r: -3.5 },
  reel: { l: 81, t: 33, w: 19, r: 3 },
  apres: { l: 3, t: 69, w: 34, r: -2 },
  'video-1': { l: 39, t: 66, w: 32, r: 2 },
  'video-2': { l: 64, t: 74, w: 32, r: -2.5 },
}

/* Documento convertido em imagens (planos): "folhear" mostra uma página
   por vez com setas e contador; "rolar" empilha as fatias de um PDF longo
   numa coluna com rolagem própria. */
function Paginas({ item, grande = false }) {
  const [i, setI] = useState(0)
  const total = item.paginas.length
  const x0 = useRef(null)
  if (item.modo === 'rolar') {
    return (
      <div className={'paginas paginas--rolar' + (grande ? ' grande' : '')}>
        {item.paginas.map((src, k) => (
          <img key={src} src={src} alt={k === 0 ? item.titulo : ''} loading="lazy" decoding="async" />
        ))}
      </div>
    )
  }
  const ir = (n) => setI((n + total) % total)
  return (
    <div className={'paginas paginas--folhear' + (grande ? ' grande' : '')} style={{ aspectRatio: item.proporcao }}
      onPointerDown={(e) => { x0.current = e.clientX }}
      onPointerUp={(e) => {
        if (x0.current === null) return
        const dx = e.clientX - x0.current
        x0.current = null
        if (Math.abs(dx) > 40) ir(i + (dx < 0 ? 1 : -1))
      }}>
      <img src={item.paginas[i]} alt={`${item.titulo}, página ${i + 1} de ${total}`} decoding="async" draggable="false" />
      {/* pré-carrega a próxima página */}
      <link rel="prefetch" href={item.paginas[(i + 1) % total]} />
      <button type="button" className="paginas-seta paginas-seta--ant" onClick={() => ir(i - 1)} aria-label="Página anterior">‹</button>
      <button type="button" className="paginas-seta paginas-seta--prox" onClick={() => ir(i + 1)} aria-label="Próxima página">›</button>
      <span className="paginas-cont">{i + 1} / {total}</span>
    </div>
  )
}

/* Conteúdo da janela: iframe em tamanho real reduzido por escala quando o
   tipo tem `base` (sites e reel); nos demais, o iframe ocupa a janela. */
function Tela({ item, carregar, ativa }) {
  const caixaRef = useRef(null)
  const [escala, setEscala] = useState(0.4)
  const base = TIPO[item.tipo].base

  useEffect(() => {
    if (!base || !caixaRef.current) return undefined
    const el = caixaRef.current
    const medir = () => setEscala(el.clientWidth / base[0])
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [base])

  if (item.paginas) {
    return (
      <div className={'janela-tela janela-tela--' + item.tipo + ' janela-tela--' + item.modo} ref={caixaRef}>
        <Paginas item={item} />
      </div>
    )
  }
  const src = item.embed.replace('autoplay=1', 'autoplay=0')
  return (
    <div className={'janela-tela janela-tela--' + item.tipo} ref={caixaRef}>
      {carregar && (
        <iframe
          src={src}
          title={`${TIPO[item.tipo].rot}: ${item.titulo}`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          style={base ? { width: base[0], height: base[1], transform: `scale(${escala})` } : undefined}
          className={base ? 'escalado' : ''}
          tabIndex={ativa ? 0 : -1}
        />
      )}
    </div>
  )
}

export default function VitrineCases({ itens }) {
  const mesaRef = useRef(null)
  const [carregar, setCarregar] = useState(false)
  const [ordem, setOrdem] = useState(() => itens.map((it) => it.id))
  const [desloc, setDesloc] = useState({})
  const [ativa, setAtiva] = useState(null)
  const [arrastando, setArrastando] = useState(null)
  const [aberto, setAberto] = useState(null)
  const origemRef = useRef(null)
  const visorRef = useRef(null)
  const arrasteRef = useRef(null)

  /* só carrega os iframes quando a mesa chega perto da tela */
  useEffect(() => {
    const el = mesaRef.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) { setCarregar(true); return undefined }
    const ob = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setCarregar(true); ob.disconnect() }
    }, { rootMargin: '600px 0px' })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const paraFrente = useCallback((id) => {
    setOrdem((o) => (o[o.length - 1] === id ? o : [...o.filter((x) => x !== id), id]))
  }, [])

  function iniciarArraste(e, id) {
    if (e.button !== 0 || window.matchMedia('(max-width: 900px)').matches) return
    if (e.target.closest('button, a')) return
    e.preventDefault()
    paraFrente(id)
    const atual = desloc[id] || { x: 0, y: 0 }
    arrasteRef.current = { id, x0: e.clientX, y0: e.clientY, dx: atual.x, dy: atual.y }
    setArrastando(id)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function moverArraste(e) {
    const a = arrasteRef.current
    if (!a) return
    setDesloc((d) => ({ ...d, [a.id]: { x: a.dx + e.clientX - a.x0, y: a.dy + e.clientY - a.y0 } }))
  }
  function soltarArraste() {
    arrasteRef.current = null
    setArrastando(null)
  }

  /* visualizador em tela cheia */
  const atualVisor = aberto !== null ? itens[aberto] : null
  const fechar = useCallback(() => { setAberto(null); origemRef.current?.focus() }, [])
  const mover = useCallback((dir) => setAberto((i) => (i === null ? i : (i + dir + itens.length) % itens.length)), [itens.length])
  useEffect(() => {
    if (aberto === null) return undefined
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    visorRef.current?.focus()
    function tecla(e) {
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowRight') mover(1)
      if (e.key === 'ArrowLeft') mover(-1)
    }
    window.addEventListener('keydown', tecla)
    return () => { document.body.style.overflow = antes; window.removeEventListener('keydown', tecla) }
  }, [aberto, fechar, mover])

  /* clicar fora de qualquer janela desativa a janela ativa */
  useEffect(() => {
    if (ativa === null) return undefined
    function fora(e) { if (!e.target.closest('.janela')) setAtiva(null) }
    document.addEventListener('pointerdown', fora)
    return () => document.removeEventListener('pointerdown', fora)
  }, [ativa])

  return (
    <div className="mesa" ref={mesaRef}>
      {itens.map((it, i) => {
        const lay = LAYOUT[it.id] || { l: (i % 3) * 33, t: Math.floor(i / 3) * 30, w: 30, r: 0 }
        const d = desloc[it.id] || { x: 0, y: 0 }
        const eAtiva = ativa === it.id
        return (
          <article
            key={it.id}
            className={'janela janela--' + it.tipo + (eAtiva ? ' ativa' : '') + (arrastando === it.id ? ' arrastando' : '')}
            style={{
              '--l': lay.l + '%', '--t': lay.t + '%', '--w': lay.w + '%', '--r': lay.r + 'deg',
              '--dx': d.x + 'px', '--dy': d.y + 'px', zIndex: ordem.indexOf(it.id) + 1,
            }}
            onPointerDown={() => paraFrente(it.id)}
          >
            <header
              className="janela-barra"
              onPointerDown={(e) => iniciarArraste(e, it.id)}
              onPointerMove={moverArraste}
              onPointerUp={soltarArraste}
              onPointerCancel={soltarArraste}
            >
              <span className="janela-pontos" aria-hidden="true"><i /><i /><i /></span>
              <span className="janela-titulo">
                <b>{it.titulo}</b>
                <small>{it.dominio || TIPO[it.tipo].rot}</small>
              </span>
              <span className="janela-acoes">
                <a href={it.href} target="_blank" rel="noopener" aria-label={`Abrir ${it.titulo} em nova aba`}>↗</a>
                <button type="button" aria-label={`Ver ${it.titulo} em tela cheia`}
                  onClick={(e) => { origemRef.current = e.currentTarget; setAberto(i) }}>⤢</button>
              </span>
            </header>

            <Tela item={it} carregar={carregar} ativa={eAtiva} />

            {/* escudo: segura a rolagem da página até a pessoa decidir navegar */}
            {!eAtiva && (
              <button type="button" className="janela-escudo" onClick={() => { setAtiva(it.id); paraFrente(it.id) }}
                aria-label={`Navegar em ${it.titulo}`}>
                <span>{it.tipo === 'video' || it.tipo === 'reel' ? 'Clique para assistir' : 'Clique para navegar'}</span>
              </button>
            )}
          </article>
        )
      })}

      <p className="mesa-dica" aria-hidden="true">Arraste as janelas pela barra · clique para navegar · ⤢ tela cheia</p>

      {atualVisor && createPortal(
        <div className="visor7" role="dialog" aria-modal="true" aria-labelledby="visor7-tit" onClick={(e) => { if (e.target === e.currentTarget) fechar() }}>
          <div className={'visor7-caixa visor7-caixa--' + atualVisor.tipo} ref={visorRef} tabIndex={-1}>
            <div className="visor7-topo">
              <div>
                <p className="visor7-tipo">{TIPO[atualVisor.tipo].rot}</p>
                <h3 id="visor7-tit">{atualVisor.titulo}</h3>
                <p className="visor7-desc">{atualVisor.desc}</p>
              </div>
              <div className="visor7-acoes">
                <a className="visor7-btn" href={atualVisor.href} target="_blank" rel="noopener">Abrir em nova aba ↗</a>
                <button type="button" className="visor7-fechar" onClick={fechar} aria-label="Fechar">✕</button>
              </div>
            </div>
            <div className="visor7-palco">
              {(atualVisor.tipo === 'site' || atualVisor.tipo === 'lp') && (
                <div className="visor7-browser"><i /><i /><i /><span>{atualVisor.dominio}</span></div>
              )}
              {atualVisor.paginas ? <Paginas key={atualVisor.id} item={atualVisor} grande /> : <iframe key={atualVisor.id} src={atualVisor.embed} title={`${TIPO[atualVisor.tipo].rot}: ${atualVisor.titulo}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
            </div>
            <div className="visor7-nav">
              <button type="button" onClick={() => mover(-1)}>← Anterior</button>
              <span>{String(aberto + 1).padStart(2, '0')} / {String(itens.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => mover(1)}>Próximo →</button>
            </div>
          </div>
        </div>,
        document.querySelector('.pagina-pesquisa-clinica') || document.body,
      )}
    </div>
  )
}
