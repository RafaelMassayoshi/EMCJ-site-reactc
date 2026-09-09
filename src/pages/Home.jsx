import { useEffect, useRef, useState } from 'react'
import MainLayout from '../layouts/MainLayout.jsx'
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
import '../styles/pages/home.css'

const JORNADA = [
  { n: '01', t: 'Comunicação', p: 'Nascemos com força em comunicação, criação, conteúdo, design, desenvolvimento de websites, audiovisual e branding.' },
  { n: '02', t: 'Growth marketing', p: 'Evoluímos para growth marketing, com testes, dados, mídia, CRM, otimização e escala do que funciona.' },
  { n: '03', t: 'Rotinas comerciais', p: 'Nos aproximamos das rotinas comerciais: geração de demanda, prospecção ativa, funis, qualificação, agendamento de reuniões e resultado comercial.' },
  { n: '04', t: 'Assessoria Comercial Criativa', p: 'Hoje reunimos tudo isso em uma assessoria comercial criativa: uma estrutura que combina marketing, tecnologia e vendas trabalhando no mesmo time, com os mesmos objetivos.' },
]

const FORNECEDORES = [
  { rot: 'Mídia', sep: 'Otimiza CPC, CPL e conversão da campanha.', emcj: 'Conecta mídia a público, oferta, página, qualificação, CRM e reunião. Anúncio que gera lead que não avança não é bom anúncio.' },
  { rot: 'Prospecção', sep: 'Trabalha a lista e tenta marcar reunião.', emcj: 'Começa antes: estuda o mercado, define contas e decisores, revisa a oferta e cria os argumentos da cadência.' },
  { rot: 'Produção', sep: 'Entrega foto e vídeo com qualidade.', emcj: 'Pergunta para que a peça serve: reduzir objeção, abrir conta ABM, apoiar o vendedor ou sustentar uma página.' },
  { rot: 'CRM e automação', sep: 'Configura pipeline, campo e disparo.', emcj: 'Faz a ferramenta refletir o processo real de venda: quem entra, quando qualificar, o que perguntar e o que medir.' },
  { rot: 'Comunicação', sep: 'Cuida da marca, do conteúdo e da presença.', emcj: 'Parte da meta comercial: que mercado abrir, que conta alcançar, que oportunidade gerar. Depois vem a peça.' },
]

// Trilha SVG "hipótese → teste → dados → aprendizado → evolução": um
// viajante anda pelo caminho em loop e acende o ponto que alcança. Porta
// 1:1 do bloco correspondente de js/pages/home.js.
function useTrilhaViajante() {
  useEffect(() => {
    const caixaTrilha = document.getElementById('trilhaCaixa')
    const via = document.getElementById('via')
    const viajante = document.getElementById('viajante')
    const pontos = Array.from(document.querySelectorAll('.trilha .ponto'))
    if (!caixaTrilha || !via || !viajante || !pontos.length) return undefined

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const COMPR = via.getTotalLength()
    const DUR = 18000

    const marcos = pontos.map((p) => {
      const c = p.querySelector('circle')
      const cx = parseFloat(c.getAttribute('cx'))
      const cy = parseFloat(c.getAttribute('cy'))
      let melhor = 0
      let dmin = Infinity
      for (let l = 0; l <= COMPR; l += COMPR / 900) {
        const pt = via.getPointAtLength(l)
        const d = (pt.x - cx) * (pt.x - cx) + (pt.y - cy) * (pt.y - cy)
        if (d < dmin) {
          dmin = d
          melhor = l
        }
      }
      return melhor
    })

    let atual = -1
    function posiciona(dist) {
      const pt = via.getPointAtLength(dist)
      viajante.setAttribute('transform', 'translate(' + pt.x.toFixed(2) + ',' + pt.y.toFixed(2) + ')')
      let i = 0
      for (let k = 0; k < marcos.length; k++) {
        if (dist >= marcos[k] - 6) i = k
      }
      if (i !== atual) {
        atual = i
        pontos.forEach((p, k) => p.classList.toggle('on', k === i))
      }
    }

    let rodando = false
    let inicio = null
    let quadro = null
    function passo(t) {
      if (inicio === null) inicio = t
      const frac = ((t - inicio) % DUR) / DUR
      posiciona(frac * COMPR)
      quadro = requestAnimationFrame(passo)
    }
    posiciona(0)

    let ot
    if ('IntersectionObserver' in window) {
      ot = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              caixaTrilha.classList.add('dentro')
              if (!reduzido && !rodando) {
                rodando = true
                inicio = null
                quadro = requestAnimationFrame(passo)
              }
            } else if (rodando) {
              rodando = false
              cancelAnimationFrame(quadro)
            }
          })
        },
        { threshold: 0.2 },
      )
      ot.observe(caixaTrilha)
    } else {
      caixaTrilha.classList.add('dentro')
    }

    return () => {
      if (ot) ot.disconnect()
      if (quadro) cancelAnimationFrame(quadro)
    }
  }, [])
}

export default function Home() {
  useDocumentMeta({
    title: 'Emcomjunto — Assessoria Comercial Criativa',
    description: 'Onde demanda e oferta se cruzam. Marketing, tecnologia e vendas dentro do mesmo plano comercial.',
    canonical: 'https://emcomjunto.com.br/',
  })
  useReveal()
  useVertentesPronto()
  useCartaoBlob()
  useTrilhaViajante()

  const [abaJornada, setAbaJornada] = useState(0)
  const [abaFornecedor, setAbaFornecedor] = useState(0)
  const [trocando, setTrocando] = useState(false)
  const abasJornadaRef = useRef([])
  const abasFornRef = useRef([])
  const { status, handleSubmit } = useFormWebhook()

  function selecionarFornecedor(i) {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido) {
      setAbaFornecedor(i)
      return
    }
    setTrocando(true)
    setTimeout(() => {
      setAbaFornecedor(i)
      setTrocando(false)
    }, 260)
  }

  function aoTecladoJornada(e, i) {
    let n = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % JORNADA.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + JORNADA.length) % JORNADA.length
    if (n !== null) {
      e.preventDefault()
      abasJornadaRef.current[n]?.focus()
      setAbaJornada(n)
    }
  }

  function aoTecladoFornecedor(e, i) {
    let n = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % FORNECEDORES.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + FORNECEDORES.length) % FORNECEDORES.length
    if (n !== null) {
      e.preventDefault()
      abasFornRef.current[n]?.focus()
      selecionarFornecedor(n)
    }
  }

  return (
    <MainLayout
      pageClassName="pagina-home"
      headerProps={{ ctaHref: '#contato', ctaLabel: 'Diagnóstico' }}
      footerProps={{
        topo: {
          headingA: 'Criatividade para abrir caminho.',
          headingB: 'Processo para fechar.',
          lead: 'Apresente seu desafio. A gente estuda seu mercado, desenha os caminhos de geração de demanda e vai atrás das suas metas junto com o seu time.',
          ctaHref: 'mailto:contato@emcomjunto.com.br',
          ctaLabel: 'Apresente seu desafio',
        },
      }}
    >
      {/* ============================= HERO ============================= */}
      <section className="hero hero-home secao" id="topo">
        <div className="hero-brilho" id="heroBrilho" aria-hidden="true"></div>
        <div className="hero-scrim" aria-hidden="true"></div>

        <div className="vertentes" id="vertentes" aria-hidden="true">
          <svg className="fios" viewBox="0 0 600 552" preserveAspectRatio="none">
            <circle className="nucleo" cx="300" cy="276" r="118" fill="none" />
            <line x1="132" y1="76" x2="300" y2="276" />
            <line x1="486" y1="248" x2="300" y2="276" />
            <line x1="196" y1="490" x2="300" y2="276" />
          </svg>
          <div className="marca-nucleo">
            <svg viewBox="0 0 150 121"><use href="#emcj-logo" /></svg>
          </div>
          <div className="vertente v-mkt">Marketing<i></i></div>
          <div className="vertente v-tec">Tecnologia<i></i></div>
          <div className="vertente v-vnd">Vendas<i></i></div>
        </div>

        <div className="shell hero-conteudo">
          <div className="filete rv"></div>
          <h1 className="d64 rv">Uma representação comercial que <span className="ac ac90">vende e assessora</span> você em seus processos</h1>
          <p className="hero-lead rv">Geramos demanda, oportunidades, reuniões e vendas, testamos caminhos e comunicações, e criamos ferramentas e estratégias comerciais para fortalecer sua operação comercial e gerar aprendizados e resultados.</p>
          <div className="hero-acoes rv">
            <a className="btn btn--primario" href="#contato">Apresente seu desafio</a>
            <a className="btn btn--texto" href="#modelo">Como trabalhamos <span className="seta">→</span></a>
          </div>
        </div>
      </section>

      {/* ============================= U · MERCADO ============================= */}
      <section className="secao bloco claro fundo-branco">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">U</span><span className="regua"></span><span className="kicker">Mercado</span>
          </div>
          <div className="mercado">
            <div className="rv">
              <h2 className="d40">Entre o interesse e a venda, existe um espaço onde muita <span className="ac ac53">oportunidade se perde.</span></h2>
              <div className="paragrafos" style={{ marginTop: 'var(--esp-6)' }}>
                <p className="lead">Marketing e vendas precisam trabalhar na mesma direção. Muitas empresas têm bons produtos, bons serviços e bom time comercial, mas ainda enfrentam dificuldade para abrir novas conversas, chegar aos decisores certos e transformar ações de marketing em oportunidades reais.</p>
              </div>
            </div>
            <div className="lados esc">
              <article className="lado">
                <p className="kicker">De um lado</p>
                <p>O marketing concentra energia em marca, conteúdo e campanhas. O sucesso é medido por alcance, engajamento e volume de leads.</p>
              </article>
              <div className="entre"><span></span>Entre as duas áreas, oportunidade se perde</div>
              <article className="lado lado--b">
                <p className="kicker">Do outro</p>
                <p>O comercial foca nas carteiras que já garantem o faturamento. O que chega de fora entra na fila e nem sempre volta como informação.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= Σ · COMBINAÇÃO ============================= */}
      <section className="secao bloco escuro fundo-escuro">
        <div className="shell combinacao">
          <div className="simbolo-linha rv">
            <span className="simbolo">Σ</span><span className="regua"></span><span className="kicker">Combinação</span>
          </div>
          <h2 className="d56 rv">Nosso diferencial está na <span className="ac ac74">combinação.</span></h2>
          <p className="explica rv">A mesma operação que estuda o mercado cria a mensagem, gera demanda, acompanha qualificação e transforma aprendizado em material, processo e ferramenta.</p>

          <div className="combo-metrica rv">
            <CountUp className="valor" alvo={800} prefixo="+" />
            <span className="rotulo">oportunidades de negócios qualificadas todos os meses para nossos clientes</span>
            <span className="nota">Volume médio da operação em B2B, vendas consultivas, segmentos técnicos e pesquisa clínica.</span>
          </div>
        </div>
      </section>

      {/* ============================= ⊂ · O QUE FAZEMOS ============================= */}
      <section className="secao bloco escuro fundo-escuro" id="modelo">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">⊂</span><span className="regua"></span><span className="kicker">Recorte</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">O que <span className="ac ac74">fazemos</span></h2>
            <p className="lead apoio">Ajudamos empresas a encontrar oportunidades, abrir conversas e organizar o caminho até a venda. Nosso trabalho não começa na campanha e não termina no lead.</p>
          </div>

          <div className="bento esc" id="bento">
            <article className="cartao cartao--grande" style={{ '--glow': '#41AFFF' }}>
              <span className="borrao deriva-1" aria-hidden="true"><i></i></span>
              <p className="kicker">Geração de demanda</p>
              <div className="conteudo">
                <h3>Inbound, outbound e ABM para abrir novas frentes comerciais.</h3>
                <p className="txt">Campanhas, prospecção ativa, bases, listas qualificadas, mensagens e fluxos de abordagem.</p>
              </div>
            </article>

            <article className="cartao" style={{ '--glow': '#40A0E7' }}>
              <span className="borrao deriva-2" aria-hidden="true"><i></i></span>
              <p className="kicker">Prospecção e qualificação</p>
              <p className="txt">CRM, automações e IA para organizar o avanço comercial.</p>
            </article>

            <article className="cartao" style={{ '--glow': '#C47E6E' }}>
              <span className="borrao deriva-3" aria-hidden="true"><i></i></span>
              <p className="kicker">Conteúdo e materiais</p>
              <p className="txt">Websites, landing pages, apresentações, propostas, vídeos, artigos e cases.</p>
            </article>

            <article className="cartao" style={{ '--glow': '#80C0EF' }}>
              <span className="borrao deriva-4" aria-hidden="true"><i></i></span>
              <p className="kicker">Análise e otimização</p>
              <p className="txt">Indicadores, dashboards, leitura de qualidade e evolução contínua.</p>
            </article>

            <article className="cartao" style={{ '--glow': '#B55D49' }}>
              <span className="borrao deriva-5" aria-hidden="true"><i></i></span>
              <p className="kicker">Sistemas e playbooks</p>
              <p className="txt">Ferramentas, agentes, automações, treinamentos e documentação.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============================= ∞ · CAMINHOS ============================= */}
      <section className="secao bloco claro fundo-cinza">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∞</span><span className="regua"></span><span className="kicker">Caminhos</span>
          </div>

          <div className="caminhos">
            <div className="rv">
              <h2 className="d56">Criatividade, para nós, não é apenas criar uma peça bonita. <span className="ac ac74">É encontrar caminhos.</span></h2>
              <p className="explica lead">Uma nova abordagem, um conteúdo que abre conversa, uma landing page, um portal, uma entrevista, um sistema, uma automação, um agente de IA, um roteiro de prospecção ou uma forma diferente de chegar a uma conta estratégica. O objetivo é sempre o mesmo: gerar oportunidades e fortalecer o processo comercial.</p>
            </div>

            <div className="trilha-caixa rv" id="trilhaCaixa">
              <svg className="trilha" id="trilha" viewBox="0 0 460 560" role="img" aria-label="Trilha contínua entre hipótese, teste, dados, aprendizado e evolução">
                <path className="via" id="via" pathLength="1000" d="M 86 58 C 236 58, 300 96, 300 168 C 300 240, 96 214, 110 286 C 124 358, 340 322, 318 396 C 300 456, 116 442, 150 508" />
                <path className="via-viva" pathLength="1000" d="M 86 58 C 236 58, 300 96, 300 168 C 300 240, 96 214, 110 286 C 124 358, 340 322, 318 396 C 300 456, 116 442, 150 508" />

                <g className="ponto on" data-i="0">
                  <circle cx="86" cy="58" r="7" />
                  <text x="106" y="52">HIPÓTESE</text>
                </g>
                <g className="ponto" data-i="1">
                  <circle cx="300" cy="168" r="7" />
                  <text x="320" y="162">TESTE</text>
                </g>
                <g className="ponto" data-i="2">
                  <circle cx="110" cy="286" r="7" />
                  <text x="130" y="280">DADOS</text>
                </g>
                <g className="ponto" data-i="3">
                  <circle cx="318" cy="396" r="7" />
                  <text x="338" y="390">APRENDIZADO</text>
                </g>
                <g className="ponto" data-i="4">
                  <circle cx="150" cy="508" r="7" />
                  <text x="170" y="502">EVOLUÇÃO</text>
                </g>

                <g className="viajante-grupo" id="viajante">
                  <circle className="halo" r="16" />
                  <circle className="viajante-anel" r="9" />
                  <circle className="viajante" r="4.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= ∩ · MERCADOS ============================= */}
      <section className="secao bloco escuro fundo-escuro" id="mercados">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∩</span><span className="regua"></span><span className="kicker">Encaixe</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Três mercados onde a operação já <span className="ac ac74">encontrou caminho.</span></h2>
            <p className="lead apoio">Cada mercado tem um decisor, um argumento e um tempo de decisão diferentes. Por isso a estratégia é montada por segmento, aplicação e momento comercial.</p>
          </div>

          <div className="mercados esc">
            <a className="cartao cartao--mercado" href="/varejo" style={{ '--glow': '#1F88D6' }}>
              <span className="borrao deriva-3" aria-hidden="true"><i></i></span>
              <p className="kicker">01 · Mercado</p>
              <h3>Varejo</h3>
              <p className="txt">Empresas que vendem para o varejo: mercadorias, mobiliário e equipamentos, comunicação visual, estruturas de estoque e tecnologia para ponto de venda.</p>
              <span className="card-link">Ver o mercado de varejo <span className="seta">→</span></span>
            </a>

            <a className="cartao cartao--mercado" href="/esg-eficiencia-riscos" style={{ '--glow': '#B55D49' }}>
              <span className="borrao deriva-1" aria-hidden="true"><i></i></span>
              <p className="kicker">02 · Mercado</p>
              <h3>ESG, eficiência e riscos</h3>
              <p className="txt">Energia, tratamento de água e efluentes, segurança do trabalho, qualidade e tecnologia para gestão de riscos. Venda consultiva, muitos decisores.</p>
              <span className="card-link">Ver o mercado técnico <span className="seta">→</span></span>
            </a>

            <a className="cartao cartao--mercado" href="/pesquisa-clinica" style={{ '--glow': '#9BD4F4' }}>
              <span className="borrao deriva-5" aria-hidden="true"><i></i></span>
              <p className="kicker">03 · Mercado</p>
              <h3>Pesquisa clínica</h3>
              <p className="txt">Centros, patrocinadores e parceiros. Comunicação, geração de demanda e recrutamento, com unidade dedicada, a Random Pesquisa.</p>
              <span className="card-link">Ver pesquisa clínica <span className="seta">→</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* Seção de parceiros: comentada/desativada no HTML original (a
          esteira de logos não era exibida na home) — preservada assim. */}

      {/* ============================= → · JORNADA ============================= */}
      <section className="secao bloco claro fundo-cinza" id="a-emcomjunto">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">Δ</span><span className="regua"></span><span className="kicker">Jornada</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">A Emcomjunto chegou a esse modelo <span className="ac ac74">pela prática.</span></h2>
            <p className="lead apoio">Não partimos de uma tese. Cada camada foi somada porque a anterior mostrou onde o resultado parava.</p>
          </div>

          <div className="jornada rv">
            <div className="jornada-abas" role="tablist" aria-label="Nossa jornada">
              {JORNADA.map((j, i) => (
                <button
                  key={j.n}
                  type="button"
                  role="tab"
                  ref={(el) => (abasJornadaRef.current[i] = el)}
                  id={'j' + (i + 1)}
                  aria-controls={'jp' + (i + 1)}
                  aria-selected={abaJornada === i}
                  onClick={() => setAbaJornada(i)}
                  onKeyDown={(e) => aoTecladoJornada(e, i)}
                >
                  <span className="n">{j.n}</span><span className="t">{j.t}</span>
                </button>
              ))}
            </div>
            {JORNADA.map((j, i) => (
              <div
                key={j.n}
                className="jornada-painel"
                role="tabpanel"
                id={'jp' + (i + 1)}
                aria-labelledby={'j' + (i + 1)}
                hidden={abaJornada !== i}
              >
                <p>{j.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= ∈ · DECISÃO + CONTATO ============================= */}
      <section className="secao bloco claro fundo-branco" id="decisao">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∈</span><span className="regua"></span><span className="kicker">Decisão</span>
          </div>

          <div className="decisao" id="contato">
            <div className="rv">
              <h2 className="d56">Cinco fornecedores fazendo bem a parte deles <span className="ac ac74">não fazem um plano comercial.</span></h2>
              <p className="explica lead" style={{ marginTop: 'var(--esp-6)', maxWidth: '56ch' }}>Não queremos substituir todo especialista do mercado. Muitas vezes trabalhamos junto com times internos, agências e produtoras. O diferencial é assumir a visão integrada.</p>

              <div className="fornecedores" role="tablist" aria-label="Escolha um fornecedor" style={{ marginTop: 'clamp(28px,3.2vw,44px)' }}>
                {FORNECEDORES.map((f, i) => (
                  <button
                    key={f.rot}
                    className="forn"
                    type="button"
                    role="tab"
                    ref={(el) => (abasFornRef.current[i] = el)}
                    aria-selected={abaFornecedor === i}
                    onClick={() => selecionarFornecedor(i)}
                    onKeyDown={(e) => aoTecladoFornecedor(e, i)}
                  >
                    {f.rot}
                  </button>
                ))}
              </div>

              <div className={'confronto' + (trocando ? ' trocando' : '')} id="confronto" role="tabpanel" aria-live="polite">
                <div className="metade sep">
                  <p className="rot"><span className="marcador"></span>Contratando separado</p>
                  <p id="txtSep">{FORNECEDORES[abaFornecedor].sep}</p>
                </div>
                <div className="metade emcj">
                  <p className="rot"><span className="marcador"></span>Com a Emcomjunto</p>
                  <p id="txtEmcj">{FORNECEDORES[abaFornecedor].emcj}</p>
                </div>
              </div>
            </div>

            <div className="formulario rv">
              <h3>Apresente seu desafio</h3>
              <p className="intro">Conte onde a operação está travando. A gente responde com uma leitura inicial do seu mercado.</p>

              <form name="contato" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmit}>
                <input type="hidden" name="form-name" value="contato" />
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
                  <div className="campo">
                    <label htmlFor="f-setor">Setor de atuação</label>
                    <select id="f-setor" name="setor" defaultValue="">
                      <option value="">Selecione</option>
                      <option>Varejo e fornecedores</option>
                      <option>Indústria</option>
                      <option>Tecnologia e SaaS</option>
                      <option>Distribuição e logística</option>
                      <option>Saúde e pesquisa clínica</option>
                      <option>Energia, ESG e meio ambiente</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label htmlFor="f-origem">Como conheceu a EMCJ</label>
                    <select id="f-origem" name="origem" defaultValue="">
                      <option value="">Selecione</option>
                      <option>Indicação</option>
                      <option>LinkedIn</option>
                      <option>Busca no Google</option>
                      <option>Evento</option>
                      <option>Prospecção da Emcomjunto</option>
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
                  <FormStatus status={status} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
