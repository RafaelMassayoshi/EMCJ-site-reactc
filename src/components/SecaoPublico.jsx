import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   Seção U · Mercado da home.
   Esquerda: título e texto corrido (para quem, desafio, como resolvemos).
   Direita: "De um lado" (marketing) e "Do outro" (comercial) lado a lado,
      com uma fenda entre eles por onde "cai" o que se perde, listado abaixo. Um item de cada vez "escapa"
      (fica em destaque e uma gota cai pela fenda), em ciclo, só enquanto a
      seção está na tela. Passar o mouse num item fixa o destaque nele.
   Estilos em styles/pages/home.css (prefixos .publico- e .lacuna-).
   ========================================================================== */

const ic = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
const PERDAS = [
  {
    icone: <path {...ic} d="M12 3.2l2.6 5.5 6 .7-4.4 4.1 1.1 6L12 16.6l-5.3 2.9 1.1-6-4.4-4.1 6-.7z" />,
    texto: <>Ser conhecido e relevante em <b>contas e personas estratégicas</b>.</>,
  },
  {
    icone: <g {...ic}><rect x="3" y="4" width="18" height="12.5" rx="2" /><path d="M8.5 20.5h7M12 16.5v4M7 12.5l3-3 2.5 2 4.5-4.5" /></g>,
    texto: <>O mercado entender o <b>valor da sua solução</b>.</>,
  },
  {
    icone: <g {...ic}><circle cx="9" cy="12" r="5.8" /><circle cx="15" cy="12" r="5.8" /></g>,
    texto: <>Marketing e vendas atuarem <b>em conjunto</b>.</>,
  },
  {
    icone: <g {...ic}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.4 2.7-6 6-6s6 2.6 6 6M16 4.8a3.2 3.2 0 0 1 0 6.3M18 14.4c1.8.8 3 2.6 3 5.6" /></g>,
    texto: <>Manter um <b>relacionamento sólido</b> com prospects e clientes.</>,
  },
  {
    icone: <g {...ic}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 17v-3M12 17v-6M15 17v-4" /></g>,
    texto: <>Reportar os investimentos em marketing e <b>conectá-los à receita gerada</b>.</>,
  },
  {
    icone: <g {...ic}><circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="12" r="2.4" /><circle cx="6" cy="18" r="2.4" /><path d="M8.4 6H13a3 3 0 0 1 3 3v.6M15.6 12H11a3 3 0 0 0-3 3v.6" /></g>,
    texto: <><b>Criar um pipeline forte</b> e ter previsibilidade de receita.</>,
  },
]

export default function SecaoPublico() {
  const caixaRef = useRef(null)
  const [ativo, setAtivo] = useState(0)
  const [fixo, setFixo] = useState(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = caixaRef.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const ob = new IntersectionObserver((es) => es.forEach((e) => setVisivel(e.isIntersecting)), { threshold: 0.25 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  useEffect(() => {
    if (!visivel || fixo !== null) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setAtivo((i) => (i + 1) % PERDAS.length), 2400)
    return () => clearInterval(id)
  }, [visivel, fixo])

  const destaque = fixo !== null ? fixo : ativo

  return (
    <section className="secao bloco claro fundo-branco">
      <div className="shell">
        <div className="simbolo-linha rv">
          <span className="simbolo">U</span><span className="regua"></span><span className="kicker">Para quem precisa vender mais e organizar melhor a forma como vende</span>
        </div>

        <div className="publico-grade">
          <div className="publico-texto rv">
            <h2 className="d40">Entre o interesse e a venda, muita <span className="ac ac53">oportunidade se perde.</span></h2>
            <p className="lead">Atuamos com diretores e líderes de Vendas, Marketing e Negócios em mercados especializados e de vendas complexas, que têm o desafio de gerar mais oportunidades, melhorar a conversão e conectar marketing e comercial.</p>
            <p className="lead">A Emcomjunto atua de ponta a ponta para testar mais rápido, aprender e acelerar processos e resultados, com foco na integração e na evolução da sua operação comercial.</p>
          </div>

        <div className="lacuna" ref={caixaRef}>
          <article className="lado lacuna-lado rv">
            <p className="kicker">De um lado</p>
            <p>O marketing e as agências tradicionalmente concentram energia em marca, conteúdo e campanhas. O sucesso é medido por alcance, engajamento e volume de leads.</p>
          </article>

          <article className="lado lacuna-lado lacuna-lado--b rv">
            <p className="kicker">Do outro</p>
            <p>O comercial foca nas carteiras que já garantem o faturamento. O que chega de fora entra na fila e nem sempre volta como informação.</p>
          </article>
          <div className="lacuna-fenda" aria-hidden="true"><i /><i /><i /></div>
          <div className="lacuna-meio rv">
            <p className="lacuna-titulo">O que se perde entre as duas áreas</p>
            <ul className="lacuna-lista" onMouseLeave={() => setFixo(null)}>
              {PERDAS.map((p, i) => (
                <li
                  key={i}
                  className={i === destaque ? 'ativo' : ''}
                  onMouseEnter={() => setFixo(i)}
                >
                  <svg className="lacuna-ico" viewBox="0 0 24 24" aria-hidden="true">{p.icone}</svg>
                  <span>{p.texto}</span>
                  <i className="lacuna-gota" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>

        </div>
        </div>
      </div>
    </section>
  )
}
