import { useEffect, useRef, useState } from 'react'
import MainLayout from '../layouts/MainLayout.jsx'
import Trilho from '../components/Trilho.jsx'
import FormStatus from '../components/FormStatus.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import useReveal from '../hooks/useReveal.js'
import useFormWebhook from '../hooks/useFormWebhook.js'

import '../styles/components/buttons.css'
import '../styles/components/nav.css'
import '../styles/components/hero.css'
import '../styles/components/cards.css'
import '../styles/components/esteira.css'
import '../styles/components/forms.css'
import '../styles/components/footer.css'
import '../styles/components/trilho.css'
import '../styles/pages/o-que-fazemos.css'

const FRENTES = [
  { id: 'f1', titulo: 'Mercado e estratégia', conteudo: (
    <>
      <h3>Mercado e estratégia</h3>
      <p className="via-txt">Estudamos mercados, públicos, concorrentes, decisores, oportunidades e hipóteses de crescimento.</p>
      <p className="via-por">Serve para saber onde existe espaço antes de gastar verba tentando descobrir isso no anúncio.</p>
    </>
  ) },
  { id: 'f2', titulo: 'Diagnóstico interno', conteudo: (
    <>
      <h3>Diagnóstico interno</h3>
      <p className="via-txt">Analisamos processo comercial, equipe, carteira, base, metas, CRM, sistemas, materiais, site, comunicação, mídia e estratégias atuais.</p>
      <p className="via-por">É o retrato de onde a operação está hoje. Sem ele, qualquer proposta é chute sobre escopo imaginado.</p>
    </>
  ) },
  { id: 'f3', titulo: 'Preparação do terreno', conteudo: (
    <>
      <h3>Preparação do terreno</h3>
      <p className="via-txt">Revisamos ou construímos os elementos necessários para melhorar a operação antes de acelerar: páginas, apresentações, scripts, CRM, automações, conteúdos, agentes de IA e processos.</p>
      <p className="via-por">Demanda chegando num terreno despreparado vira lead parado na caixa de entrada.</p>
    </>
  ) },
  { id: 'f4', titulo: 'Demanda e prospecção', conteudo: (
    <>
      <h3>Demanda e prospecção</h3>
      <p className="via-txt">Ativamos inbound, outbound, ABM, mídia, conteúdo, parceiros, eventos e outros canais para abrir novas conversas.</p>
      <p className="via-por">É de onde vem a oportunidade. Qual canal entra e em que ordem depende do ciclo e do decisor de cada venda.</p>
    </>
  ) },
  { id: 'f5', titulo: 'Qualificação e desenvolvimento', conteudo: (
    <>
      <h3>Qualificação e desenvolvimento comercial</h3>
      <p className="via-txt">Atendemos, enriquecemos informações, qualificamos, nutrimos, realizamos follow-ups e ajudamos a transformar contatos em reuniões e oportunidades.</p>
      <p className="via-por">É a frente que separa volume de lead de pipeline de verdade.</p>
    </>
  ) },
  { id: 'f6', titulo: 'Comunicação e tecnologia', conteudo: (
    <>
      <h3>Comunicação e tecnologia</h3>
      <p className="via-txt">Criamos os materiais, sistemas e ferramentas que ajudam a estratégia e a equipe comercial a funcionar melhor.</p>
      <p className="via-por">Cada peça nasce de uma necessidade da conversa comercial, não de uma lista fixa de entregáveis.</p>
    </>
  ) },
  { id: 'f7', titulo: 'Dados, processos e evolução', conteudo: (
    <>
      <h3>Dados, processos e evolução</h3>
      <p className="via-txt">Medimos resultados, documentamos aprendizados e transformamos aquilo que funciona em processos que podem ser repetidos e ampliados.</p>
      <p className="via-por">É o que faz o aprendizado ficar na sua casa em vez de sair junto com quem executou.</p>
    </>
  ) },
]

const MARCOS = ['Entender o mercado', 'Diagnosticar a operação', 'Preparar o terreno', 'Gerar demanda', 'Qualificar', 'Construir', 'Aprender e evoluir']

const PRATICAS = [
  { icone: 'M3 4h18l-7 8v7l-4 2v-9L3 4Z', titulo: 'Mídia', gloss: 'Anúncios pagos no Google, nas redes sociais e em portais.', sep: 'Quem cuida do anúncio é cobrado pelo preço do clique e pelo número de contatos que chegam. É exatamente isso que ele entrega.', emcj: 'O anúncio nasce ligado a quem você quer alcançar, à página que essa pessoa vai ver, a quem vai atender e à reunião que precisa acontecer. Muito contato que não vira conversa não é anúncio bom — é despesa bem apresentada no relatório.' },
  { icone: 'M3 17 9 9l5 4 7-8', extra: <><circle cx="9" cy="9" r="1.4" /><circle cx="14" cy="13" r="1.4" /></>, titulo: 'Prospecção', gloss: 'Procurar empresas certas e chamar para conversar.', sep: 'Quem prospecta recebe uma lista pronta de contatos, liga, escreve e tenta marcar reunião.', emcj: 'O trabalho começa antes de a lista existir: que mercado vale abrir, quais empresas priorizar, com quem falar dentro de cada uma, que argumento usar e que material sustenta a conversa.' },
  { icone: null, titulo: 'Produção', gloss: 'Foto, vídeo e material audiovisual.', sep: 'A produtora entrega foto e vídeo com boa qualidade técnica.', emcj: 'Antes de gravar, a pergunta é para que a peça serve: responder a uma dúvida que trava a venda, abrir a porta de uma empresa específica, ajudar o vendedor na reunião ou sustentar uma página.' },
  { icone: null, titulo: 'CRM e automação', gloss: 'O sistema onde ficam seus contatos e o andamento de cada venda.', sep: 'Quem implanta a ferramenta configura as etapas, os campos e os avisos automáticos.', emcj: 'A ferramenta passa a espelhar como a sua venda acontece de verdade: quem entra, quando vale investir tempo, o que perguntar, quando encerrar e o que medir para decidir o passo seguinte.' },
  { icone: 'M12 12 16 8', extraCircle: true, titulo: 'Comunicação', gloss: 'Marca, conteúdo e presença digital.', sep: 'A agência cuida da marca, do conteúdo e da presença nas redes.', emcj: 'A comunicação parte da meta comercial: que mercado abrir, que empresa alcançar, que oportunidade gerar. A peça vem depois da decisão, não antes dela.' },
]

const ENTREGAS = [
  { id: 'eg1', nome: 'Um site', texto: 'Para que quem chega entenda o que você vende, para quem você vende e por que vale conversar — sem depender de alguém explicar por telefone.' },
  { id: 'eg2', nome: 'Um vídeo institucional', texto: 'Para responder de uma vez a dúvida que aparece em toda reunião, e encurtar o caminho até a decisão em vez de repetir a mesma explicação toda semana.' },
  { id: 'eg3', nome: 'Templates para redes sociais', texto: 'Para a sua equipe publicar com constância sem montar cada post do zero, mantendo a marca de pé mesmo nas semanas em que ninguém tem tempo.' },
  { id: 'eg4', nome: 'Uma apresentação comercial', texto: 'Para o vendedor entrar na reunião com o argumento pronto para cada tipo de decisor, e sair de lá com o próximo passo combinado.' },
  { id: 'eg5', nome: 'Uma página de campanha', texto: 'Para transformar o interesse de quem clicou no anúncio em conversa de verdade, e para saber qual público respondeu melhor a qual mensagem.' },
  { id: 'eg6', nome: 'Uma automação ou agente de IA', texto: 'Para nenhum contato ficar sem resposta e para o time gastar o tempo dele com quem tem chance real de comprar, em vez de com triagem manual.' },
]

const CASES = [
  {
    glow: '#1F88D6', mercado: 'Varejo · Tecnologia para ponto de venda', logo: 'Neoband',
    tituloA: 'Personalizar valeu mais', tituloB: 'do que investir mais.',
    txt: 'A Neoband vende material para o ponto de venda e precisava abrir conversa com grandes contas e redes de varejo. Após entender o perfil do cliente, estudar o mercado e a intenção de busca, a operação foi separada por aplicação: cada tipo de solução passou a falar com o decisor certo, com a mensagem daquele problema.',
    nums: [['+4.500', 'leads captados'], ['< R$35', 'custo por lead'], ['33%', 'classificados como qualificados'], ['8%', 'de conversão nas páginas']],
    fonte: 'Operação Neoband, agosto de 2022 a dezembro de 2024.', linkHref: '/varejo',
  },
  {
    glow: '#B55D49', mercado: 'ESG, eficiência e riscos · Tratamento de efluentes', logo: 'Gmar Ambiental',
    tituloA: 'Uma venda técnica em que cada área', tituloB: 'decide por um motivo.',
    txt: 'No mercado de tratamento de efluentes, muitas vezes a mesma solução conversa com diretoria, engenharia, sustentabilidade, qualidade, operações, TI e compras, e cada uma se preocupa com uma coisa diferente. Pensando nisso, operamos na Gmar Ambiental há mais de cinco anos, gerando dezenas de oportunidades e demanda todos os meses.',
    nums: [['R$300 mil', 'de investimento no cenário'], ['1.100', 'leads projetados'], ['64', 'clientes projetados'], ['R$6,4 mi', 'de receita projetada']],
    fonte: null, linkHref: '/cases',
  },
  {
    glow: '#9BD4F4', mercado: 'Pesquisa clínica · Centros, patrocinadores e parceiros', logo: 'Random Pesquisa',
    tituloA: 'Do público mais amplo', tituloB: 'ao critério mais estreito.',
    txt: 'Ao longo de diferentes projetos, a Emcomjunto construiu experiência assessorando centros de pesquisa, patrocinadores e parceiros em desafios de comunicação, geração de demanda e recrutamento de potenciais participantes. Nossa atuação já passou por campanhas nacionais e regionais, grandes centros urbanos e cidades do interior, estudos com públicos amplos e condições com critérios de recrutamento muito específicos.',
    nums: [['+140', 'estudos clínicos'], ['+25', 'centros assessorados'], ['+1.500', 'voluntários selecionados'], ['+8', 'estados alcançados']],
    fonte: null, linkHref: '/pesquisa-clinica',
  },
]

// Linha do tempo "quatro coisas definem o tamanho do trabalho": o fio
// estica e os marcos acendem uma vez, ao entrar na tela. Porta do bloco
// "A linha corrente" de js/pages/o-que-fazemos.js.
function useCorrentePintura(ref, ativo) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const marcos = Array.from(el.querySelectorAll('.marco'))
    const limiares = marcos.map((_, i) => (marcos.length > 1 ? i / (marcos.length - 1) : 0))

    function pinta(p) {
      el.style.setProperty('--p', p)
      marcos.forEach((m, i) => m.classList.toggle('on', p >= limiares[i] - 0.001))
    }

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido || !('IntersectionObserver' in window)) {
      pinta(1)
      return undefined
    }

    let quadro = null
    function corre() {
      const dur = 2600
      let ini = null
      function passo(t) {
        if (ini === null) ini = t
        const p = Math.min((t - ini) / dur, 1)
        pinta(p * p * (3 - 2 * p))
        if (p < 1) quadro = requestAnimationFrame(passo)
      }
      quadro = requestAnimationFrame(passo)
    }

    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return
          obs.unobserve(e.target)
          corre()
        })
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (quadro) cancelAnimationFrame(quadro)
    }
  }, [ref, ativo])
}

export default function OQueFazemos() {
  useDocumentMeta({
    title: 'O que fazemos — Emcomjunto',
    description: 'As sete frentes da Emcomjunto, o que define o escopo do trabalho, o que a gente produz e o que fica com a sua operação. Escopo que sai do diagnóstico, não de um pacote fixo de peças.',
    canonical: 'https://emcomjunto.com.br/o-que-fazemos',
  })
  useReveal()
  const { status, handleSubmit } = useFormWebhook()

  // ---------- Sonda (hero: três perguntas) ----------
  const [segmento, setSegmento] = useState(null)
  const [roda, setRoda] = useState([])
  const [desafio, setDesafio] = useState(null)
  const step1ok = segmento !== null
  const step2ok = roda.length > 0
  const step3ok = desafio !== null
  const mostraStep2 = step1ok
  const mostraStep3 = step1ok && step2ok
  const mostraFim = step1ok && step2ok && step3ok
  const etapa = [step1ok, step2ok, step3ok].filter(Boolean).length

  let sondaVivo = ''
  if (mostraFim) sondaVivo = 'Três perguntas respondidas. Role para ver como o trabalho se organiza.'
  else if (mostraStep3 && !step3ok) sondaVivo = 'Próxima pergunta: Qual é o seu maior desafio hoje?'
  else if (mostraStep2 && !step2ok) sondaVivo = 'Próxima pergunta: O que já roda hoje na sua operação?'

  function alternarRoda(valor) {
    setRoda((atual) => (atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor]))
  }

  // ---------- Entregas (acordeão) ----------
  const [entregasAbertas, setEntregasAbertas] = useState({ eg1: true })
  function alternarEntrega(id) {
    setEntregasAbertas((atual) => ({ ...atual, [id]: !atual[id] }))
  }

  // ---------- Corrente ----------
  const correnteRef = useRef(null)
  useCorrentePintura(correnteRef, true)

  // ---------- Cases (fita) ----------
  const fitaRef = useRef(null)
  const casosRef = useRef([])
  const [casoAtual, setCasoAtual] = useState(0)

  function indiceVisivel() {
    const fita = fitaRef.current
    if (!fita) return 0
    const meio = fita.scrollLeft + fita.clientWidth / 2
    let i = 0
    let melhor = Infinity
    casosRef.current.forEach((c, n) => {
      if (!c) return
      const centro = c.offsetLeft - fita.offsetLeft + c.offsetWidth / 2
      const d = Math.abs(centro - meio)
      if (d < melhor) {
        melhor = d
        i = n
      }
    })
    return i
  }

  useEffect(() => {
    const fita = fitaRef.current
    if (!fita) return undefined
    let esperando = false
    function aoRolar() {
      if (esperando) return
      esperando = true
      requestAnimationFrame(() => {
        setCasoAtual(indiceVisivel())
        esperando = false
      })
    }
    fita.addEventListener('scroll', aoRolar)
    return () => fita.removeEventListener('scroll', aoRolar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function vaiCaso(d) {
    const fita = fitaRef.current
    const i = Math.min(Math.max(indiceVisivel() + d, 0), CASES.length - 1)
    const alvo = casosRef.current[i]
    if (!fita || !alvo) return
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    fita.scrollTo({ left: alvo.offsetLeft - fita.offsetLeft, behavior: reduzido ? 'auto' : 'smooth' })
  }

  function aoTecladoFita(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); vaiCaso(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); vaiCaso(-1) }
  }

  return (
    <MainLayout pageClassName="pagina-o-que-fazemos" headerProps={{ currentLink: 'a-emcomjunto', ctaHref: '#contato', ctaLabel: 'Diagnóstico' }} footerProps={{}}>
      {/* ============================= HERO · DIAGNÓSTICO ============================= */}
      <section className="hero secao hero-oque-fazemos hero--diag" id="topo" data-etapa={etapa}>
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-brilho" id="heroBrilho" aria-hidden="true"></div>
        <div className="hero-scrim" aria-hidden="true"></div>

        <div className="shell hero-conteudo hero-grade">
          <div className="hero-dizer">
            <p className="kicker rv">O que fazemos</p>
            <div className="filete rv"></div>
            <h1 className="d40 rv">Três perguntas para pensar como a <span className="ac ac53">Em<span className="silaba" aria-hidden="true">·</span>com<span className="silaba" aria-hidden="true">·</span>junto</span> pensa.</h1>
            <div className="hero-texto">
              <p className="hero-lead rv">Antes de propor qualquer coisa, a gente lê a operação: mercado, decisores, processo comercial, equipe, carteira, metas, CRM, base, materiais e mídia. Isso é o diagnóstico.</p>
              <p className="hero-lead rv">O que ele produz não é relatório, é ordem. Quais frentes estão abertas agora, quais podem esperar e o que não precisa ser feito ainda. Uma operação que já tem CRM, base e time rodando começa num ponto. Uma que precisa construir isso antes começa em outro, e leva mais tempo até a primeira conversa nova.</p>
              <p className="hero-lead rv">É isso que separa plano de pacote. <b>Pacote roda igual em janeiro e em setembro. Plano muda conforme a fase.</b> As três perguntas ao lado são as primeiras dessa leitura.</p>
            </div>
          </div>

          <div className="sonda rv" id="sonda">
            <p className="sonda-cab">Comece como a gente começa</p>

            <fieldset className="passo" data-passo="1">
              <legend><span className="passo-n">01</span><span className="passo-p">Qual é o seu segmento de atuação hoje?</span></legend>
              <div className="pilulas">
                {['Varejo', 'ESG e riscos', 'Pesquisa clínica', 'Outro'].map((v) => (
                  <label key={v}>
                    <input type="radio" name="sonda-segmento" value={v} checked={segmento === v} onChange={() => setSegmento(v)} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="passo" data-passo="2" hidden={!mostraStep2}>
              <legend><span className="passo-n">02</span><span className="passo-p">O que já roda hoje na sua operação?</span></legend>
              <div className="pilulas">
                {['Campanhas pagas', 'Redes sociais', 'Prospecção', 'Não tenho certeza'].map((v) => (
                  <label key={v}>
                    <input type="checkbox" name="sonda-roda" value={v} checked={roda.includes(v)} onChange={() => alternarRoda(v)} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
              <p className="passo-dica">Pode marcar mais de uma.</p>
            </fieldset>

            <fieldset className="passo" data-passo="3" hidden={!mostraStep3}>
              <legend><span className="passo-n">03</span><span className="passo-p">Qual é o seu maior desafio hoje?</span></legend>
              <div className="pilulas">
                {['Expansão', 'Processos', 'Demanda', 'Outro'].map((v) => (
                  <label key={v}>
                    <input type="radio" name="sonda-desafio" value={v} checked={desafio === v} onChange={() => setDesafio(v)} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sonda-fim" id="sondaFim" hidden={!mostraFim}>
              <p>Não existe resposta certa aqui — é exatamente por isso que o escopo sai do diagnóstico e não de um pacote. Veja como o trabalho se organiza.</p>
              <a className="btn btn--primario" href="#frentes">
                Continuar
                <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2v11M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>

            <p className="sonda-vivo" id="sondaVivo" aria-live="polite" role="status">{sondaVivo}</p>
          </div>
        </div>
      </section>

      {/* ============================= ⊂ · AS SETE FRENTES ============================= */}
      <section className="secao bloco claro fundo-branco" id="frentes">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">⊂</span><span className="regua"></span><span className="kicker">A operação</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Como funciona <span className="ac ac74">a nossa operação.</span></h2>
            <p className="lead apoio">Ela acontece em sete frentes. Nenhuma operação precisa das sete ao mesmo tempo, e a ordem também muda: o diagnóstico diz quais estão abertas hoje e quais podem esperar. Percorra as sete abaixo.</p>
          </div>

          <Trilho id="trilho" ariaLabel="As sete frentes de trabalho" items={FRENTES} />

          <div className="corrente rv" id="corrente" ref={correnteRef}>
            <div className="corrente-caixa">
              <span className="fio-vert" aria-hidden="true"><i></i></span>
              <ol className="corrente-marcos">
                {MARCOS.map((m, i) => (
                  <li className="marco" key={m}>
                    <span className="ponto" aria-hidden="true"></span>
                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="rot">{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="subbloco rv">
            <h3 className="sub-titulo">Quatro coisas definem <span className="ac ac53">o tamanho do trabalho.</span></h3>
            <p className="sub-lead">Nenhuma delas é quantidade de post por mês. O diagnóstico responde as quatro antes de qualquer proposta.</p>
            <div className="escopo">
              <div className="fator">
                <span className="n">01</span>
                <h4>Maturidade da operação</h4>
                <p>Se já existe processo, CRM e time comercial rodando, começamos em ativação. Se não existe, a preparação vem primeiro e ocupa mais tempo.</p>
              </div>
              <div className="fator">
                <span className="n">02</span>
                <h4>Complexidade da venda</h4>
                <p>Ticket, ciclo, número de decisores e nível técnico do produto mudam tudo: argumento, material, canal e quanto tempo até a primeira reunião.</p>
              </div>
              <div className="fator">
                <span className="n">03</span>
                <h4>Quantidade de frentes</h4>
                <p>Um mercado e um canal é um trabalho. Três mercados, prospecção ativa, mídia e portal próprio é outro.</p>
              </div>
              <div className="fator">
                <span className="n">04</span>
                <h4>Divisão com o time interno</h4>
                <p>O que a sua equipe assume e o que fica com a gente. Muitas vezes operamos junto com marketing interno, agência ou produtora.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= ∴ · NOSSA METODOLOGIA ============================= */}
      <section className="secao bloco escuro fundo-escuro" id="metodologia">
        <div className="shell manifesto">
          <div className="simbolo-linha rv" style={{ justifyContent: 'center' }}>
            <span className="simbolo">∴</span><span className="regua"></span><span className="kicker">Nossa metodologia</span>
          </div>
          <h2 className="d56 rv">Entender antes de acelerar. <span className="ac ac74">Testar antes de escalar.</span></h2>
          <p className="lead apoio rv">Hipótese, teste, dados, aprendizado e evolução — com o aprendizado voltando ao início. Nada entra em escala antes de ter passado por teste pequeno, e nada vira teste antes da leitura da operação.</p>

          <div className="ciclo rv" aria-label="Ciclo: estudo, hipótese, teste, dados, aprendizado, evolução">
            <ol className="ciclo-elos">
              {['Estudo', 'Hipótese', 'Teste', 'Dados', 'Aprendizado', 'Evolução'].map((e, i) => (
                <li className="elo" style={{ '--i': i }} key={e}>{e}</li>
              ))}
            </ol>
          </div>

          <p className="lead apoio rv">Não escolhemos canais, campanhas ou abordagens apenas por preferência. Criamos hipóteses ligadas a objetivos comerciais, colocamos em campo, acompanhamos as respostas e direcionamos mais energia para aquilo que demonstra maior potencial.</p>
        </div>
      </section>

      {/* ============================= ∪ · O QUE MUDA NA PRÁTICA ============================= */}
      <section className="secao bloco claro fundo-cinza" id="pratica">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∪</span><span className="regua"></span><span className="kicker">Na prática</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Cinco funções que costumam viver separadas. <span className="ac ac74">Aqui elas conversam.</span></h2>
            <p className="lead apoio">Quando cada uma é contratada por fora, cada especialista é cobrado pelo resultado do próprio pedaço — e ninguém é cobrado pelo caminho inteiro. A tensão é estrutural, não é culpa de ninguém. O que muda aqui é a quem elas respondem.</p>
          </div>

          <div className="praticas">
            {PRATICAS.map((p) => (
              <article className="pratica rv" key={p.titulo}>
                <div>
                  <svg className="pratica-icone" viewBox="0 0 24 24" aria-hidden="true">
                    {p.titulo === 'Mídia' && <path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z" />}
                    {p.titulo === 'Prospecção' && (<><path d="M3 17 9 9l5 4 7-8" /><circle cx="9" cy="9" r="1.4" /><circle cx="14" cy="13" r="1.4" /></>)}
                    {p.titulo === 'Produção' && (<><circle cx="12" cy="12" r="3.2" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>)}
                    {p.titulo === 'CRM e automação' && (<><circle cx="5" cy="18" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><path d="M6.7 16.6 10.4 13.5M13.7 10.7l3.6-3.1" /></>)}
                    {p.titulo === 'Comunicação' && (<><circle cx="12" cy="12" r="9" /><path d="M12 12 16 8" /></>)}
                  </svg>
                  <h3>{p.titulo}</h3>
                  <p className="pratica-gloss">{p.gloss}</p>
                </div>
                <div className="sep">
                  <p className="rot">Contratando separado</p>
                  <p>{p.sep}</p>
                </div>
                <div className="emcj">
                  <p className="rot">Com a Emcomjunto</p>
                  <p>{p.emcj}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="subbloco rv">
            <h3 className="sub-titulo">E o meu website? E o meu vídeo institucional? <span className="ac ac53">E minha rede social?</span></h3>
            <p className="sub-lead">Site, vídeo, apresentação, template de rede social, automação. Tudo isso existe aqui — a gente produz mesmo. O que muda é que cada peça nasce ligada a um objetivo comercial, e é isso que decide se ela deve existir. Abra cada uma para ver o porquê.</p>

            <div className="entregas" id="entregas">
              {ENTREGAS.map((e) => {
                const aberto = !!entregasAbertas[e.id]
                return (
                  <div className="entrega" key={e.id}>
                    <button className="entrega-cab" type="button" aria-expanded={aberto} aria-controls={e.id} onClick={() => alternarEntrega(e.id)}>
                      <span className="entrega-nome">{e.nome}</span>
                      <span className="entrega-mais" aria-hidden="true"></span>
                    </button>
                    <div className="entrega-corpo" id={e.id} hidden={!aberto}>
                      <p><span className="para">Para que serve</span>{e.texto}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="entregas-fecho rv">Repare que nenhuma dessas respostas começa com &ldquo;porque ficou bonito&rdquo;. Se a peça não responde a uma pergunta do plano comercial, <span className="ac">ela não entra no escopo.</span></p>
          </div>
        </div>
      </section>

      {/* ============================= ∈ · O QUE FICA COM VOCÊ ============================= */}
      <section className="secao bloco escuro fundo-escuro" id="fica">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∈</span><span className="regua"></span><span className="kicker">O que fica</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Se a gente parar amanhã, sua operação <span className="ac ac74">continua de pé.</span></h2>
            <p className="lead apoio">Resultado a gente busca no presente. Estrutura fica. Todo ativo construído é seu, documentado e operável pelo seu time. O que será construído depende do diagnóstico — não é lista fixa.</p>
          </div>

          <ul className="ativos rv">
            <li>ICP definido e validado em campo</li>
            <li>Base de contas e contatos enriquecida</li>
            <li>CRM configurado no processo real de venda</li>
            <li>Scripts, argumentos e materiais de objeção</li>
            <li>Páginas, portais e landing pages</li>
            <li>Automações e agentes de IA em operação</li>
            <li>Playbook comercial documentado</li>
            <li>Histórico de teste, dado e aprendizado</li>
          </ul>
        </div>
      </section>

      {/* ============================= Δ · PROVA ============================= */}
      <section className="secao bloco claro fundo-branco" id="cases">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">Δ</span><span className="regua"></span><span className="kicker">Prova</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Três operações, três desafios <span className="ac ac74">bem diferentes.</span></h2>
            <p className="lead apoio">Dois vêm de operação real, com a fonte e o período em que foram medidos. O terceiro é um cenário e está marcado como tal — projeção e resultado não se misturam aqui. Passe para o lado.</p>
          </div>

          <div className="cases rv" id="cases-fita">
            <div className="cases-topo">
              <p className="cases-cont"><span id="casoAtual">{casoAtual + 1}</span> de <span id="casoTotal">{CASES.length}</span></p>
              <div className="cases-setas">
                <button className="seta-btn" type="button" id="casoAnt" aria-label="Case anterior" aria-controls="fita" disabled={casoAtual === 0} onClick={() => vaiCaso(-1)}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button className="seta-btn" type="button" id="casoProx" aria-label="Próximo case" aria-controls="fita" disabled={casoAtual === CASES.length - 1} onClick={() => vaiCaso(1)}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>

            <div className="fita" id="fita" ref={fitaRef} tabIndex={0} role="group" aria-label="Cases, role para o lado" onKeyDown={aoTecladoFita}>
              {CASES.map((c, i) => (
                <article className="caso" style={{ '--glow': c.glow }} key={c.logo} ref={(el) => (casosRef.current[i] = el)}>
                  <div className="caso-topo">
                    <p className="caso-mercado">{c.mercado}</p>
                    <div className="caso-logo" role="img" aria-label={'Logo ' + c.logo}>
                      <span>{c.logo}</span>
                    </div>
                  </div>
                  <h3>{c.tituloA} <span className="ac ac53">{c.tituloB}</span></h3>
                  <p className="caso-txt">{c.txt}</p>
                  <ul className="caso-nums">
                    {c.nums.map(([v, r]) => (
                      <li key={r}><b>{v}</b><span>{r}</span></li>
                    ))}
                  </ul>
                  {c.fonte && <p className="caso-fonte">{c.fonte}</p>}
                  <a className="btn btn--contorno" href={c.linkHref}>
                    Ver o case completo
                    <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================= → · DIAGNÓSTICO E CONTATO ============================= */}
      <section className="secao bloco claro fundo-cinza" id="contato">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">→</span><span className="regua"></span><span className="kicker">Apresente seu desafio</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Agora que a gente já se conhece, <span className="ac ac74">vamos trabalhar em<span className="silaba" aria-hidden="true">·</span>com<span className="silaba" aria-hidden="true">·</span>junto?</span></h2>
            <p className="lead apoio">Lá em cima você respondeu três perguntas sobre a sua operação, e ao longo da página viu como a gente trabalha. Aqui ficam só as que faltam — as mesmas da primeira reunião, para a conversa já começar no assunto que importa.</p>
          </div>

          <div className="diag">
            <div className="painel rv">
              <form name="diagnostico" method="POST" data-netlify="true" netlify-honeypot="bot-diag" onSubmit={handleSubmit}>
                <input type="hidden" name="form-name" value="diagnostico" />
                <p hidden><label>Não preencha: <input name="bot-diag" /></label></p>

                {/* Prontos para receber as respostas da sonda do hero, mas o
                    script original nunca chegou a preenchê-los — o comentário
                    no HTML descrevia a intenção, sem código que a executasse.
                    Mantemos os campos ocultos vazios, fiéis ao comportamento
                    original (ver js/pages/o-que-fazemos.js). */}
                <input type="hidden" name="mercado" id="d-mercado" value="" readOnly />
                <input type="hidden" name="jaroda" id="d-jaroda" value="" readOnly />
                <input type="hidden" name="desafio-categoria" id="d-desafio-cat" value="" readOnly />

                <div className="grupo">
                  <div className="grupo-cab"><span className="n">01</span><span className="t">Você</span></div>
                  <div className="linha-campos">
                    <div className="campo">
                      <label htmlFor="d-nome">Nome</label>
                      <input id="d-nome" name="nome" type="text" autoComplete="name" required placeholder="Como você se chama" />
                    </div>
                    <div className="campo">
                      <label htmlFor="d-empresa">Empresa</label>
                      <input id="d-empresa" name="empresa" type="text" autoComplete="organization" required placeholder="Nome da empresa" />
                    </div>
                    <div className="campo">
                      <label htmlFor="d-email">E-mail corporativo</label>
                      <input id="d-email" name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" />
                    </div>
                    <div className="campo">
                      <label htmlFor="d-tel">Telefone</label>
                      <input id="d-tel" name="telefone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="campo campo--largo">
                      <label htmlFor="d-site">Site da empresa</label>
                      <input id="d-site" name="site" type="url" autoComplete="url" placeholder="empresa.com.br" />
                    </div>
                  </div>
                </div>

                <div className="grupo">
                  <div className="grupo-cab"><span className="n">02</span><span className="t">Seu desafio</span></div>
                  <div className="campo">
                    <label htmlFor="d-desafio">Onde está travando</label>
                    <textarea id="d-desafio" name="desafio" required placeholder="Descreva o que não está avançando na sua operação comercial"></textarea>
                  </div>

                  <fieldset className="campo" style={{ border: 0, padding: 0, marginTop: 'var(--esp-6)' }}>
                    <legend style={{ padding: 0 }}><span className="rot-legenda">Quando quer começar</span></legend>
                    <div className="pilulas">
                      <label><input type="radio" name="quando" value="Já" /><span>Já</span></label>
                      <label><input type="radio" name="quando" value="Neste trimestre" /><span>Neste trimestre</span></label>
                      <label><input type="radio" name="quando" value="Ainda avaliando" /><span>Ainda avaliando</span></label>
                    </div>
                  </fieldset>
                </div>

                <label className="consenti">
                  <input type="checkbox" name="consentimento" required />
                  <span className="marca-cx" aria-hidden="true"></span>
                  <span className="txt">Autorizo a Emcomjunto a usar os dados acima para responder a este contato e preparar a leitura inicial da minha operação comercial. Não usamos para outra finalidade e dá para pedir exclusão a qualquer momento.</span>
                </label>

                <div className="painel-acoes">
                  <button className="btn btn--primario" type="submit">
                    Apresentar desafio
                    <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <p className="form-nota">Resposta em até 2 dias úteis.</p>
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
