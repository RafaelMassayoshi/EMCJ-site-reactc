import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   Diagrama do hero da home, em lógica de sistema solar.

   Planejamento → Mercado → Emcomjunto (o sol) → Resultados, e os quatro
   canais (Mídia, Outbound, Conteúdo, Tecnologia + pré-vendas) orbitando o
   sol numa elipse inclinada: passam na frente dele (maiores, acesos) e por
   trás (menores, esmaecidos, recortados pelo sol via máscara).

   Depois da cena "Como funciona", os textos das bolas trocam por exemplos
   práticos de Varejo, Saúde e ESG, em ciclo. O ciclo vem de CENAS abaixo:
   para mudar um exemplo, é só editar o texto ali.

   Duas versões do mesmo desenho: horizontal (desktop) e vertical (até
   900px). O movimento das órbitas é um único rAF que escreve direto no DOM
   (transform/máscara/data-*), atributos que o React não controla, então
   a troca de cena (estado React) e a órbita não brigam.
   Estilos em styles/pages/home.css (prefixo .fx-).
   ========================================================================== */

const CENAS = [
  {
    id: 'base', rotulo: 'Como funciona', tom: '#41AFFF', dur: 8000, icone: 'pessoas',
    plan: ['PLANEJAMENTO'],
    mercado: { t: ['MERCADO', 'E CONTAS-ALVO'], s: ['Mais oportunidades', 'para o seu negócio.'] },
    resultado: { t: ['RESULTADOS'], s: ['Vendas e um time', 'mais forte.'] },
    canais: [['MÍDIA'], ['OUTBOUND'], ['CONTEÚDO'], ['TECNOLOGIA', '+ PRÉ-VENDAS']],
  },
  {
    id: 'varejo', rotulo: 'Na prática · Varejo', tom: '#1F88D6', dur: 6500, icone: 'carrinho',
    plan: ['MAPA DE', 'REDES'],
    mercado: { t: ['SUPERMERCADOS'], s: ['Redes e atacarejos', 'do seu território.'] },
    resultado: { t: ['NOVOS', 'NEGÓCIOS'], s: ['em pontos de venda.'] },
    canais: [['MÍDIA PARA', 'COMPRADORES'], ['ABORDAGEM', 'A GERENTES'], ['CASES DE', 'GÔNDOLA'], ['CRM E', 'VISITAS']],
  },
  {
    id: 'saude', rotulo: 'Na prática · Saúde', tom: '#9BD4F4', dur: 6500, icone: 'cruz',
    plan: ['ÁREAS', 'TERAPÊUTICAS'],
    mercado: { t: ['CENTROS DE', 'PESQUISA'], s: ['Patrocinadores, CROs', 'e centros clínicos.'] },
    resultado: { t: ['VOLUNTÁRIOS', 'QUALIFICADOS'], s: ['encaminhados', 'aos centros.'] },
    canais: [['CAMPANHAS', 'EDUCATIVAS'], ['CONTATO COM', 'CENTROS'], ['CONTEÚDO', 'DE SAÚDE'], ['TRIAGEM E', 'AGENDAMENTO']],
  },
  {
    id: 'esg', rotulo: 'Na prática · ESG', tom: '#C47E6E', dur: 6500, icone: 'folha',
    plan: ['NORMAS E', 'SETORES'],
    mercado: { t: ['INDÚSTRIAS'], s: ['Gestão de processos,', 'efluentes e SST.'] },
    resultado: { t: ['PROJETOS', 'TÉCNICOS'], s: ['em eficiência e', 'gestão de riscos.'] },
    canais: [['MÍDIA', 'TÉCNICA'], ['ABORDAGEM A', 'ENGENHARIA'], ['ESTUDOS', 'DE CASO'], ['DIAGNÓSTICO', 'TÉCNICO']],
  },
]

/* ---------------- ícones (grade 24×24, preenchidos) ---------------- */
function Icone({ nome, ...props }) {
  switch (nome) {
    case 'pessoas':
      return (
        <g {...props}>
          <circle cx="12" cy="7.2" r="3.4" />
          <path d="M5.6 19.5c0-3.9 2.9-6.4 6.4-6.4s6.4 2.5 6.4 6.4z" />
          <circle cx="4.6" cy="9.6" r="2.3" />
          <circle cx="19.4" cy="9.6" r="2.3" />
          <path d="M0.4 18.4c0-2.8 1.8-4.6 4.3-4.8-1.1 1.4-1.7 3-1.8 4.8z" />
          <path d="M23.6 18.4c0-2.8-1.8-4.6-4.3-4.8 1.1 1.4 1.7 3 1.8 4.8z" />
        </g>
      )
    case 'carrinho':
      return (
        <g {...props}>
          <path d="M1.5 3h3.4l.7 2.6h16.9l-2.4 8.8c-.2.7-.8 1.2-1.5 1.2H8.4c-.7 0-1.3-.5-1.5-1.2L4 5.2H1.5z" />
          <circle cx="9.4" cy="19.6" r="2" />
          <circle cx="17.8" cy="19.6" r="2" />
        </g>
      )
    case 'cruz':
      return (
        <g {...props}>
          <path d="M8.8 2h6.4c.4 0 .8.4.8.8V8h5.2c.4 0 .8.4.8.8v6.4c0 .4-.4.8-.8.8H16v5.2c0 .4-.4.8-.8.8H8.8c-.4 0-.8-.4-.8-.8V16H2.8c-.4 0-.8-.4-.8-.8V8.8c0-.4.4-.8.8-.8H8V2.8c0-.4.4-.8.8-.8z" />
        </g>
      )
    case 'folha':
      return (
        <g {...props}>
          <path d="M21.5 2.5C11.6 2.4 4.2 6.9 4.2 14.6c0 1.5.4 2.9 1 4.1L2.5 21.4l1.1 1.1 2.7-2.7c1.3.8 2.8 1.2 4.4 1.2 7.4 0 10.8-7.2 10.8-18.5z" />
          <path className="fx-recorte" d="M6.4 19.6C9.5 14.6 13 10.6 17.6 7.2" fill="none" />
        </g>
      )
    case 'barras':
      return (
        <g {...props}>
          <rect x="2.5" y="13" width="4.6" height="9" rx="1.6" />
          <rect x="9.7" y="7.5" width="4.6" height="14.5" rx="1.6" />
          <rect x="16.9" y="2" width="4.6" height="20" rx="1.6" />
        </g>
      )
    case 'alvo':
      return (
        <g {...props}>
          <circle cx="12" cy="12" r="10.5" />
          <circle className="fx-recorte-cheio" cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="4.2" />
          <circle className="fx-recorte-cheio" cx="12" cy="12" r="1.6" />
        </g>
      )
    case 'megafone':
      return (
        <g {...props}>
          <path d="M2.5 9.6v4.8c0 .7.5 1.2 1.2 1.2h1.8l1.4 5.4h2.7l-1.3-5.4h.8l8.4 4.2V4.4L9.1 8.4H3.7c-.7 0-1.2.5-1.2 1.2z" />
          <path className="fx-onda" d="M19.6 8.6a4.4 4.4 0 0 1 0 6.8" fill="none" />
        </g>
      )
    case 'documento':
      return (
        <g {...props}>
          <path d="M5.5 1.5h8.6l5.4 5.4v14.4c0 .7-.5 1.2-1.2 1.2H5.5c-.7 0-1.2-.5-1.2-1.2V2.7c0-.7.5-1.2 1.2-1.2z" />
          <path className="fx-recorte" d="M8 11.5h8M8 14.8h8M8 18.1h5.2" fill="none" />
        </g>
      )
    case 'engrenagem':
      return (
        <g {...props}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect key={a} x="10" y="0.8" width="4" height="5" rx="1" transform={`rotate(${a} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="7.6" />
          <circle className="fx-recorte-cheio" cx="12" cy="12" r="3.1" />
        </g>
      )
    default:
      return null
  }
}
const ICONES_CANAIS = ['megafone', 'pessoas', 'documento', 'engrenagem']

/* Linhas de texto centradas; `y` é a linha de base da primeira. */
function Linhas({ linhas, x, y, lh, className, anchor = 'middle' }) {
  return (
    <text className={className} x={x} y={y} textAnchor={anchor}>
      {linhas.map((l, i) => (
        <tspan key={l + i} x={x} dy={i === 0 ? 0 : lh}>{l}</tspan>
      ))}
    </text>
  )
}

/* Bola grande (Mercado / Resultados) com ícone, título e subtítulo.
   O bloco de texto é centrado verticalmente conforme o número de linhas. */
function Corpo({ cx, cy, r, icone, bloco, m }) {
  const k = m ? 0.8 : 1
  const lhT = 26 * k
  const lhS = 21 * k
  const gap = 12 * k
  const alturaTexto = bloco.t.length * lhT + gap + bloco.s.length * lhS
  const topo = cy + 16 * k - alturaTexto / 2 + 14 * k
  const ySub = topo + (bloco.t.length - 1) * lhT + gap + lhS
  const iconeTam = 44 * k
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 18 * k} className="fx-halo" />
      <circle className="fx-lado" cx={cx} cy={cy} r={r} />
      <g className="fx-troca">
        <Icone nome={icone} className="fx-ico" transform={`translate(${cx - iconeTam / 2} ${topo - 30 * k - iconeTam}) scale(${iconeTam / 24})`} />
        <Linhas linhas={bloco.t} x={cx} y={topo} lh={lhT} className={'fx-titulo' + (m ? ' fx-m' : '')} />
        <Linhas linhas={bloco.s} x={cx} y={ySub} lh={lhS} className={'fx-sub' + (m ? ' fx-m' : '')} />
      </g>
    </g>
  )
}

/* Bola pequena (planetas e Planejamento), desenhada na origem. */
function Planeta({ r, icone, rotulo, m, lado }) {
  const tam = r * 0.8
  const lh = m ? 14 : 20
  return (
    <>
      <circle className="fx-canal-halo" r={r + 14} />
      <circle className="fx-canal-bola" r={r} />
      <Icone nome={icone} className="fx-ico-canal" transform={`translate(${-tam / 2} ${-tam / 2}) scale(${tam / 24})`} />
      <g className="fx-troca">
        {lado ? (
          <Linhas linhas={rotulo} x={r + 14} y={rotulo.length > 1 ? -3 : 5} lh={lh} anchor="start" className={'fx-rotulo' + (m ? ' fx-m' : '')} />
        ) : (
          <Linhas linhas={rotulo} x={0} y={r + (m ? 20 : 30)} lh={lh} className={'fx-rotulo' + (m ? ' fx-m' : '')} />
        )}
      </g>
    </>
  )
}

function Sol({ cx, cy, r, m, idGrad }) {
  const lw = r * 1.42
  const lh = lw / 2.02
  return (
    <g>
      <circle className="fx-coroa" cx={cx} cy={cy} r={r * 1.9} />
      <circle className="fx-anel" cx={cx} cy={cy} r={r + (m ? 12 : 18)} />
      <circle className="fx-centro" cx={cx} cy={cy} r={r} fill={`url(#${idGrad})`} />
      <image href="/assets/images/logo-header-white.png" x={cx - lw / 2} y={cy - lh / 2} width={lw} height={lh} />
    </g>
  )
}

function Defs({ id, cx, cy, r }) {
  return (
    <defs>
      <radialGradient id={'grad' + id} cx="38%" cy="30%" r="80%">
        <stop offset="0" stopColor="#12476F" />
        <stop offset=".55" stopColor="#083251" />
        <stop offset="1" stopColor="#031526" />
      </radialGradient>
      {/* máscara em coordenadas do svg: aplicada ao envelope sem transform */}
      <mask id={'sol' + id} maskUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="2000">
        <rect x="-200" y="-200" width="2000" height="2000" fill="#fff" />
        <circle cx={cx} cy={cy} r={r + 4} fill="#000" />
      </mask>
    </defs>
  )
}

export default function HeroFluxo() {
  const caixaRef = useRef(null)
  const [pronto, setPronto] = useState(false)
  const [iCena, setICena] = useState(0)
  const [saindo, setSaindo] = useState(false)
  const cena = CENAS[iCena]

  /* entrada */
  useEffect(() => {
    const t = setTimeout(() => setPronto(true), 200)
    return () => clearTimeout(t)
  }, [])

  /* ciclo de cenas: some, troca o texto, reaparece */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let t2
    const t1 = setTimeout(() => {
      setSaindo(true)
      t2 = setTimeout(() => {
        setICena((i) => (i + 1) % CENAS.length)
        setSaindo(false)
      }, 420)
    }, cena.dur)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [iCena, cena.dur])

  /* órbitas */
  useEffect(() => {
    const caixa = caixaRef.current
    if (!caixa) return undefined
    const sistemas = Array.from(caixa.querySelectorAll('svg[data-orbita]')).map((svg) => {
      const [cx, cy, rx, ry, tiltG] = svg.dataset.orbita.split(',').map(Number)
      return {
        cx, cy, rx, ry, tilt: (tiltG * Math.PI) / 180, mask: svg.dataset.mask,
        planetas: Array.from(svg.querySelectorAll('.fx-planeta')),
      }
    })
    const PER = 36000
    function ponto(s, th) {
      const x = s.rx * Math.cos(th)
      const y = s.ry * Math.sin(th)
      return [s.cx + x * Math.cos(s.tilt) - y * Math.sin(s.tilt), s.cy + x * Math.sin(s.tilt) + y * Math.cos(s.tilt)]
    }
    function desenha(ms) {
      const base = (ms / PER) * Math.PI * 2 + 0.35
      sistemas.forEach((s) => {
        s.planetas.forEach((p, i) => {
          const th = base + (i * Math.PI) / 2
          const [X, Y] = ponto(s, th)
          const d = Math.sin(th)
          const esc = 0.74 + 0.26 * ((d + 1) / 2)
          p.setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)}) scale(${esc.toFixed(3)})`)
          p.dataset.atras = d < 0 ? '1' : '0'
          p.dataset.on = d > 0.88 ? '1' : '0'
          if (d < 0) p.parentNode.setAttribute('mask', `url(#${s.mask})`)
          else p.parentNode.removeAttribute('mask')
        })
      })
    }

    desenha(0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let rodando = false
    let quadro = null
    let deslocado = 0
    let inicio = null
    function passo(t) {
      if (inicio === null) inicio = t - deslocado
      deslocado = t - inicio
      desenha(deslocado)
      quadro = requestAnimationFrame(passo)
    }
    const ot = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !rodando) {
            rodando = true
            inicio = null
            quadro = requestAnimationFrame(passo)
          } else if (!e.isIntersecting && rodando) {
            rodando = false
            cancelAnimationFrame(quadro)
          }
        })
      },
      { threshold: 0.05 },
    )
    ot.observe(caixa)
    return () => {
      ot.disconnect()
      if (quadro) cancelAnimationFrame(quadro)
    }
  }, [])

  const classes = ['fx-caixa', pronto && 'pronto', saindo && 'saindo', 'fx-cena-' + cena.id].filter(Boolean).join(' ')

  return (
    <div className={classes} ref={caixaRef} aria-hidden="true" style={{ '--fx-tom': cena.tom }}>
      {/* ---------------- Desktop: horizontal ----------------
          data-orbita = cx, cy, rx, ry, inclinação (graus) */}
      <svg className="fx-desk" viewBox="0 64 1010 436" data-orbita="507,300,232,98,-10" data-mask="solD">
        <Defs id="D" cx={507} cy={300} r={110} />

        <ellipse className="fx-orbita" cx="507" cy="300" rx="232" ry="98" transform="rotate(-10 507 300)" />
        <ellipse className="fx-orbita fx-orbita--int" cx="507" cy="300" rx="152" ry="64" transform="rotate(-10 507 300)" />

        {/* órbita do Planejamento em volta do Mercado (mesma inclinação do sistema) */}
        <ellipse className="fx-orbita fx-orbita--int" cx="134" cy="300" rx="128" ry="186" transform="rotate(-10 134 300)" />
        <g className="fx-seta"><line x1="92" y1="162" x2="101.7" y2="195" /><path d="M92.7 189.4L101.7 195l4.4-9.7" /></g>
        <g className="fx-seta"><line x1="246" y1="300" x2="387" y2="300" /><path d="M379 292l8 8-8 8" /></g>
        <g className="fx-seta"><line x1="627" y1="300" x2="766" y2="300" /><path d="M758 292l8 8-8 8" /></g>

        <g className="fx-entra fx-e3" transform="translate(80.3 123.5)">
          <g className="fx-plano"><Planeta r={34} icone="alvo" rotulo={cena.plan} lado /></g>
        </g>
        <g className="fx-entra fx-e1">
          <g className="fx-flutua fx-fa"><Corpo cx={134} cy={300} r={104} icone={cena.icone} bloco={cena.mercado} /></g>
        </g>
        <g className="fx-entra fx-e2">
          <g className="fx-flutua fx-fb"><Corpo cx={880} cy={300} r={104} icone="barras" bloco={cena.resultado} /></g>
        </g>

        <g className="fx-entra fx-e0"><Sol cx={507} cy={300} r={110} idGrad="gradD" /></g>

        {cena.canais.map((rot, i) => (
          <g key={i} className="fx-entra fx-e4">
            <g className="fx-planeta">
              <Planeta r={38} icone={ICONES_CANAIS[i]} rotulo={rot} />
            </g>
          </g>
        ))}
      </svg>

      {/* ---------------- Mobile: vertical ---------------- */}
      <svg className="fx-mob" viewBox="0 0 400 830" data-orbita="200,470,138,44,-7" data-mask="solM">
        <Defs id="M" cx={200} cy={470} r={74} />

        <ellipse className="fx-orbita" cx="200" cy="470" rx="138" ry="44" transform="rotate(-7 200 470)" />
        <ellipse className="fx-orbita fx-orbita--int" cx="200" cy="470" rx="92" ry="29" transform="rotate(-7 200 470)" />

        <g className="fx-seta"><line x1="200" y1="80" x2="200" y2="104" /><path d="M193 97l7 7 7-7" /></g>
        <g className="fx-seta"><line x1="200" y1="294" x2="200" y2="330" /><path d="M193 323l7 7 7-7" /></g>
        <g className="fx-seta"><line x1="200" y1="604" x2="200" y2="634" /><path d="M193 627l7 7 7-7" /></g>

        <g className="fx-entra fx-e3" transform="translate(200 48)">
          <g className="fx-plano"><Planeta r={26} icone="alvo" rotulo={cena.plan} m lado /></g>
        </g>
        <g className="fx-entra fx-e1"><Corpo cx={200} cy={200} r={88} icone={cena.icone} bloco={cena.mercado} m /></g>
        <g className="fx-entra fx-e2"><Corpo cx={200} cy={730} r={88} icone="barras" bloco={cena.resultado} m /></g>
        <g className="fx-entra fx-e0"><Sol cx={200} cy={470} r={74} m idGrad="gradM" /></g>

        {cena.canais.map((rot, i) => (
          <g key={i} className="fx-entra fx-e4">
            <g className="fx-planeta">
              <Planeta r={26} icone={ICONES_CANAIS[i]} rotulo={rot} m />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
