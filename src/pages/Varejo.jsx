import { useEffect, useRef, useState } from 'react'
import MainLayout from '../layouts/MainLayout.jsx'
import Trilho from '../components/Trilho.jsx'
import CountUp from '../components/CountUp.jsx'
import FormStatus from '../components/FormStatus.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import useReveal from '../hooks/useReveal.js'
import useVertentesPronto from '../hooks/useVertentesPronto.js'
import useCartaoBlob from '../hooks/useCartaoBlob.js'
import useFormWebhook from '../hooks/useFormWebhook.js'

import '../styles/components/buttons.css'
import '../styles/components/nav.css'
import '../styles/components/hero.css'
import '../styles/components/cards.css'
import '../styles/components/esteira.css'
import '../styles/components/forms.css'
import '../styles/components/footer.css'
import '../styles/components/trilho.css'
import '../styles/pages/varejo.css'

const RECORTES = [
  { id: 'v1', titulo: 'Fornecedores', conteudo: (<><h3>Fornecedores</h3><p className="via-txt">Indústria e distribuição vendendo produto para a gôndola. A conversa é de giro, margem, ruptura e espaço na loja.</p></>) },
  { id: 'v2', titulo: 'Mobiliário e equipamentos', conteudo: (<><h3>Mobiliário e equipamentos</h3><p className="via-txt">Móveis de loja, gôndolas, checkout, refrigeração e equipamentos de operação. Venda com projeto, medição e instalação.</p></>) },
  { id: 'v3', titulo: 'Comunicação visual', conteudo: (<><h3>Comunicação visual</h3><p className="via-txt">Sinalização, fachada, material de ponto de venda e campanha dentro da loja.</p></>) },
  { id: 'v4', titulo: 'Estoque e centros de distribuição', conteudo: (<><h3>Estoque e centros de distribuição</h3><p className="via-txt">Estruturas de armazenagem, movimentação e organização de estoque, do centro de distribuição à retaguarda da loja.</p></>) },
  { id: 'v5', titulo: 'Tecnologia para ponto de venda', conteudo: (<><h3>Tecnologia para ponto de venda</h3><p className="via-txt">Automação, PDV, autoatendimento, integração de sistemas e mídia dentro da loja.</p></>) },
]

const ASSIM = [
  { rot: 'Supermercado', msg: 'Troca de campanha sem parar a loja, e reposição que a equipe consegue fazer no turno da manhã.' },
  { rot: 'Atacarejo', msg: 'Legibilidade em pé-direito alto, volume de rede inteira e prazo que fecha com o calendário de abastecimento.' },
  { rot: 'Farmácia', msg: 'Espaço curto: cada centímetro de gôndola precisa devolver margem, e o material não pode roubar circulação.' },
  { rot: 'Franquia', msg: 'Padrão idêntico em dezenas de praças, instalado na mesma data, com o franqueado sabendo o que chega e quando.' },
  { rot: 'Indústria no PDV', msg: 'Aprovação de trade e janela promocional curta: o material precisa chegar antes da ativação começar, não junto.' },
]

const VIRADA_ANTES = [
  { n: '01', t: 'CRM', p: 'A oportunidade vivia em planilha, e-mail e memória de quem atendeu. Não dava para saber o que estava em aberto nem há quanto tempo.' },
  { n: '02', t: 'Mídia paga', p: 'Sem rotina de anúncio no Google. A demanda chegava por indicação e por quem já conhecia as duas marcas.' },
  { n: '03', t: 'Prospecção ativa', p: 'Nenhum movimento de outbound ou de ABM. A conta nova dependia de o cliente aparecer primeiro.' },
  { n: '04', t: 'Leitura de resultado', p: 'Sem rotina periódica de performance. Difícil separar o que tinha funcionado do que só tinha acontecido.' },
]
const VIRADA_DEPOIS = [
  { n: '01', t: 'CRM', p: 'Funil, campos e etapas desenhados sobre a venda real do grupo. Dá para ver pipeline, tempo de resposta e onde a conversa parou.' },
  { n: '02', t: 'Mídia paga', p: 'Campanhas separadas por aplicação, cada uma com página e oferta próprias, medidas por custo por lead e por qualificação, não por clique.' },
  { n: '03', t: 'Prospecção ativa', p: 'Cadência de outbound e ABM sobre contas escolhidas, com argumento montado por segmento e por quem decide dentro de cada empresa.' },
  { n: '04', t: 'Leitura de resultado', p: 'Rotina de performance: o que rodou, o que converteu, o que sai e o que entra no ciclo seguinte.' },
]

const MOVIMENTOS = ['entender melhor onde o produto gerava valor', 'separar aplicações', 'personalizar a comunicação', 'usar os dados de qualificação para orientar a próxima rodada de campanhas']

// Pílula que corre atrás do rótulo ativo em "O que existia / Com a
// Emcomjunto" — porta do bloco "A virada" de js/pages/varejo.js.
function useViradaCorre(containerRef, botoesRef, ativo) {
  useEffect(() => {
    function posiciona() {
      const container = containerRef.current
      const btn = botoesRef.current[ativo]
      const abas = container?.querySelector('.virada-abas')
      const corre = container?.querySelector('.virada-corre')
      if (!btn || !abas || !corre) return
      corre.style.width = btn.offsetWidth + 'px'
      corre.style.translate = btn.offsetLeft - abas.clientLeft + 'px 0'
    }
    posiciona()
    window.addEventListener('resize', posiciona, { passive: true })
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(posiciona)
    return () => window.removeEventListener('resize', posiciona)
  }, [containerRef, botoesRef, ativo])
}

// "O aprendizado": os quatro trechos da frase acendem em sequência e param
// no que o ponteiro estiver tocando — porta do bloco "fecho" de
// js/pages/varejo.js.
function useFechoSequencial(containerRef, itensRef) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const itens = itensRef.current.filter(Boolean)
    if (!itens.length) return undefined

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido || !('IntersectionObserver' in window)) {
      itens.forEach((m) => m.classList.add('on'))
      return undefined
    }

    let i = 0
    let timer = null
    let preso = false
    function acende(n) {
      itens.forEach((m, k) => m.classList.toggle('on', k === n))
    }
    function anda() {
      if (preso) return
      acende(i)
      i = (i + 1) % itens.length
    }

    const aoEntrar = (k) => () => { preso = true; acende(k) }
    const aoSair = (k) => () => { preso = false; i = (k + 1) % itens.length }
    itens.forEach((m, k) => {
      m.addEventListener('pointerenter', aoEntrar(k))
      m.addEventListener('pointerleave', aoSair(k))
    })

    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !timer) {
            anda()
            timer = setInterval(anda, 2200)
          } else if (!e.isIntersecting && timer) {
            clearInterval(timer)
            timer = null
          }
        })
      },
      { threshold: 0.35 },
    )
    obs.observe(container)

    return () => {
      obs.disconnect()
      if (timer) clearInterval(timer)
    }
  }, [containerRef, itensRef])
}

export default function Varejo() {
  useDocumentMeta({
    title: 'Varejo — Emcomjunto',
    description: 'Assessoria comercial para quem vende para o varejo: mercadorias, mobiliário e equipamentos, comunicação visual, estoque e tecnologia de ponto de venda.',
    canonical: 'https://emcomjunto.com.br/varejo',
  })
  useReveal()
  useVertentesPronto()
  useCartaoBlob()
  const { status: statusContato, handleSubmit: handleSubmitContato } = useFormWebhook()

  // ---------- Assim (o varejo funciona assim) ----------
  const [assimAtivo, setAssimAtivo] = useState(0)
  const [assimTrocando, setAssimTrocando] = useState(false)
  const assimBotoesRef = useRef([])
  function selecionarAssim(i) {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido) {
      setAssimAtivo(i)
      return
    }
    setAssimTrocando(true)
    setTimeout(() => {
      setAssimAtivo(i)
      setAssimTrocando(false)
    }, 240)
  }
  function aoTecladoAssim(e, i) {
    let n = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % ASSIM.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + ASSIM.length) % ASSIM.length
    if (n !== null) {
      e.preventDefault()
      assimBotoesRef.current[n]?.focus()
      selecionarAssim(n)
    }
  }

  // ---------- Virada (antes/depois) ----------
  const [viradaAtiva, setViradaAtiva] = useState(0)
  const viradaContainerRef = useRef(null)
  const viradaBotoesRef = useRef([])
  useViradaCorre(viradaContainerRef, viradaBotoesRef, viradaAtiva)
  function aoTecladoVirada(e, i) {
    let d = 0
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') d = 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') d = -1
    if (!d) return
    e.preventDefault()
    const n = (i + d + 2) % 2
    setViradaAtiva(n)
    viradaBotoesRef.current[n]?.focus()
  }

  // ---------- Fecho (o aprendizado) ----------
  const fechoRef = useRef(null)
  const fechoItensRef = useRef([])
  useFechoSequencial(fechoRef, fechoItensRef)

  return (
    <MainLayout pageClassName="pagina-varejo" headerProps={{ currentLink: 'varejo', ctaHref: '#contato', ctaLabel: 'Diagnóstico' }} footerProps={{
      newsletterHeading: 'O que a gente está aprendendo vendendo para o varejo.',
      newsletterSub: 'Uma vez por mês: leituras do setor, o que funcionou em cada aplicação, o que não funcionou, e o que isso muda na conversa com comprador, trade e operação.',
      extraHidden: { name: 'pagina-origem', value: 'varejo' },
    }}>
      {/* ============================= HERO ============================= */}
      <section className="hero hero-varejo secao" id="topo">
        <div className="hero-brilho" id="heroBrilho" aria-hidden="true"></div>
        <div className="hero-scrim" aria-hidden="true"></div>

        <div className="vertentes" id="vertentes" aria-hidden="true">
          <svg className="grade-varejo" viewBox="0 0 600 552" preserveAspectRatio="xMidYMid meet">
            <line className="eixo" x1="140" y1="132" x2="452" y2="132" />
            <line className="eixo" x1="144" y1="140" x2="144" y2="414" />
            <text className="rot" x="140" y="118">APLICAÇÃO</text>
            <text className="rot" x="140" y="442">QUEM DECIDE</text>

            <rect className="cel" x="156" y="150" width="62" height="54" rx="8" />
            <rect className="cel acesa" x="230" y="150" width="62" height="54" rx="8" />
            <rect className="cel" x="304" y="150" width="62" height="54" rx="8" />
            <rect className="cel" x="378" y="150" width="62" height="54" rx="8" />

            <rect className="cel acesa a2" x="156" y="216" width="62" height="54" rx="8" />
            <rect className="cel" x="230" y="216" width="62" height="54" rx="8" />
            <rect className="cel" x="304" y="216" width="62" height="54" rx="8" />
            <rect className="cel acesa a3" x="378" y="216" width="62" height="54" rx="8" />

            <rect className="cel" x="156" y="282" width="62" height="54" rx="8" />
            <rect className="cel" x="230" y="282" width="62" height="54" rx="8" />
            <rect className="cel acesa a4" x="304" y="282" width="62" height="54" rx="8" />
            <rect className="cel" x="378" y="282" width="62" height="54" rx="8" />

            <rect className="cel" x="156" y="348" width="62" height="54" rx="8" />
            <rect className="cel acesa a5" x="230" y="348" width="62" height="54" rx="8" />
            <rect className="cel" x="304" y="348" width="62" height="54" rx="8" />
            <rect className="cel" x="378" y="348" width="62" height="54" rx="8" />
          </svg>
          <div className="vertente v-mkt">Aplicação<i></i></div>
          <div className="vertente v-tec">Operação<i></i></div>
          <div className="vertente v-vnd">Quem decide<i></i></div>
        </div>

        <div className="shell hero-conteudo">
          <div className="filete rv"></div>
          <h1 className="d64 rv">No varejo, o difícil não é achar interessado. É saber <span className="ac ac90">a quem a solução serve.</span></h1>
          <p className="hero-lead rv">A Emcomjunto assessora quem vende para o varejo: mercadoria, mobiliário e equipamento, comunicação visual, estrutura de estoque e tecnologia de ponto de venda. A mesma solução atende operações diferentes, e cada operação decide de um jeito. É nesse ponto estratégico que muitas vezes a venda pode travar ou se perder.</p>
          <div className="hero-acoes rv">
            <a className="btn btn--primario" href="#contato">Fazer um diagnóstico</a>
            <a className="btn btn--texto" href="#case">Conferir os cases <span className="seta">→</span></a>
          </div>
        </div>
      </section>

      {/* ============================= ⊆ · O RECORTE ============================= */}
      <section className="secao bloco claro fundo-branco" id="recorte">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">⊆</span><span className="regua"></span><span className="kicker">O recorte</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">O varejo que a gente atende <span className="ac ac74">não é a loja.</span></h2>
            <p className="lead apoio">É quem vende para ela. Cinco recortes, com operações, ciclos e decisores diferentes. Por isso a estratégia se monta por segmento, aplicação e momento comercial.</p>
          </div>

          <Trilho id="trilho" ariaLabel="Os cinco recortes do varejo" items={RECORTES} />
        </div>
      </section>

      {/* ============================= ≈ + ƒ · UM BLOCO ESCURO SÓ ============================= */}
      <section className="secao escuro fundo-escuro" id="trava">
        <div className="shell dupla-a">
          <div className="simbolo-linha rv">
            <span className="simbolo">≈</span><span className="regua"></span><span className="kicker">Onde trava</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Não falta empresa interessada. <span className="ac ac74">Falta encaixe.</span></h2>
            <p className="lead apoio">O lead certo, na aplicação errada, com a pessoa errada da empresa, no mês errado do calendário. Antes de aumentar investimento, vale olhar estes três pontos.</p>
          </div>

          <div className="trio-cartoes esc">
            <article className="cartao" style={{ '--glow': '#E4652C' }}>
              <span className="borrao deriva-1" aria-hidden="true"><i></i></span>
              <p className="kicker">01 · Aplicação</p>
              <h3>Uma solução, muitas aplicações</h3>
              <p className="txt">O mesmo equipamento resolve coisas diferentes em supermercado, farmácia, loja de rua e franquia. Quando a comunicação fala com todos ao mesmo tempo, não convence ninguém em específico.</p>
            </article>

            <article className="cartao" style={{ '--glow': '#F0834F' }}>
              <span className="borrao deriva-3" aria-hidden="true"><i></i></span>
              <p className="kicker">02 · Decisão</p>
              <h3>A decisão é de um comitê</h3>
              <p className="txt">Compras, operação, TI, marketing e financeiro entram em momentos diferentes. Cada um pergunta outra coisa, e um argumento só não atravessa a mesa inteira.</p>
            </article>

            <article className="cartao" style={{ '--glow': '#D39E92' }}>
              <span className="borrao deriva-4" aria-hidden="true"><i></i></span>
              <p className="kicker">03 · Tempo</p>
              <h3>O calendário manda</h3>
              <p className="txt">Reforma, inauguração e temporada promocional definem quando existe orçamento. Interesse fora da janela não vira pedido, vira contato que esfria antes da próxima abertura.</p>
            </article>
          </div>
        </div>

        <div className="shell dupla-b" id="operacao">
          <div className="simbolo-linha rv">
            <span className="simbolo">ƒ</span><span className="regua"></span><span className="kicker">Nossa metodologia</span>
          </div>

          <div className="metodo">
            <div className="metodo-texto rv">
              <h2 className="d56">Entender antes de acelerar. <span className="ac ac74">Testar antes de escalar.</span></h2>
              <p className="metodo-lead">No varejo, a hipótese quase sempre é sobre recorte: qual aplicação, qual porte de operação, qual pessoa dentro da empresa. A gente escreve para um recorte por vez, coloca em campo e deixa o dado dizer qual merece mais energia.</p>
              <p className="metodo-lead">Foi isso que virou a conta na operação de varejo que a gente roda há mais tempo. Cada vez que a comunicação ficou mais específica, por aplicação, por porte e por quem decide, o custo por lead caiu e a qualificação subiu. A melhora não veio de aumentar investimento. Veio de parar de tratar o varejo como um cliente só.</p>
            </div>

            <div className="ciclo rv" aria-label="Ciclo: estudo, hipótese, teste, dados, aprendizado, evolução">
              <ol className="ciclo-elos">
                {['Estudo', 'Hipótese', 'Teste', 'Dados', 'Aprendizado', 'Evolução'].map((e, i) => (
                  <li className="elo" style={{ '--i': i }} key={e}><span className="elo-p" aria-hidden="true"></span>{e}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="assim rv" id="assim">
            <p className="assim-abre">Basicamente, o que a gente quer dizer é que o varejo <span className="ac ac53">funciona assim:</span></p>
            <p className="assim-guia">Escolha uma operação e veja o que muda na frase.</p>

            <div className="assim-pilulas" role="tablist" aria-label="Escolha uma operação do varejo">
              {ASSIM.map((a, i) => (
                <button
                  key={a.rot}
                  className="assim-p"
                  type="button"
                  role="tab"
                  ref={(el) => (assimBotoesRef.current[i] = el)}
                  aria-selected={assimAtivo === i}
                  onClick={() => selecionarAssim(i)}
                  onKeyDown={(e) => aoTecladoAssim(e, i)}
                >
                  {a.rot}
                </button>
              ))}
            </div>

            <div className={'assim-par' + (assimTrocando ? ' trocando' : '')} role="tabpanel" aria-live="polite">
              <div className="assim-meia assim-generica">
                <p className="assim-rot"><span className="assim-marca"></span>A mesma frase para todo mundo</p>
                <p>Temos soluções completas para o seu ponto de venda.</p>
                <p className="assim-nota">Esta metade não muda. É esse o problema.</p>
              </div>
              <div className="assim-meia assim-certa">
                <p className="assim-rot"><span className="assim-marca"></span>A frase de quem você escolheu</p>
                <p id="assimMsg">{ASSIM[assimAtivo].msg}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= ∴ · O CASE ============================= */}
      <section className="secao bloco claro fundo-branco" id="case">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∴</span><span className="regua"></span><span className="kicker">O case</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">O Grupo Expoband já vendia muito. <span className="ac ac74">Faltava a rotina que sustenta.</span></h2>
            <p className="lead apoio">Vinte e oito meses de geração de demanda para as duas empresas do grupo, de agosto de 2022 a dezembro de 2024.</p>
          </div>

          <article className="caso rv" style={{ '--glow': '#F0834F' }}>
            <div className="caso-topo">
              <div className="caso-logo"></div>
            </div>

            <div className="grupo">
              <a className="grupo-emp" href="https://www.neoband.com.br" target="_blank" rel="noopener">
                <span className="grupo-slot" aria-hidden="true"></span>
                <h4>Neoband</h4>
                <p>Gráfica de comunicação visual em São Bernardo do Campo, com mais de quarenta anos. Produz ponto de venda, sinalização, mídia externa, vitrinismo e projetos especiais para todo o país.</p>
                <span className="grupo-link">neoband.com.br <span className="seta">→</span></span>
              </a>
              <a className="grupo-emp" href="https://grpexpomix.com.br" target="_blank" rel="noopener">
                <span className="grupo-slot" aria-hidden="true"></span>
                <h4>Expomix</h4>
                <p>Fundada em 2013, fabrica gôndolas, checkouts, expositores, ilhas de ponto de venda e porta-paletes. Mais de cem colaboradores e oito mil metros quadrados de fábrica, atendendo o Brasil inteiro.</p>
                <span className="grupo-link">grpexpomix.com.br <span className="seta">→</span></span>
              </a>
            </div>

            <p className="caso-txt">A Emcomjunto assumiu a geração de demanda da Expoband, de material e comunicação para ponto de venda. A operação começou com uma comunicação única para o mercado inteiro. Ao separar as aplicações e personalizar mensagem, página e oferta para cada uma, o custo por lead caiu e a qualificação subiu, dentro do mesmo patamar de investimento.</p>

            <div className="fizemos">
              <p className="caso-rot">O que fizemos</p>
              <p className="fizemos-abre">Em vez de trabalhar uma comunicação genérica para todo o mercado, estruturamos a operação por família de produto + aplicação + segmento.</p>

              <div className="formula" aria-hidden="true">
                <span className="formula-p">Família de produto</span>
                <span className="formula-op">+</span>
                <span className="formula-p">Aplicação</span>
                <span className="formula-op">+</span>
                <span className="formula-p">Segmento</span>
              </div>

              <p className="fizemos-sub">Cada combinação passou a receber:</p>
              <ul className="fizemos-itens">
                <li>ofertas mais específicas</li>
                <li>mensagens adaptadas ao contexto</li>
                <li>criativos próprios</li>
                <li>landing pages dedicadas</li>
                <li>formulários para ampliar a qualificação</li>
                <li>campanhas de mídia segmentadas</li>
                <li>SEO integrado às frentes de aquisição</li>
                <li>acompanhamento de volume e qualidade dos leads</li>
              </ul>

              <p className="fizemos-fecha">Assim, não analisávamos apenas quanto custava gerar um contato.</p>
              <p className="fizemos-fecha">Buscávamos entender quais campanhas estavam trazendo pessoas com maior aderência e maior possibilidade de avançar comercialmente.</p>
            </div>

            <div className="virada" id="virada" ref={viradaContainerRef}>
              <div className="virada-cab">
                <p className="virada-titulo">O que existia, e o que passou a existir</p>
                <div className="virada-abas" role="tablist" aria-label="Antes e depois da Emcomjunto">
                  <button className="virada-btn" type="button" role="tab" ref={(el) => (viradaBotoesRef.current[0] = el)} id="va1" aria-controls="vpA" aria-selected={viradaAtiva === 0} onClick={() => setViradaAtiva(0)} onKeyDown={(e) => aoTecladoVirada(e, 0)}>Antes</button>
                  <button className="virada-btn" type="button" role="tab" ref={(el) => (viradaBotoesRef.current[1] = el)} id="va2" aria-controls="vpB" aria-selected={viradaAtiva === 1} onClick={() => setViradaAtiva(1)} onKeyDown={(e) => aoTecladoVirada(e, 1)}>Com a Emcomjunto</button>
                  <span className="virada-corre" aria-hidden="true"></span>
                </div>
              </div>

              <div className="virada-painel" role="tabpanel" id="vpA" aria-labelledby="va1" hidden={viradaAtiva !== 0}>
                <ul className="virada-itens">
                  {VIRADA_ANTES.map((v) => (
                    <li className="virada-item" key={v.n}><span className="virada-n">{v.n}</span><h4>{v.t}</h4><p>{v.p}</p></li>
                  ))}
                </ul>
              </div>

              <div className="virada-painel" role="tabpanel" id="vpB" aria-labelledby="va2" hidden={viradaAtiva !== 1}>
                <ul className="virada-itens">
                  {VIRADA_DEPOIS.map((v) => (
                    <li className="virada-item on" key={v.n}><span className="virada-n">{v.n}</span><h4>{v.t}</h4><p>{v.p}</p></li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="placar" id="placar">
              <li><b><CountUp as="span" className="cnt" alvo={4500} prefixo="+" sep threshold={0.6} duracao={1600} /></b><span className="rot">leads captados</span></li>
              <li><b><CountUp as="span" className="cnt" alvo={35} prefixo="< R$ " threshold={0.6} duracao={1600} /></b><span className="rot">custo por lead</span></li>
              <li><b><CountUp as="span" className="cnt" alvo={33} sufixo="%" threshold={0.6} duracao={1600} /></b><span className="rot">classificados como qualificados</span></li>
              <li><b><CountUp as="span" className="cnt" alvo={8} sufixo="%" threshold={0.6} duracao={1600} /></b><span className="rot">de conversão nas landing pages</span></li>
            </ul>

            <div className="alcance">
              <p className="alcance-titulo">Além do volume, as campanhas chegaram a empresas relevantes como:</p>
              <ul className="alcance-marcas">
                {['Nissin', 'Arezzo', 'Hapvida', 'Sicredi', 'Gimba', 'Elgin', 'Outlet Lingerie', 'ELG'].map((m) => (
                  <li key={m}><span className="alcance-slot">{m}</span></li>
                ))}
              </ul>
              <p className="alcance-nota">entre outras.</p>
            </div>

            <div className="fecho" id="fecho" ref={fechoRef}>
              <p className="caso-rot">O aprendizado</p>
              <p className="fecho-frase">
                A evolução veio de{' '}
                {MOVIMENTOS.map((m, i) => (
                  <span className="mv" key={m} ref={(el) => (fechoItensRef.current[i] = el)}>
                    {m}
                    {i < MOVIMENTOS.length - 1 ? (i === MOVIMENTOS.length - 2 ? ' e ' : ', ') : ''}
                  </span>
                ))}
                .
              </p>
            </div>

            <p className="caso-fonte">Fonte: operação da Emcomjunto no Grupo Expoband, de agosto de 2022 a dezembro de 2024.</p>
            <a className="btn btn--contorno" href="/cases">Ver todos os cases <span className="seta">→</span></a>
          </article>
        </div>
      </section>

      {/* ============================= ⊕ · SUNIT ============================= */}
      <section className="secao bloco escuro fundo-sunit" id="sunit">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">⊕</span><span className="regua"></span><span className="kicker">Canal próprio</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Antes de bater na porta, <span className="ac ac74">vale ser referência.</span></h2>
            <p className="lead apoio">Marca e conteúdo também são caminho comercial. O SunIt é o portal que a Emcomjunto criou e mantém para provar isso na prática.</p>
          </div>

          <div className="sunit">
            <div className="rv">
              <p className="sunit-lead">O SunIt é um portal de informação sobre tecnologia, inovação e negócios. Publica notícia, análise e entrevista para os setores em que a Emcomjunto atua e, no mesmo movimento, abre conversa com quem lê. É um veículo de verdade que também funciona como porta de entrada comercial.</p>

              <div className="sunit-pontos">
                <div className="sunit-ponto">
                  <span className="n">01</span>
                  <h3>Conteúdo que o mercado procura</h3>
                  <p>Pauta de setor, não catálogo de fornecedor. Varejo e retail media, ESG, efluentes, energia, risco, infraestrutura, saúde e negócios, com apuração e fonte.</p>
                </div>
                <div className="sunit-ponto">
                  <span className="n">02</span>
                  <h3>Newsletters por tema</h3>
                  <p>Quem assina escolhe os temas que quer receber. A base nasce segmentada, com finalidade declarada e consentimento registrado, o que já entrega o recorte pronto para a conversa comercial.</p>
                </div>
                <div className="sunit-ponto">
                  <span className="n">03</span>
                  <h3>Uma porta de entrada mais leve</h3>
                  <p>Chegar como veículo que cobre o setor encontra menos resistência do que chegar como fornecedor que quer vender. A primeira conversa começa em outro lugar, e o assunto é o mercado da pessoa.</p>
                </div>
              </div>

              <p className="sunit-nota">O portal é um canal da própria Emcomjunto. O mesmo método vale para a marca do cliente, para os canais da Emcomjunto ou para os dois em paralelo. Qual entra, e em que ordem, sai do diagnóstico.</p>
            </div>

            <aside className="sunit-painel rv">
              <div className="sunit-marca">
                <SunitLogo />
              </div>
              <p className="sunit-tag">tecnologia, inovação e negócios em movimento</p>

              <div className="sunit-eds">
                <p className="kicker">Editorias</p>
                <ul>
                  {['Varejo', 'ESG', 'Efluentes', 'Energia', 'Risco', 'Infraestrutura', 'Saúde', 'Negócios'].map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>

              <a className="sunit-link" href="https://portalsunit.tec.br" target="_blank" rel="noopener">
                portalsunit.tec.br <span className="seta">→</span>
              </a>

              <p className="sunit-cred">Portal criado, desenvolvido e mantido pela Emcomjunto.</p>
            </aside>
          </div>
        </div>
      </section>

      {/* ============================= ↦ · PRÓXIMO PASSO ============================= */}
      <section className="secao bloco claro fundo-cinza" id="proximo">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">↦</span><span className="regua"></span><span className="kicker">Próximo passo</span>
          </div>

          <div className="proximo" id="contato">
            <div className="rv">
              <h2 className="d56">Vamos fazer um <span className="ac ac74">Diagnóstico Comercial e Criativo?</span></h2>
              <p className="explica lead">Você conta onde a venda para o varejo está travando. A gente estuda o mercado, olha a operação que já existe e devolve uma leitura inicial com os caminhos que fazem sentido testar primeiro.</p>

              <figure className="mapa rv">
                <svg viewBox="0 0 460 296" role="img" aria-label="O mercado inteiro passa por uma função e vira o seu recorte">
                  <text className="mapa-rot" x="4" y="24">O MERCADO INTEIRO</text>
                  <rect className="mapa-caixa" x="4" y="40" width="176" height="212" rx="18" />
                  <g className="mapa-pontos">
                    <circle cx="44" cy="80" r="4.5" /><circle cx="96" cy="66" r="4.5" />
                    <circle cx="146" cy="92" r="4.5" /><circle cx="36" cy="132" r="4.5" />
                    <circle cx="88" cy="118" r="4.5" /><circle cx="140" cy="146" r="4.5" />
                    <circle cx="58" cy="180" r="4.5" /><circle cx="112" cy="196" r="4.5" />
                    <circle cx="150" cy="212" r="4.5" /><circle cx="76" cy="228" r="4.5" />
                  </g>

                  <text className="mapa-f" x="228" y="132">ƒ</text>
                  <path className="mapa-seta" d="M198 152h64m-10-7 10 7-10 7" />

                  <text className="mapa-rot" x="280" y="24">O SEU RECORTE</text>
                  <g className="mapa-fatia f1">
                    <rect x="280" y="46" width="176" height="58" rx="14" />
                    <circle cx="306" cy="75" r="4.5" />
                    <rect className="mapa-fio" x="322" y="66" width="104" height="5" rx="2.5" />
                    <rect className="mapa-fio curto" x="322" y="80" width="62" height="5" rx="2.5" />
                  </g>
                  <g className="mapa-fatia f2">
                    <rect x="280" y="119" width="176" height="58" rx="14" />
                    <circle cx="306" cy="148" r="4.5" />
                    <rect className="mapa-fio" x="322" y="139" width="104" height="5" rx="2.5" />
                    <rect className="mapa-fio curto" x="322" y="153" width="76" height="5" rx="2.5" />
                  </g>
                  <g className="mapa-fatia f3">
                    <rect x="280" y="192" width="176" height="58" rx="14" />
                    <circle cx="306" cy="221" r="4.5" />
                    <rect className="mapa-fio" x="322" y="212" width="104" height="5" rx="2.5" />
                    <rect className="mapa-fio curto" x="322" y="226" width="50" height="5" rx="2.5" />
                  </g>
                </svg>
              </figure>
            </div>

            <div className="formulario rv">
              <h3>Apresente seu desafio</h3>
              <p className="intro">Conte onde a operação está travando. A gente responde com uma leitura inicial do seu mercado.</p>

              <form name="contato-varejo" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmitContato}>
                <input type="hidden" name="form-name" value="contato-varejo" />
                <input type="hidden" name="pagina-origem" value="varejo" />
                <p hidden><label>Não preencha: <input name="bot-field" /></label></p>

                <div className="campos">
                  <div className="campo campo--largo">
                    <label htmlFor="f-nome">Nome</label>
                    <input id="f-nome" name="nome" type="text" autoComplete="name" required placeholder="Seu nome completo" />
                  </div>
                  <div className="campo">
                    <label htmlFor="f-email">E-mail</label>
                    <input id="f-email" name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" />
                  </div>
                  <div className="campo">
                    <label htmlFor="f-tel">Telefone</label>
                    <input id="f-tel" name="telefone" type="tel" autoComplete="tel" placeholder="(11) 90000-0000" />
                  </div>
                  <div className="campo">
                    <label htmlFor="f-cargo">Cargo</label>
                    <input id="f-cargo" name="cargo" type="text" autoComplete="organization-title" placeholder="Seu cargo" />
                  </div>
                  <div className="campo">
                    <label htmlFor="f-empresa">Empresa</label>
                    <input id="f-empresa" name="empresa" type="text" autoComplete="organization" placeholder="Nome da empresa" />
                  </div>
                  <div className="campo campo--largo">
                    <label htmlFor="f-recorte">O que você vende para o varejo</label>
                    <select id="f-recorte" name="recorte" defaultValue="">
                      <option value="">Selecione</option>
                      <option>Mercadorias e sortimento</option>
                      <option>Mobiliário e equipamentos</option>
                      <option>Comunicação visual</option>
                      <option>Estoque e centros de distribuição</option>
                      <option>Tecnologia para ponto de venda</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div className="campo campo--largo">
                    <label htmlFor="f-msg">Mensagem</label>
                    <textarea id="f-msg" name="mensagem" placeholder="Qual é o desafio comercial de hoje?"></textarea>
                  </div>
                </div>

                <div className="form-acoes">
                  <button className="btn btn--primario" type="submit">
                    Enviar
                    <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <p className="form-nota">Usamos seus dados apenas para responder a este contato.</p>
                  <FormStatus status={statusContato} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

// O <img onerror> do HTML original trocava a logo do SunIt por um texto
// reserva se a imagem falhasse ao carregar — porta com useState em vez de
// manipular o DOM diretamente.
function SunitLogo() {
  const [falhou, setFalhou] = useState(false)
  if (falhou) return <span className="reserva">SUN IT</span>
  return (
    <img
      src="https://portalsunit.tec.br/wp-content/uploads/2026/06/cropped-logo_site_branco.png"
      alt="SUN IT"
      onError={() => setFalhou(true)}
    />
  )
}
