import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useMedia from '../hooks/useMedia.js'

/* ==========================================================================
   Seção ⊂ · Recorte da home: "Resultados comerciais de um lado. Tudo o que
   for necessário para alcançá-los do outro."

   Esquerda: os resultados. Direita: o que podemos entregar. Ao escolher um
   resultado (clique, foco ou passando o mouse), acendem as frentes de
   entrega que costumam compor aquele resultado, ligadas por fios desenhados
   num SVG por cima do vão central. Sem interação, os resultados se revezam
   sozinhos enquanto a seção está na tela.
   O mapa resultado → frentes está em RESULTADOS[].frentes (índices de
   ENTREGAS); é ilustrativo, cada operação é desenhada no diagnóstico.
   Estilos em styles/pages/home.css (prefixo .lados2).
   ========================================================================== */

const ENTREGAS = [
  'Análises, estratégia e planejamento',
  'Prospecção, qualificação e relacionamento',
  'Performance e geração de demanda',
  'Conteúdo, audiovisual e autoridade',
  'Websites e presença digital',
  'Eventos e ações offline',
  'Tecnologia, automação, IA e dados',
]

const RESULTADOS = [
  { t: 'Leads qualificados', d: 'Contatos com perfil e interesse aderentes à oportunidade comercial.', frentes: [0, 2, 4, 6] },
  { t: 'Reuniões agendadas', d: 'Conversas com decisores, empresas e públicos prioritários.', frentes: [0, 1, 6] },
  { t: 'Oportunidades comerciais', d: 'Leads avançados, qualificados e organizados para atuação do time de vendas.', frentes: [1, 2, 6] },
  { t: 'Orçamentos e propostas', d: 'Apoio para transformar interesse em proposta comercial concreta.', frentes: [0, 1, 3] },
  { t: 'Vendas', d: 'Atuação integrada para aumentar conversão e acelerar negócios.', frentes: [0, 1, 3, 6] },
  { t: 'Novos mercados e contas', d: 'Abertura de frentes, públicos, segmentos e contas estratégicas.', frentes: [0, 1, 2, 5] },
  { t: 'Pipeline comercial', d: 'Mais previsibilidade sobre oportunidades em diferentes estágios.', frentes: [0, 1, 6] },
  { t: 'Autoridade e relacionamento', d: 'Maior presença e reconhecimento junto aos públicos que influenciam a venda.', frentes: [3, 4, 5] },
]

export default function SecaoDoisLados() {
  const caixaRef = useRef(null)
  const esqRef = useRef([])
  const dirRef = useRef([])
  const [ativo, setAtivo] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [visivel, setVisivel] = useState(false)
  const [fios, setFios] = useState({ w: 0, h: 0, d: [] })

  const r = RESULTADOS[ativo]
  const celular = useMedia('(max-width: 900px)')
  const chipsRef = useRef(null)

  /* celular: mantém o resultado ativo visível na faixa de etiquetas (rola
     só a faixa, não a página) */
  useEffect(() => {
    const faixa = chipsRef.current
    const chip = faixa && faixa.children[ativo]
    if (!chip) return
    faixa.scrollTo({ left: chip.offsetLeft - faixa.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' })
  }, [ativo, celular])

  /* desenha os fios do resultado ativo até cada frente ligada */
  const medir = useCallback(() => {
    const caixa = caixaRef.current
    const origem = esqRef.current[ativo]
    if (!caixa || !origem || window.matchMedia('(max-width: 900px)').matches) {
      setFios({ w: 0, h: 0, d: [] })
      return
    }
    const cb = caixa.getBoundingClientRect()
    const ob = origem.getBoundingClientRect()
    const x1 = ob.right - cb.left
    const y1 = ob.top + ob.height / 2 - cb.top
    const d = RESULTADOS[ativo].frentes.map((k) => {
      const alvo = dirRef.current[k]
      if (!alvo) return ''
      const ab = alvo.getBoundingClientRect()
      const x2 = ab.left - cb.left
      const y2 = ab.top + ab.height / 2 - cb.top
      const m = (x2 - x1) / 2
      return `M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1 + m).toFixed(1)} ${y1.toFixed(1)} ${(x2 - m).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
    })
    setFios({ w: cb.width, h: cb.height, d })
  }, [ativo])

  useLayoutEffect(() => {
    medir()
  }, [medir])

  useEffect(() => {
    const caixa = caixaRef.current
    if (!caixa) return undefined
    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => medir()) : null
    if (ro) ro.observe(caixa)
    window.addEventListener('resize', medir)
    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [medir])

  useEffect(() => {
    const caixa = caixaRef.current
    if (!caixa || !('IntersectionObserver' in window)) return undefined
    const ob = new IntersectionObserver((es) => es.forEach((e) => setVisivel(e.isIntersecting)), { threshold: 0.3 })
    ob.observe(caixa)
    return () => ob.disconnect()
  }, [])

  useEffect(() => {
    if (!visivel || pausado) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setAtivo((i) => (i + 1) % RESULTADOS.length), 3600)
    return () => clearInterval(id)
  }, [visivel, pausado])

  return (
    <section className="secao bloco escuro fundo-escuro" id="modelo">
      <div className="shell">
        <div className="simbolo-linha rv" style={{ justifyContent: 'center' }}>
          <span className="simbolo">⊂</span><span className="regua"></span><span className="kicker">Recorte</span>
        </div>
        <div className="lados2-cab rv">
          <h2 className="d56">Resultados comerciais de um lado. <span className="ac ac74">Tudo o que for necessário para alcançá-los do outro.</span></h2>
          <p className="lead">Todo projeto começa com uma etapa de imersão e diagnóstico para identificar o que é essencial para gerar resultado e onde estão as melhores oportunidades de evolução. A partir disso, desenhamos uma operação personalizada para o momento, o desafio e o mercado de cada cliente.</p>
        </div>

        <div
          className="lados2 rv"
          ref={caixaRef}
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={() => setPausado(false)}
        >
          <svg className="lados2-fios" width={fios.w} height={fios.h} viewBox={`0 0 ${fios.w || 1} ${fios.h || 1}`} aria-hidden="true">
            {fios.d.map((d, i) => d && <path key={ativo + '-' + i} d={d} style={{ '--i': i }} />)}
          </svg>

          {celular ? (
            /* celular: resultados numa faixa de etiquetas e, logo abaixo, só
               as frentes do resultado escolhido (causa e efeito na mesma tela) */
            <div className="lados2-movel">
              <p className="lados2-rotulo">De um lado <b>Resultados</b></p>
              <div className="lados2-chips" ref={chipsRef} role="tablist" aria-label="Resultados">
                {RESULTADOS.map((res, i) => (
                  <button key={res.t} type="button" role="tab" aria-selected={i === ativo}
                    className={'lados2-chip' + (i === ativo ? ' ativo' : '')}
                    onClick={() => { setAtivo(i); setPausado(true) }}>
                    {res.t}
                  </button>
                ))}
              </div>
              <div className="lados2-painel-m" role="tabpanel" key={ativo}>
                <p className="lados2-painel-d">{r.d}</p>
                <p className="lados2-rotulo">Do outro <b>O que entregamos para isso</b></p>
                <ul className="lados2-ent lados2-ent--m">
                  {r.frentes.map((k) => (
                    <li key={k} className="liga">
                      <span className="lados2-ent-n">{String(k + 1).padStart(2, '0')}</span>
                      <span className="lados2-ent-t">{ENTREGAS[k]}</span>
                      <span className="lados2-ent-ponto" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <>
          <div className="lados2-col">
            <p className="lados2-rotulo">De um lado <b>Resultados</b></p>
            <ul className="lados2-res">
              {RESULTADOS.map((res, i) => (
                <li key={res.t}>
                  <button
                    type="button"
                    ref={(el) => (esqRef.current[i] = el)}
                    className={'lados2-res-btn' + (i === ativo ? ' ativo' : '')}
                    aria-pressed={i === ativo}
                    onClick={() => setAtivo(i)}
                    onMouseEnter={() => setAtivo(i)}
                    onFocus={() => setAtivo(i)}
                  >
                    <span className="lados2-res-t">{res.t}</span>
                    <span className="lados2-res-d">{res.d}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lados2-col lados2-col--dir">
            <p className="lados2-rotulo">Do outro <b>O que podemos entregar para sua marca</b></p>
            <ul className="lados2-ent" aria-live="polite">
              {ENTREGAS.map((e, k) => {
                const liga = r.frentes.includes(k)
                return (
                  <li key={e} ref={(el) => (dirRef.current[k] = el)} className={liga ? 'liga' : ''}>
                    <span className="lados2-ent-n">{String(k + 1).padStart(2, '0')}</span>
                    <span className="lados2-ent-t">{e}</span>
                    <span className="lados2-ent-ponto" aria-hidden="true" />
                  </li>
                )
              })}
            </ul>
            <p className="lados2-legenda">Para <b>{r.t.toLowerCase()}</b>, combinamos {r.frentes.length} frentes.</p>
          </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
