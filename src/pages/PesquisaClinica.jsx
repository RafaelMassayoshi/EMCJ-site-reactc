import { useEffect, useRef, useState } from 'react'
import LogoSprite from '../components/LogoSprite.jsx'
import FormStatus from '../components/FormStatus.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import useCoreScrollEffects from '../hooks/useCoreScrollEffects.js'
import useFormWebhook from '../hooks/useFormWebhook.js'

import '../styles/random/variables.css'
import '../styles/random/pesquisa-clinica.css'

/* ==========================================================================
   PESQUISA CLÍNICA (marca Random) — no site estático original esta era uma
   página HTML isolada, com seu próprio design system (cores, fontes,
   tokens) e seu próprio script (js/pesquisa-clinica.js), sem nada de
   js/main.js nem do header/rodapé das outras páginas. Por isso ela não usa
   <MainLayout>: monta o próprio header e rodapé aqui, e toda a raiz fica
   dentro de .pagina-pesquisa-clinica — classe usada para "escopar" o CSS
   deste sistema visual (ver scripts/scope-pesquisa-clinica.mjs) e evitar
   que ele vaze para as outras páginas, ou vice-versa, agora que tudo roda
   no mesmo documento (SPA).
   ========================================================================== */

const GARGALOS = [
  { n: '01', t: 'Planejamento e criação', p: 'Hipóteses de região, público, condição, mensagem e canal raramente são formuladas antes da campanha. O criativo entra no ar sem uma pergunta a responder.' },
  { n: '02', t: 'Atendimento e cadência', p: 'Leads chegam e não são trabalhados com um fluxo estruturado. Sem SLA de primeiro contato e sem régua de reativação, o interesse esfria antes da triagem.' },
  { n: '03', t: 'Pré-qualificação', p: 'Volume sem critério gera triagem improdutiva no centro. Falta um filtro que respeite o protocolo e não prometa o que não pode ser prometido.' },
  { n: '04', t: 'Banco de pacientes', p: 'Fontes diferentes não conversam entre si, os dados ficam pulverizados e a base deixa de ser um ativo reaproveitável no próximo protocolo.' },
  { n: '05', t: 'Mensuração', p: 'É difícil saber quais canais, mensagens, regiões e perfis realmente contribuíram para screening e randomização, e não para o relatório de cliques.' },
  { n: '06', t: 'Aprendizado por perda', p: 'Os motivos de perda ao longo do funil não são registrados, então cada campanha recomeça do zero em vez de acumular inteligência.' },
]

const EVIDENCIAS = [
  { v: '36,67%', r: 'dos estudos interrompidos', p: 'Análise das razões de interrupção de 28.561 estudos clínicos apontou recrutamento insuficiente como o motivo mais frequente identificado.', fonte: 'Nature Genetics · Genetic factors associated with reasons for clinical trial stoppage' },
  { v: '85%', r: 'dos trials têm dificuldade para recrutar', p: 'Dado de mercado de 2024: a maioria dos estudos não consegue reunir participantes suficientes dentro do desenho e do cronograma previstos.', fonte: 'WCG · Participant Recruitment & Retention' },
  { v: '50 vs 31', r: 'meses de recrutamento', p: 'Em coorte de 83 RCTs, 55% não atingiram a meta no período planejado mesmo com seis meses extras. Quem falha recruta em 50 meses; quem atinge, em 31.', fonte: 'BMJ Open, 2025 · Recruitment failure and extension of study periods' },
  { v: 'US$ 800 mil', r: 'por dia de atraso', p: 'Análise de 645 medicamentos e biológicos estimou esse valor em vendas não realizadas por dia. O custo direto de um trial de fase III chega a US$ 55.716 por dia.', fonte: 'Tufts CSDD · Quantifying the Value of a Day of Delay in Drug Development' },
  { v: 'US$ 1,33 mi', r: 'orçamento mediano por estudo', p: 'Estudo de 2026 com dados de oito sponsors e CROs e 32 estudos encontrou esse orçamento mediano para centralized patient outreach, com 64,7% destinados a canais digitais.', fonte: 'Tufts CSDD / PubMed · Measuring Centralized Patient Outreach Recruitment Strategies and their Costs' },
  { v: '3% → 44%', r: 'uso de websites em recruitment', p: 'Benchmarking com 14 grandes farmacêuticas e três CROs comparando 2012, 2019 e 2023, acompanhado por maior uso de social media e patient communities.', fonte: 'Tufts CSDD / Applied Clinical Trials · Recruitment and Retention Tactics 2012–2023' },
  { v: 'US$ 72 vs 199', r: 'custo por participante · online e offline', p: 'Revisão sistemática com 61 estudos: online recruta mais rápido e mais barato, mas o offline converte melhor de screened para enrolled. Mídia sozinha não resolve enrollment.', fonte: 'JMIR · Online Patient Recruitment in Clinical Trials: Systematic Review and Meta-Analysis' },
  { v: '80%', r: 'dos estudos não atingem a meta no prazo', p: 'O número é da própria IQVIA, que observa ainda que muitos sites não possuem recursos, expertise ou tempo para pensar recruitment e retention estrategicamente.', fonte: 'IQVIA · Patient Recruitment & Enrollment' },
]

const FRENTES = [
  { id: 'f1', titulo: 'Plano de negócios', h3: 'Plano de negócios', p: 'Pesquisa de segmento, mapeamento de concorrentes e estudo de público em três frentes: indústria e CRO, voluntário e comunidade médica local. É o alicerce em que todo o resto se apoia.', itens: ['Benchmark de referências brasileiras e internacionais', 'Estudo de público-alvo por tipo de decisor', 'Posicionamento e proposta de valor do centro', 'Entrevistas de briefing com direção e gestores'] },
  { id: 'f2', titulo: 'Naming e branding', h3: 'Naming e branding', p: 'Na seleção de centro, patrocinador e CRO leem maturidade institucional junto com capacidade operacional. Identidade e consistência entram na avaliação.', itens: ['Símbolo, logotipo e versões de aplicação', 'Arquitetura de marca com endosso de unidades', 'Plataforma verbal: propósito, promessa e tom de voz', 'Manual de marca e orientação no registro junto ao INPI'] },
  { id: 'f3', titulo: 'Desenvolvimento e gestão web', h3: 'Desenvolvimento e gestão web', p: 'O endereço para onde levar patrocinador, voluntário e médico referenciador. Sem esse destino, a campanha não tem onde chegar.', itens: ['Site institucional responsivo e otimizado para busca', 'Área de estudos em andamento com template por protocolo', 'Landing pages e formulários de triagem com tratamento LGPD', 'Área dedicada a indústria e patrocinador, com contato de feasibility'] },
  { id: 'f4', titulo: 'Conteúdo e gestão de redes', h3: 'Conteúdo e gestão de redes', p: 'Presença que sustenta relacionamento com paciente, médico e mercado entre um protocolo e outro, e não só quando a campanha está no ar.', itens: ['Arquitetura de conteúdo por público', 'Biblioteca de templates de feed e stories', 'Conteúdo educativo sobre condição e sobre pesquisa clínica', 'Padronização de perfis em Instagram, LinkedIn e Facebook'] },
  { id: 'f5', titulo: 'Campanhas multicanais', h3: 'Campanhas multicanais on e off', p: 'Performance, parcerias, CRM e conteúdo organizados em quatro frentes com um único ponto de chegada: a base de voluntários.', itens: ['Google, social, native ads e portais de conteúdo em saúde', 'Médicos referenciadores, afiliados e influenciadores', 'E-mail, SMS e WhatsApp em régua de relacionamento', 'Gestão de verba, otimização e leitura por região'] },
  { id: 'f6', titulo: 'Aplicações impressas e digitais', h3: 'Aplicações impressas e digitais', p: 'O material que circula fora da tela e dentro do centro, pronto para submissão quando o protocolo exige.', itens: ['Papelaria, sinalização e material de sala de espera', 'Apresentação institucional em português e inglês', 'Kit de aplicação para as equipes usarem sem depender da agência', 'Templates para submissão de materiais'] },
  { id: 'f7', titulo: 'Audiovisual e fotografia', h3: 'Audiovisual e fotografia', p: 'Registro das unidades, da equipe e da rotina do centro. É o acervo que guia todas as criações seguintes e dá ao centro material original próprio.', itens: ['Fotos institucionais das unidades e da equipe', 'Vídeo institucional', 'Depoimentos e conteúdo com investigadores', 'Banco de imagens próprio para site, materiais e redes'] },
  { id: 'f8', titulo: 'Comunicação visual', h3: 'Comunicação visual', p: 'A aplicação da marca no espaço físico e nos pontos onde paciente e visitante encontram o centro pela primeira vez.', itens: ['Fachada, ambientação e sinalização interna', 'Padronização entre unidades de uma mesma rede', 'Materiais de evento e de congresso', 'Arquivos fechados e acompanhamento de prova gráfica'] },
]

const ETAPAS = [
  { n: '01', t: 'Protocolo e hipótese', p: 'Critérios de elegibilidade, regiões, perfil e volume esperado viram hipótese de resposta digital antes de qualquer criativo.' },
  { n: '02', t: 'Planejamento e criação', p: 'Mensagem, oferta e peça nascem da pergunta que a campanha precisa responder, respeitando o que pode e o que não pode ser dito.' },
  { n: '03', t: 'Captação multicanal', p: 'Performance, parcerias, conteúdo e CRM alimentam uma base única, com um só ponto de chegada em vez de planilhas soltas.' },
  { n: '04', t: 'Atendimento e cadência', p: 'SLA de primeiro contato, régua de reativação e registro de cada tentativa. O interesse tem prazo de validade curto.' },
  { n: '05', t: 'Pré-qualificação', p: 'Automação, IA e equipe humana filtram o lead contra o critério do protocolo antes de ele chegar ao time de triagem do centro.' },
  { n: '06', t: 'Encaminhamento e leitura', p: 'O centro recebe base pronta para triagem, e cada motivo de perda volta como informação para a próxima rodada de campanha.' },
]

const CASES_AREA = [
  { classe: '', titulo: 'Enxaqueca', tag: 'Neurologia', tagClasse: 'tag--brand', destaque: '151', destaqueR: 'pacientes randomizados', linhas: [['Impressões', '+1,7 mi'], ['Cliques', '+13,8 mil'], ['Leads', '1.854'], ['Custo por lead', 'R$ 7,91'], ['Taxa de randomização', '8%'], ['Custo por randomização', 'R$ 96,69']], leitura: 'Campanhas digitais podem participar diretamente da composição do recrutamento quando existe integração entre comunicação, captação e as etapas seguintes.' },
  { classe: 'case-area--cyan', titulo: 'Doenças cardiovasculares', tag: 'Cardiologia', tagClasse: 'tag--tech', destaque: '4.888', destaqueR: 'leads gerados', linhas: [['Impressões', '+3,5 mi'], ['Cliques', '+59,3 mil'], ['Randomizados', '53'], ['Custo por lead', 'R$ 9,55'], ['Taxa de randomização', '1%'], ['Custo por randomização', 'R$ 880,58']], leitura: 'Público amplo, lead barato e taxa baixa. É o recorte que mais reforça a necessidade de acompanhar qualidade, critério, contato e motivo de perda.' },
  { classe: 'case-area--mg', titulo: 'Hiperplasia de próstata', tag: 'Urologia', tagClasse: 'tag--alert', destaque: '16%', destaqueR: 'taxa de randomização', linhas: [['Impressões', '+1,1 mi'], ['Cliques', '+13,5 mil'], ['Leads', '611'], ['Custo por lead', 'R$ 16,39'], ['Randomizados', '98'], ['Custo por randomização', 'R$ 102,22']], leitura: 'Volume menor de leads associado à maior taxa de randomização das três. O lead mais barato nem sempre é o que mais contribui para o recrutamento.' },
]

const OUTRAS_OPERACOES = [
  { fio: '', kicker: 'CPClin', titulo: '~3× mais leads em menos de três semanas', p: 'Reestruturação de criativo, segmentação e página de captura. O ganho veio de separar aplicações e personalizar a comunicação, não de aumentar o investimento.' },
  { fio: 'var(--rx-cyan)', kickerCor: 'var(--cy-700)', kicker: 'Bioserv', titulo: 'Mais de 50% dos randomizados vindos de redes sociais', p: 'Em alguns estudos, mais da metade dos voluntários randomizados conheceu a oportunidade por redes sociais, segundo depoimento do próprio cliente.' },
  { fio: 'var(--rx-magenta)', kickerCor: 'var(--mg-500)', kicker: 'CEMEC', titulo: 'Operação completa em uma estrutura só', p: 'Landing pages, social ads, automação, lead scoring, lead tracking e CRM operando de forma integrada dentro da mesma estrutura de recrutamento.' },
]

const LICOES = [
  'Maior volume de leads não significa necessariamente maior randomização.',
  'Cada área terapêutica exige uma comunicação diferente.',
  'Localização e características da população interferem diretamente na estratégia.',
  'Campanhas precisam ser acompanhadas além do formulário.',
  'Informações sobre qualificação e motivos de perda precisam voltar para o marketing.',
  'Conteúdos e canais próprios podem complementar campanhas específicas de estudos.',
  'Comunicação simples é fundamental para temas clínicos complexos.',
  'Tecnologia ajuda a organizar atendimento, pré-qualificação e acompanhamento.',
  'Cada estudo gera aprendizado que pode tornar o próximo mais eficiente.',
]

const DEPOIMENTOS = [
  { txt: 'Deram vida à marca e nos ajudaram a entrar para o time dos grandes centros de pesquisa. Hoje são, reconhecidamente, a agência mais especializada no nicho.', nome: 'Silvana Glikmanas', cargo: 'Diretora de Recrutamento · BR Trials' },
  { txt: 'Tínhamos vindo de uma agência sem repertório em pesquisa clínica. A mudança foi da água para o vinho, da nossa imagem à performance das campanhas.', nome: 'Vinicius Santana', cargo: 'Cofundador · CENDERS' },
  { txt: 'Discutir protocolo e planejar estratégia ficou muito mais simples com interlocutores que falam a nossa língua.', nome: 'José Roberto Ruschel Siffert', cargo: 'Diretor · Ruschel Medicina e ACESSE' },
  { txt: 'A expertise do time na área de pesquisa clínica faz toda a diferença, tanto no fortalecimento da nossa marca quanto na divulgação dos estudos.', nome: 'Thais Peretti Pereira', cargo: 'Coordenadora de Estudos Clínicos · IPC Tatuí' },
]

const NUVEM = [
  'psiquiatria', 'ginecologia', 'hipertensão', 'gastroenterologia', 'doençadecrohn', 'diabetes', 'insônia',
  'síndromedesjogren', 'oncologia', 'fibrosepulmonar', 'alopécia', 'dermatologia', 'retocolite',
  ['asma', true], 'mioma', 'infectologia', 'alzheimer', 'lúpus', 'esclerosemúltipla', 'dpoc', 'triglicérideos',
  'doençasraras', 'bronquiectasia', 'reumatologia', 'vsr', 'endometriose', ['eventoscardíacos', true],
  'nefritelúpica', 'sarcoidosepulmonar', 'depressão', 'obesidade', ['enxaqueca', true], ['urologia', true],
]

const PARCEIROS = ['CEON+', 'CEPHO', 'BR Trials', 'CENDERS', 'Bioserv', 'Coracentro', 'IEP São Lucas', 'IPC Tatuí', 'Méderi', 'Ruschel', 'CPC USCS', 'CEMEC']

const BARREIRAS = [
  { lim: 22, texto: 'Não sabe que o estudo existe' },
  { lim: 46, texto: 'Não sabe que há um centro perto' },
  { lim: 70, texto: 'Não entende o que é participar' },
  { lim: 94, texto: 'Não encontra como se candidatar' },
]

// Contador que sobe uma vez, disparado externamente por `iniciar` (os seis
// números da faixa do hero sobem juntos, quando #faixaHero entra na tela —
// não cada um no seu próprio scroll, diferente do padrão usado nas outras
// páginas). Porta de contarTodos()/formatar() em js/pesquisa-clinica.js.
function Contador({ alvo, dec = 0, iniciar }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!iniciar || !ref.current) return undefined
    function formatar(v) {
      const s = v.toFixed(dec)
      return dec > 0 ? s.replace('.', ',') : s
    }
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido) {
      ref.current.textContent = formatar(alvo)
      return undefined
    }
    let ini = null
    let quadro
    function passo(t) {
      if (ini === null) ini = t
      const p = Math.min((t - ini) / 1500, 1)
      ref.current.textContent = formatar(alvo * (1 - Math.pow(1 - p, 3)))
      if (p < 1) quadro = requestAnimationFrame(passo)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [iniciar, alvo, dec])
  return <span ref={ref}>0</span>
}

// Revelação (.rv/.esc/.percurso) + disparo dos contadores quando #faixaHero
// entra na tela — os dois eventos compartilhavam um único IntersectionObserver
// no script original.
function useRevelacaoEContadores(setContar) {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll('.pagina-pesquisa-clinica .rv, .pagina-pesquisa-clinica .esc, .pagina-pesquisa-clinica .percurso'))
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido || !('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.classList.add('on'))
      setContar(true)
      return undefined
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('on')
          obs.unobserve(e.target)
          if (e.target.id === 'faixaHero') setContar(true)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    alvos.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [setContar])
}

function useSimboloHeroPronto() {
  useEffect(() => {
    const simbolo = document.getElementById('simboloHero')
    if (!simbolo) return undefined
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido) {
      simbolo.classList.add('pronto')
      return undefined
    }
    const quadro = requestAnimationFrame(() => {
      setTimeout(() => simbolo.classList.add('pronto'), 260)
    })
    return () => cancelAnimationFrame(quadro)
  }, [])
}

// Título que se redigita: duas variantes com o mesmo miolo fixo, digitando
// e apagando em loop enquanto o hero está visível. Porta 1:1 do bloco
// "Título que se redigita" de js/pesquisa-clinica.js.
function useTituloDigitando(heroRef, tituloRef, alvoARef, alvoBRef) {
  useEffect(() => {
    const titulo = tituloRef.current
    const alvoA = alvoARef.current
    const alvoB = alvoBRef.current
    const hero = heroRef.current
    if (!titulo || !alvoA || !alvoB) return undefined

    const variantes = [
      { muda: 'a Emcomjunto ', fixo: 'em pesquisa clínica.' },
      { muda: 'marketing ', fixo: 'em pesquisa clínica.' },
    ]
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function desenhar(v, n) {
      const m = variantes[v].muda
      const f = variantes[v].fixo
      alvoA.textContent = m.slice(0, Math.min(n, m.length))
      alvoB.textContent = n > m.length ? f.slice(0, n - m.length) : ''
    }

    if (reduzido) {
      desenhar(0, variantes[0].muda.length + variantes[0].fixo.length)
      return undefined
    }

    let v = 0
    let n = 0
    let apagando = false
    let relogio = null
    let visivel = true

    function passo() {
      const total = variantes[v].muda.length + variantes[v].fixo.length
      let espera
      if (!apagando) {
        n++
        desenhar(v, n)
        if (n >= total) {
          apagando = true
          espera = 2600
          titulo.classList.remove('escrevendo')
        } else espera = 46 + Math.random() * 34
      } else {
        n--
        desenhar(v, n)
        if (n <= 0) {
          apagando = false
          v = (v + 1) % variantes.length
          espera = 420
        } else espera = 24
      }
      if (!apagando && n < total) titulo.classList.add('escrevendo')
      if (apagando && n > 0) titulo.classList.add('escrevendo')
      agendar(espera)
    }
    function agendar(ms) {
      clearTimeout(relogio)
      if (!visivel) return
      relogio = setTimeout(passo, ms)
    }

    let ot
    if (hero && 'IntersectionObserver' in window) {
      ot = new IntersectionObserver(
        (e) => {
          visivel = e[0].isIntersecting
          if (visivel) agendar(200)
          else clearTimeout(relogio)
        },
        { threshold: 0 },
      )
      ot.observe(hero)
    }
    agendar(700)

    return () => {
      clearTimeout(relogio)
      if (ot) ot.disconnect()
    }
  }, [heroRef, tituloRef, alvoARef, alvoBRef])
}

function useLicoesViva(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido || !('IntersectionObserver' in window)) return undefined
    const obs = new IntersectionObserver((e) => el.classList.toggle('viva', e[0].isIntersecting), { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
}

function useNuvemPulso(ref) {
  useEffect(() => {
    const nuvem = ref.current
    if (!nuvem) return undefined
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido) return undefined
    const pilulas = Array.from(nuvem.querySelectorAll('.tag'))
    let pulso = null
    function acender() {
      const alvo = pilulas[Math.floor(Math.random() * pilulas.length)]
      if (alvo && !alvo.classList.contains('brilha')) {
        alvo.classList.add('brilha')
        setTimeout(() => alvo.classList.remove('brilha'), 1400)
      }
      pulso = setTimeout(acender, 480 + Math.random() * 620)
    }
    let obs
    if ('IntersectionObserver' in window) {
      obs = new IntersectionObserver(
        (e) => {
          clearTimeout(pulso)
          if (e[0].isIntersecting) acender()
        },
        { threshold: 0.1 },
      )
      obs.observe(nuvem)
    } else acender()
    return () => {
      clearTimeout(pulso)
      if (obs) obs.disconnect()
    }
  }, [ref])
}

function useFlutuaPointer(flutuaRef, areaRef) {
  useEffect(() => {
    const flutua = flutuaRef.current
    const area = areaRef.current
    if (!flutua || !area) return undefined
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzido || !window.matchMedia('(pointer:fine)').matches) return undefined
    let pedido = false
    function aoMover(ev) {
      const r = area.getBoundingClientRect()
      const mx = ((ev.clientX - r.left) / r.width - 0.5) * 46
      const my = ((ev.clientY - r.top) / r.height - 0.5) * 32
      if (!pedido) {
        pedido = true
        requestAnimationFrame(() => {
          flutua.style.setProperty('--fx', mx.toFixed(1))
          flutua.style.setProperty('--fy', my.toFixed(1))
          pedido = false
        })
      }
    }
    function aoSair() {
      flutua.style.setProperty('--fx', 0)
      flutua.style.setProperty('--fy', 0)
    }
    area.addEventListener('mousemove', aoMover, { passive: true })
    area.addEventListener('mouseleave', aoSair)
    return () => {
      area.removeEventListener('mousemove', aoMover)
      area.removeEventListener('mouseleave', aoSair)
    }
  }, [flutuaRef, areaRef])
}

export default function PesquisaClinica() {
  useDocumentMeta({
    title: 'Pesquisa clínica · Random, a operação da Emcomjunto',
    description: 'Random é a marca da Emcomjunto em pesquisa clínica: comunicação, geração de demanda e operação de recrutamento para centros, CROs e patrocinadores.',
    canonical: 'https://emcomjunto.com.br/pesquisa-clinica',
  })
  useCoreScrollEffects()

  const [menuAberto, setMenuAberto] = useState(false)
  function alternarMenu() {
    setMenuAberto((a) => !a)
  }
  function fecharMenu() {
    setMenuAberto(false)
  }

  const [contando, setContando] = useState(false)
  useRevelacaoEContadores(setContando)
  useSimboloHeroPronto()

  const heroRef = useRef(null)
  const tituloRef = useRef(null)
  const alvoARef = useRef(null)
  const alvoBRef = useRef(null)
  useTituloDigitando(heroRef, tituloRef, alvoARef, alvoBRef)

  const [modoCadeia, setModoCadeia] = useState('disperso')
  const TEXTOS_CADEIA = {
    disperso: 'Cada etapa em um fornecedor diferente. A informação não atravessa o funil, então o motivo de perda morre onde aconteceu e a campanha seguinte recomeça do zero.',
    coordenado: 'Uma operação só, do alcance à randomização. O que se aprende em cada perda volta para a campanha seguinte, e o investimento passa a acumular conhecimento.',
  }

  const [ponteValor, setPonteValor] = useState(0)
  const caidas = BARREIRAS.filter((b) => ponteValor >= b.lim)
  const restam = BARREIRAS.length - caidas.length
  const ponteStatus =
    restam === 0
      ? 'Descoberta, comunicação, acesso e conexão. Esse é o trabalho, e ele não acontece sozinho.'
      : restam === 4
        ? 'Quatro barreiras separam a pessoa da oportunidade de pesquisa.'
        : restam + (restam === 1 ? ' barreira ainda separa' : ' barreiras ainda separam') + ' a pessoa do centro.'

  const licoesRef = useRef(null)
  useLicoesViva(licoesRef)

  const nuvemRef = useRef(null)
  useNuvemPulso(nuvemRef)

  const flutuaRef = useRef(null)
  const contatoRef = useRef(null)
  useFlutuaPointer(flutuaRef, contatoRef)

  // ---------- Trilho de frentes (tablist próprio desta página) ----------
  const [frenteAtiva, setFrenteAtiva] = useState(0)
  const frentesBotoesRef = useRef([])
  function abrirFrente(i, focar) {
    setFrenteAtiva(i)
    if (focar) frentesBotoesRef.current[i]?.focus()
  }
  function aoTecladoFrente(e, i) {
    let n = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % FRENTES.length
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + FRENTES.length) % FRENTES.length
    if (e.key === 'Home') n = 0
    if (e.key === 'End') n = FRENTES.length - 1
    if (n === null) return
    e.preventDefault()
    abrirFrente(n, true)
  }

  const { status: statusContato, handleSubmit: handleSubmitContato } = useFormWebhook()
  const { status: statusNews, handleSubmit: handleSubmitNews } = useFormWebhook()

  return (
    <div className="pagina-pesquisa-clinica">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>

      <LogoSprite />

      <div className="progresso" aria-hidden="true"><i id="barra"></i></div>

      {/* ============================= NAV ============================= */}
      <header className="nav" id="nav">
        <style>{`
          .pagina-pesquisa-clinica .logo{width:auto}
          @media (max-width: 900px) {
            .pagina-pesquisa-clinica .logo{width:150px;max-width:150px;height:40px;overflow:hidden;display:flex;align-items:center}
            .pagina-pesquisa-clinica .logo-header{height:36px;width:auto;max-width:100%;object-fit:contain;flex-shrink:0}
          }
          @media (max-width: 600px) {
            .pagina-pesquisa-clinica .logo{width:125px;max-width:125px;height:36px}
            .pagina-pesquisa-clinica .logo-header{height:30px;max-width:125px}
            .pagina-pesquisa-clinica .logo-header--white{display:block}
            .pagina-pesquisa-clinica .logo-header--blue{display:none}
            .pagina-pesquisa-clinica .nav.solida .logo-header--white{display:none}
            .pagina-pesquisa-clinica .nav.solida .logo-header--blue{display:block}
          }
        `}</style>
        <div className="shell">
          <a className="logo" href="/" aria-label="Início">
            <img className="logo-header logo-header--white" src="/assets/images/logo-header-white.png" alt="Logo" />
            <img className="logo-header logo-header--blue" src="/assets/images/logo-header-blue.png" alt="" />
          </a>
          <nav className={'nav-links' + (menuAberto ? ' aberto' : '')} id="navLinks" aria-label="Principal" onClick={(e) => {
            if (e.target.tagName === 'A') fecharMenu()
          }}>
            <a href="/a-emcomjunto">A Emcomjunto</a>
            <a href="/o-que-fazemos">O que fazemos</a>
            <div className="nav-item">
              <a href="/quem-assessoramos">Quem assessoramos</a>
              <svg className="chev" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="nav-sub">
                <a href="/varejo">Varejo<small>Quem vende para o varejo: mercadoria, PDV, estoque e comunicação</small></a>
                <a href="/pesquisa-clinica" aria-current="page">Pesquisa clínica<small>Random · a marca da Emcomjunto em pesquisa clínica</small></a>
              </div>
            </div>
            <a href="/blog">Blog</a>
          </nav>
          <button className="nav-btn" id="navBtn" aria-expanded={menuAberto} aria-controls="navLinks" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} onClick={alternarMenu}>
            <i></i>
          </button>
          <a className="btn btn--primario" href="#contato">Falar com a Random</a>
        </div>
      </header>

      <main id="conteudo">
        {/* ============================= HERO ============================= */}
        <section className="hero hero-pesquisa-clinica secao escuro" id="topo" ref={heroRef}>
          <div className="shell">
            <div className="hero-grade">
              <div>
                <h1 className="d112 titulo-anim" id="tituloHero" ref={tituloRef}>
                  <span className="so-leitor">A Random é a Emcomjunto em pesquisa clínica.</span>
                  <span className="h1-visual" aria-hidden="true">
                    <span className="h1-fixo">A Random é</span>
                    <span className="troca">
                      <span className="troca-molde">a Emcomjunto em pesquisa clínica.</span>
                      <span className="troca-viva"><span className="tv-a" ref={alvoARef}></span><span className="tv-b" ref={alvoBRef}></span><i className="cursor"></i></span>
                    </span>
                  </span>
                </h1>
                <p className="hero-sub">Há quase uma década trabalhamos por dentro de centros de pesquisa brasileiros: presença digital, campanhas, captação de pacientes, atendimento, automações, bancos de dados e operação de recrutamento. A Random concentra tudo isso em uma unidade dedicada. O que entregamos não é mídia nem plataforma. É velocidade, previsibilidade e inteligência para o enrollment.</p>
                <div className="acoes">
                  <a className="btn btn--primario" href="#contato">Falar sobre um protocolo
                    <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <a className="btn btn--secundario" href="#cases">Ver os cases</a>
                </div>
              </div>
              <div className="hero-marca">
                <svg className="hero-simbolo" id="simboloHero" viewBox="0 0 98 164" role="img" aria-label="Random">
                  <path className="perna perna--alta" fill="currentColor" d="M33.34 128.15C68.44 128.15 96.9 99.7 96.9 64.59C96.9 63.4 96.8 0 96.8 0H75.49L75.64 64.73C74.94 87.94 56.2 106.54 33.17 106.54C33.11 106.54 33.06 106.54 33 106.54V128.14C33.11 128.14 33.22 128.14 33.33 128.14L33.34 128.15Z" />
                  <path className="perna perna--baixa" fill="currentColor" d="M63.56 35.5C28.45 35.5 0 63.95 0 99.05C0 100.24 0.1 163.64 0.1 163.64H21.41L21.26 98.91C21.96 75.7 40.7 57.1 63.73 57.1C63.79 57.1 63.84 57.1 63.9 57.1V35.5C63.79 35.5 63.68 35.5 63.57 35.5H63.56Z" />
                </svg>
                <p className="hero-assinatura"><b>Random Pesquisa</b> é a marca da Emcomjunto dedicada ao ecossistema de pesquisa clínica: centros, CROs e patrocinadores.</p>
              </div>
            </div>

            <div className="faixa esc" id="faixaHero">
              <div><span className="n"><Contador alvo={15} dec={0} iniciar={contando} /><em>milhões</em></span><span className="r">pessoas alcançadas em campanhas de pesquisa clínica</span></div>
              <div><span className="n"><Contador alvo={185} dec={0} iniciar={contando} /><em>mil</em></span><span className="r">leads captados para diversos protocolos</span></div>
              <div><span className="n"><Contador alvo={3.7} dec={1} iniciar={contando} /><em>mil</em></span><span className="r">voluntários <b>randomizados</b></span></div>
              <div><span className="n">+<Contador alvo={250} dec={0} iniciar={contando} /></span><span className="r">projetos de pesquisa clínica em diferentes áreas</span></div>
              <div><span className="n">+<Contador alvo={30} dec={0} iniciar={contando} /></span><span className="r">doenças com campanha de recrutamento conduzida</span></div>
              <div><span className="n">+<Contador alvo={25} dec={0} iniciar={contando} /></span><span className="r">centros, CROs e farmacêuticas atendidas em 10 anos de atuação</span></div>
            </div>
          </div>
        </section>

        {/* ============================= 01 · O PROBLEMA ============================= */}
        <section className="secao bloco claro fundo-branco" id="problema">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">O recrutamento mudou. O modelo operacional dos centros <span className="ac">nem sempre acompanhou.</span></h2></div>
              <p className="lead">Centros maduros conduzem estudos com excelência científica, mas raramente foram construídos para operar aquisição digital de pacientes em escala. Quando entra verba de mídia, aparecem os gargalos.</p>
            </div>

            <div className="grade g3 grade--iguais esc">
              {GARGALOS.map((g) => (
                <article className="gargalo" key={g.n}>
                  <span className="num">{g.n}</span>
                  <h3>{g.t}</h3>
                  <p>{g.p}</p>
                </article>
              ))}
            </div>

            <div className="declaracao declaracao--dupla rv">
              <div>
                <p className="kicker">O ponto</p>
                <h3 className="h36">Existe investimento. O que falta é estratégia coordenada.</h3>
                <p>A indústria já coloca recursos significativos em patient outreach, e os centros também recebem budgets de recrutamento. A oportunidade está em evitar que esse investimento se pulverize entre iniciativas desconectadas, fornecedores diferentes e equipes que dominam pesquisa clínica mas não performance, conteúdo, CRM e gestão de funil.</p>
                <p>Não basta gerar lead. É preciso gerar o paciente certo, responder, engajar, pré-qualificar, encaminhar e acompanhar esse paciente até o screening, e aprender com cada perda ao longo do caminho.</p>
              </div>

              <div className="cadeia-caixa" id="cadeiaCaixa">
                <div className="cadeia-controle" role="group" aria-label="Comparar os dois modelos de operação">
                  <button type="button" className="cad-btn" data-modo="disperso" aria-pressed={modoCadeia === 'disperso'} onClick={() => setModoCadeia('disperso')}>Pulverizado</button>
                  <button type="button" className="cad-btn" data-modo="coordenado" aria-pressed={modoCadeia === 'coordenado'} onClick={() => setModoCadeia('coordenado')}>Coordenado</button>
                </div>

                <ol className={'cadeia' + (modoCadeia === 'coordenado' ? ' unida' : '')} id="cadeia">
                  <li>Alcance</li><li>Lead</li><li>Contato</li><li>Pré-qualificação</li><li>Screening</li><li>Randomização</li>
                  <span className="cadeia-volta" aria-hidden="true"></span>
                </ol>

                <p className="cadeia-retorno">O motivo de perda volta para a campanha</p>
                <p className="cadeia-nota" id="cadeiaNota" aria-live="polite">{TEXTOS_CADEIA[modoCadeia]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= 02 · EVIDÊNCIAS ============================= */}
        <section className="secao bloco escuro fundo-escuro" id="evidencias">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">Recrutamento é um desafio <span className="ac">em todas as pontas</span> e isso não é percepção nossa.</h2></div>
              <p className="lead">Cada número abaixo vem de uma fonte pública, identificada. Nenhum deles é da nossa operação: são o retrato do mercado em que a operação acontece.</p>
            </div>

            <div className="grade g4 grade--iguais esc">
              {EVIDENCIAS.map((e) => (
                <article className="evid" key={e.v + e.r}>
                  <span className="v">{e.v}</span>
                  <span className="r">{e.r}</span>
                  <p>{e.p}</p>
                  <p className="fonte">{e.fonte}</p>
                </article>
              ))}
            </div>

            <div className="declaracao declaracao--dupla rv" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)' }}>
              <div>
                <h3 className="h36">Em muitos casos, o problema não é falta de interesse do paciente.</h3>
                <p>É descoberta, comunicação, acesso e conexão entre a pessoa e a oportunidade de pesquisa. O paciente é parceiro do médico e do centro, e o trabalho é encurtar a distância entre os dois.</p>
              </div>

              <div className="ponte" id="ponte" style={{ '--p': ponteValor }}>
                <div className="ponte-trilho">
                  <span className="ponte-no">Paciente</span>
                  <span className="ponte-fio" aria-hidden="true"><i></i></span>
                  <span className="ponte-no">Centro</span>
                </div>

                <ul className="ponte-barreiras">
                  {BARREIRAS.map((b) => (
                    <li key={b.lim} data-lim={b.lim} className={ponteValor >= b.lim ? 'caiu' : ''}>{b.texto}</li>
                  ))}
                </ul>

                <label className="ponte-ctrl">
                  <span className="ponte-rot">Arraste para encurtar a distância</span>
                  <input type="range" min="0" max="100" step="1" id="ponteRange" value={ponteValor} onChange={(e) => setPonteValor(Number(e.target.value))} />
                </label>
                <p className="ponte-status" id="ponteStatus" aria-live="polite">{ponteStatus}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= 03 · O QUE FAZEMOS ============================= */}
        <section className="secao bloco claro fundo-branco" id="o-que-fazemos">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">Oito frentes que atendem o mesmo objetivo: <span className="ac">recrutar e construir reputação.</span></h2></div>
              <p className="lead">Cada entrega nasce da estratégia, não de uma lista fixa de peças. O que será construído depende do protocolo, da região e do momento do centro.</p>
            </div>

            <div className="trilho rv">
              <div className="trilho-lista" role="tablist" aria-label="Frentes de atuação em pesquisa clínica">
                {FRENTES.map((f, i) => (
                  <button
                    type="button"
                    role="tab"
                    key={f.id}
                    ref={(el) => (frentesBotoesRef.current[i] = el)}
                    id={'f' + (i + 1)}
                    aria-controls={'fp' + (i + 1)}
                    aria-selected={frenteAtiva === i}
                    tabIndex={frenteAtiva === i ? 0 : -1}
                    onClick={() => abrirFrente(i, false)}
                    onKeyDown={(e) => aoTecladoFrente(e, i)}
                  >
                    <span className="n">{String(i + 1).padStart(2, '0')}</span><span className="t">{f.titulo}</span>
                  </button>
                ))}
              </div>

              {FRENTES.map((f, i) => (
                <div className="trilho-painel" role="tabpanel" id={'fp' + (i + 1)} aria-labelledby={'f' + (i + 1)} key={f.id} hidden={frenteAtiva !== i}>
                  <p className="kicker">{'Frente ' + String(i + 1).padStart(2, '0')}</p>
                  <h3>{f.h3}</h3>
                  <p>{f.p}</p>
                  <ul>
                    {f.itens.map((it) => (<li key={it}>{it}</li>))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="cab rv" style={{ marginTop: 'clamp(56px,6vw,88px)', marginBottom: 32 }}>
              <p className="kicker">Três perguntas que ouvimos primeiro</p>
              <h3 className="h36">O que o seu centro está buscando?</h3>
            </div>
            <div className="grade g3 esc">
              <article className="card card--vivo">
                <span className="fio"></span>
                <p className="kicker">Marca e relacionamento</p>
                <h3 className="h22">Além da campanha de recrutamento</h3>
                <p className="sm">Construir a reputação que faz patrocinador e CRO reconhecerem o centro antes da conversa de feasibility começar.</p>
              </article>
              <article className="card card--vivo">
                <span className="fio" style={{ background: 'var(--rx-cyan)' }}></span>
                <p className="kicker" style={{ color: 'var(--cy-700)' }}>Aprovação com CEP e patrocinador</p>
                <h3 className="h22">Material que passa na submissão</h3>
                <p className="sm">Consultoria no desenvolvimento dos templates exigidos e suporte à aprovação das peças junto aos CEPs e ao patrocinador.</p>
              </article>
              <article className="card card--vivo">
                <span className="fio" style={{ background: 'var(--rx-magenta)' }}></span>
                <p className="kicker" style={{ color: 'var(--mg-500)' }}>Captação de recursos</p>
                <h3 className="h22">Verba de comunicação no orçamento</h3>
                <p className="sm">Assessoria na negociação da verba de comunicação dentro do orçamento de cada projeto, ainda antes do feasibility.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============================= 04 · COMO OPERAMOS ============================= */}
        <section className="secao bloco claro fundo-cinza" id="como-operamos">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">Do protocolo à randomização, <span className="ac">em seis etapas.</span></h2></div>
              <p className="lead">Não queremos substituir o centro nem tirar dele o relacionamento com o paciente: é o contrário. Funcionamos como uma estrutura central de recrutamento, conectando patrocinador, CRO e centro em torno de um único plano.</p>
            </div>

            <div className="percurso" id="percurso">
              {ETAPAS.map((e) => (
                <article className="etapa" key={e.n}>
                  <span className="barra" aria-hidden="true"><i></i></span>
                  <span className="num">{e.n}</span>
                  <h3>{e.t}</h3>
                  <p>{e.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================= 05 · ARQUITETURA ============================= */}
        <section className="secao bloco escuro fundo-escuro" id="arquitetura">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">Entre a captação e o centro existe <span className="ac">uma camada de qualificação.</span></h2></div>
              <p className="lead">Indústria e CRO definem o protocolo. A Random planeja, capta e qualifica. O centro recebe uma base pronta para triagem, sem o volume improdutivo no meio do caminho.</p>
            </div>

            <div className="fluxo esc">
              <div className="fluxo-col">
                <p className="kicker">Captação</p>
                <div className="no">Performance<small>Google, social media, native ads</small></div>
                <div className="no">Parcerias<small>Médicos, afiliados, portais de saúde</small></div>
                <div className="no">CRM<small>E-mail, SMS e WhatsApp</small></div>
                <div className="no no--proprio">Conteúdo<small>Blog e portal próprio de saúde</small></div>
              </div>
              <div className="fluxo-col">
                <p className="kicker">Qualificação</p>
                <div className="no no--destaque">Base de voluntários<small>Fonte única, não planilhas soltas</small></div>
                <div className="no no--destaque">Qualificação humanizada<small>Automação, IA e equipe humana</small></div>
                <div className="no no--destaque">Base qualificada<small>Filtrada contra o critério do protocolo</small></div>
                <div className="no">Gestão de performance<small>Otimização com dado de funil, não de clique</small></div>
              </div>
              <div className="fluxo-col">
                <p className="kicker">Destino</p>
                <div className="no no--centro">Centro de pesquisa<small>Recebe base pronta para triagem</small></div>
                <div className="no">Screening</div>
                <div className="no">Randomização ou falha de triagem</div>
                <div className="no">Retorno de motivo de perda<small>Volta como informação para a campanha</small></div>
              </div>
            </div>

            <div className="grade g2 grade--iguais rv" style={{ marginTop: 'clamp(36px,4vw,56px)' }}>
              <article className="card card--escuro">
                <span className="fio" style={{ background: 'var(--rx-cyan)' }}></span>
                <p className="kicker">Dados e consentimento</p>
                <h3 className="h22">A base segue viva para os dois lados</h3>
                <p className="sm">A base qualificada encaminhada ao centro pode passar a integrar a base do próprio centro e ser randomizada ou caracterizada como falha. Nos dois casos, segue disponível para comunicações futuras por ambas as partes, respeitados os termos de consentimento e a LGPD.</p>
              </article>
              <article className="card card--escuro">
                <span className="fio" style={{ background: 'var(--rx-magenta)' }}></span>
                <p className="kicker">Uma observação sobre tecnologia</p>
                <h3 className="h22">CRM e IA estão virando commodity</h3>
                <p className="sm">O diferencial está em saber o que fazer com as ferramentas: construir mensagem que gere confiança, traduzir um protocolo complexo em comunicação compreensível, manter bancos de pacientes vivos, qualificar sem prometer o que não pode ser prometido e transformar dado de marketing em decisão de recrutamento.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============================= 06 · CASES ============================= */}
        <section className="secao bloco claro fundo-branco" id="cases">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">Não é promessa. É <span className="ac">histórico verificável.</span></h2></div>
              <p className="lead">Não existe uma única fórmula para recrutamento. Uma condição prevalente tem desafios diferentes de um estudo que procura um perfil muito específico. Por isso a experiência foi construída estudo a estudo.</p>
            </div>

            <article className="case-alvo rv">
              <div className="case-alvo-topo">
                <div>
                  <p className="kicker">Case principal · pneumologia · asma</p>
                  <h3 className="h36">Nossos clientes foram, por meses seguidos, os maiores recrutadores de asma do país.</h3>
                  <p>O projeto combinou campanha de performance, portal próprio focado no paciente e recrutamento simultâneo em estados do Norte, Nordeste, Sul, Sudeste e Centro-Oeste, a mesma lógica multirregional exigida por protocolos com meta agressiva e população dispersa. Em vez de depender apenas dos canais institucionais do centro, construímos uma marca e um portal de conteúdo que seguem gerando audiência depois do fim da campanha.</p>
                </div>

                <div className="visor">
                  <div className="visor-barra">
                    <i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i>
                    <span className="visor-url">tudosobreasma.com.br</span>
                    <a className="visor-abrir" href="https://tudosobreasma.com.br" target="_blank" rel="noopener">Abrir ↗</a>
                  </div>
                  <iframe className="visor-tela" src="https://tudosobreasma.com.br" title="Portal Tudo Sobre Asma" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>

              <div className="placar">
                <div><span className="n">+12,1 mi</span><span className="r">impressões em anúncios</span></div>
                <div><span className="n">+101 mil</span><span className="r">cliques em anúncios</span></div>
                <div><span className="n">4.750</span><span className="r">leads gerados</span></div>
                <div><span className="n">R$ 14,55</span><span className="r">custo por lead</span></div>
                <div><span className="n">85</span><span className="r">pacientes randomizados</span></div>
                <div><span className="n">R$ 814,17</span><span className="r">custo por randomização</span></div>
              </div>

              <div className="case-rodape">
                <p className="fonte">Operação Tudo Sobre Asma, conduzida em parceria com indústria farmacêutica. Período de apuração a confirmar. A citação nominal das indústrias parceiras depende de autorização.</p>
              </div>
            </article>

            <div className="cab rv" style={{ marginTop: 'clamp(56px,6vw,88px)', marginBottom: 28 }}>
              <p className="kicker">Três áreas terapêuticas</p>
              <h3 className="h36">Comportamentos diferentes, no mesmo método.</h3>
              <p className="lead">Volume de leads e resultado final não são a mesma coisa. Os três recortes abaixo mostram por que a análise não pode parar no custo por lead.</p>
            </div>

            <div className="grade g3 grade--iguais esc">
              {CASES_AREA.map((c) => (
                <article className={'case-area' + (c.classe ? ' ' + c.classe : '')} key={c.titulo}>
                  <div className="topo">
                    <h3>{c.titulo}</h3>
                    <span className={'tag ' + c.tagClasse}>{c.tag}</span>
                  </div>
                  <p className="destaque">{c.destaque}<span>{c.destaqueR}</span></p>
                  <dl>
                    {c.linhas.map(([dt, dd]) => (
                      <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>
                    ))}
                  </dl>
                  <p className="leitura">{c.leitura}</p>
                </article>
              ))}
            </div>

            <div className="declaracao rv">
              <p className="kicker">Somando os três recortes</p>
              <h3 className="h36">Três áreas terapêuticas, mais de 300 randomizações.</h3>
              <div className="placar4">
                <div><span className="n">+6,3 mi</span><span className="r">impressões</span></div>
                <div><span className="n">+86,6 mil</span><span className="r">cliques</span></div>
                <div><span className="n">7.353</span><span className="r">leads gerados</span></div>
                <div><span className="n">302</span><span className="r">pacientes randomizados</span></div>
              </div>
              <p style={{ marginTop: 18 }}>Os resultados apresentam comportamentos bastante diferentes entre as áreas, justamente o que reforça a importância de analisar cada protocolo, público e jornada de maneira individual.</p>
            </div>

            <div className="cab rv" style={{ marginTop: 'clamp(56px,6vw,88px)', marginBottom: 28 }}>
              <p className="kicker">Outras operações</p>
              <h3 className="h36">A mesma lógica, em contextos diferentes.</h3>
            </div>

            <div className="grade g3 grade--iguais esc">
              {OUTRAS_OPERACOES.map((o) => (
                <article className="card card--vivo" key={o.kicker}>
                  <span className="fio" style={o.fio ? { background: o.fio } : undefined}></span>
                  <div className="caso-topo">
                    <p className="kicker" style={o.kickerCor ? { color: o.kickerCor } : undefined}>{o.kicker}</p>
                    <span className="marca-slot">logo</span>
                  </div>
                  <h3 className="h22">{o.titulo}</h3>
                  <p className="sm">{o.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================= 07 · O QUE APRENDEMOS ============================= */}
        <section className="secao bloco claro fundo-cinza" id="aprendizados">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">Mais importante do que qualquer indicador isolado é <span className="ac">o que aprendemos comparando projetos diferentes.</span></h2></div>
              <p className="lead">Não começamos uma campanha do zero. Começamos com o que já aprendemos em mais de 10 áreas terapêuticas e diferentes realidades de recrutamento no Brasil.</p>
            </div>

            <ul className="licoes rv" ref={licoesRef}>
              {LICOES.map((l, i) => (
                <li key={l}><span className="n">{String(i + 1).padStart(2, '0')}</span><p>{l}</p></li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================= 08 · DEPOIMENTOS ============================= */}
        <section className="secao bloco claro fundo-branco" id="depoimentos">
          <div className="shell">
            <div className="cab rv">
              <h2 className="h48">O que profissionais do mercado <span className="ac">dizem sobre nós.</span></h2>
            </div>

            <div className="grade g4 grade--iguais esc">
              {DEPOIMENTOS.map((d) => (
                <figure className="depo" key={d.nome}>
                  <span className="aspas" aria-hidden="true">&ldquo;</span>
                  <blockquote>{d.txt}</blockquote>
                  <figcaption><p className="nome">{d.nome}</p><p className="cargo">{d.cargo}</p></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============================= 09 · ALCANCE ============================= */}
        <section className="secao bloco escuro fundo-escuro" id="alcance">
          <div className="shell">
            <div className="cab cab--duplo rv">
              <div><h2 className="h48">Mais de 30 doenças, <span className="ac">em mais de 10 áreas terapêuticas.</span></h2></div>
              <p className="lead">Cada condição na lista abaixo passou por um projeto real de comunicação ou recrutamento conduzido pela equipe.</p>
            </div>

            <div className="nuvem rv" ref={nuvemRef}>
              {NUVEM.map((item) => {
                const [nome, destacada] = Array.isArray(item) ? item : [item, false]
                return (
                  <span className={'tag ' + (destacada ? 'tag--brand' : 'tag--neutro')} key={nome}>#{nome}</span>
                )
              })}
            </div>
            <p className="legenda-nuvem">Em roxo, as condições com case detalhado nesta página.</p>

            <div className="cab rv" style={{ marginTop: 'clamp(56px,6vw,80px)', marginBottom: 28 }}>
              <p className="kicker">Parceiros</p>
              <h3 className="h36">Centros e grupos que já trabalharam conosco.</h3>
            </div>
            <div className="slots rv" aria-label="Centros e grupos parceiros">
              {PARCEIROS.map((p) => (<div className="slot" key={p}>{p}</div>))}
            </div>
          </div>
        </section>

        {/* ============================= CONTATO ============================= */}
        <section className="secao bloco escuro fundo-escuro contato" id="contato" ref={contatoRef}>
          <div className="shell">
            <div className="contato-grade">
              <div className="rv">
                <p className="kicker">Próximo passo</p>
                <h2 className="h48">Uma conversa técnica de <span style={{ color: 'var(--rx-cyan)' }}>uma hora.</span></h2>
                <p className="lead" style={{ marginTop: 20 }}>Para entender protocolos ativos, regiões prioritárias e onde o funil está travando hoje. Daí saem o recorte de piloto, o plano de leitura e o critério de pré-qualificação.</p>

                <div className="flutua" id="flutua" aria-hidden="true" ref={flutuaRef}>
                  <div className="flutua-in">
                    <svg viewBox="0 0 98 164" focusable="false">
                      <path fill="currentColor" d="M33.34 128.15C68.44 128.15 96.9 99.7 96.9 64.59C96.9 63.4 96.8 0 96.8 0H75.49L75.64 64.73C74.94 87.94 56.2 106.54 33.17 106.54C33.11 106.54 33.06 106.54 33 106.54V128.14C33.11 128.14 33.22 128.14 33.33 128.14L33.34 128.15Z" />
                      <path fill="currentColor" d="M63.56 35.5C28.45 35.5 0 63.95 0 99.05C0 100.24 0.1 163.64 0.1 163.64H21.41L21.26 98.91C21.96 75.7 40.7 57.1 63.73 57.1C63.79 57.1 63.84 57.1 63.9 57.1V35.5C63.79 35.5 63.68 35.5 63.57 35.5H63.56Z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-caixa rv">
                <form name="contato-pesquisa-clinica" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={handleSubmitContato}>
                  <input type="hidden" name="form-name" value="contato-pesquisa-clinica" />
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
                      <label htmlFor="f-org">Organização</label>
                      <input id="f-org" name="organizacao" type="text" autoComplete="organization" placeholder="Centro, CRO ou patrocinador" />
                    </div>
                    <div className="campo">
                      <label htmlFor="f-perfil">Perfil</label>
                      <select id="f-perfil" name="perfil" defaultValue="">
                        <option value="">Selecione</option>
                        <option>Centro de pesquisa</option>
                        <option>Grupo ou rede de centros</option>
                        <option>CRO</option>
                        <option>Patrocinador / indústria</option>
                        <option>Investigador</option>
                        <option>Outro</option>
                      </select>
                    </div>
                    <div className="campo campo--largo">
                      <label htmlFor="f-desafio">Onde o recrutamento está travando</label>
                      <textarea id="f-desafio" name="desafio" placeholder="Conte o protocolo, as regiões e o ponto do funil que está preocupando."></textarea>
                    </div>
                  </div>

                  <label className="consenti">
                    <input type="checkbox" name="consentimento" required />
                    <span className="marca-cx" aria-hidden="true"></span>
                    <span className="txt">Autorizo o uso dos meus dados para que a Random entre em contato sobre esta solicitação. Os dados não são usados para outra finalidade e podem ser removidos a qualquer momento.</span>
                  </label>

                  <div className="form-acoes">
                    <button className="btn btn--primario" type="submit">
                      Enviar
                      <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <p className="form-nota">Este canal é para centros, CROs e patrocinadores. Voluntários devem procurar diretamente o centro de pesquisa.</p>
                    <FormStatus status={statusContato} />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================= NEWSLETTER ============================= */}
      <section className="secao escuro fundo-escuro news" id="newsletter">
        <div className="shell">
          <div className="news-grade">
            <div className="rv">
              <div className="news-marca">
                <svg viewBox="0 0 347 74" role="img" aria-label="Random"><use href="#random-wordmark" /></svg>
                <span>Newsletter</span>
              </div>
              <h2 className="h36">O que está mudando no recrutamento de pacientes, direto na sua caixa.</h2>
              <p>Dados novos do setor, leitura de cases reais, mudanças de regra que afetam a comunicação com o voluntário e o que temos aprendido campanha a campanha. Escrita para quem toca centro, CRO ou estudo, não para o público geral.</p>
            </div>

            <div className="rv">
              <form className="news-form" name="newsletter-random" method="POST" data-netlify="true" netlify-honeypot="bot-news" onSubmit={handleSubmitNews}>
                <input type="hidden" name="form-name" value="newsletter-random" />
                <p hidden><label>Não preencha: <input name="bot-news" /></label></p>
                <div className="campo">
                  <label className="so-leitor" htmlFor="news-nome">Seu nome</label>
                  <input id="news-nome" name="nome" type="text" autoComplete="name" required placeholder="Seu nome" />
                </div>
                <div className="campo">
                  <label className="so-leitor" htmlFor="news-email">Seu e-mail</label>
                  <input id="news-email" name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" />
                </div>
                <button className="btn btn--primario news-enviar" type="submit">
                  Quero receber
                  <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <FormStatus status={statusNews} />
              </form>
              <p className="news-nota">Você pode cancelar a inscrição a qualquer momento. Usamos o e-mail apenas para enviar a newsletter, conforme a LGPD.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= RODAPÉ ============================= */}
      <footer className="rodape escuro">
        <div className="shell">
          <div className="rodape-grade">
            <div className="rodape-marca">
              <svg className="logo-pe" viewBox="0 0 347 74" role="img" aria-label="Random"><use href="#random-wordmark" /></svg>
              <p>Random Pesquisa é a unidade da Emcomjunto dedicada ao ecossistema de pesquisa clínica. Comunicação, geração de demanda e operação de recrutamento para centros, CROs e patrocinadores.</p>
              <div className="sociais">
                <a className="social" href="https://www.instagram.com/randompesquisa" aria-label="Instagram da Random" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>
                </a>
                <a className="social" href="https://www.linkedin.com/company/randompesquisa" aria-label="LinkedIn da Random" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.4 10.4V17M7.4 7.3v.1M11.4 17v-3.8c0-1.2.8-2.1 1.9-2.1s1.9.9 1.9 2.1V17" /></svg>
                </a>
              </div>
            </div>
            <div className="rodape-col">
              <p className="kicker">Nesta página</p>
              <ul>
                <li><a href="#problema">O problema</a></li>
                <li><a href="#evidencias">Evidências</a></li>
                <li><a href="#o-que-fazemos">O que fazemos</a></li>
                <li><a href="#cases">Cases</a></li>
                <li><a href="#alcance">Alcance</a></li>
              </ul>
            </div>
            <div className="rodape-col">
              <p className="kicker">Mercados</p>
              <ul>
                <li><a href="/varejo">Varejo</a></li>
                <li><a href="/esg-eficiencia-riscos">ESG, eficiência e riscos</a></li>
                <li><a href="/pesquisa-clinica">Pesquisa clínica</a></li>
                <li><a href="/quem-assessoramos">Quem assessoramos</a></li>
              </ul>
            </div>
            <div className="rodape-col">
              <p className="kicker">A Emcomjunto</p>
              <ul>
                <li><a href="/a-emcomjunto">A Emcomjunto</a></li>
                <li><a href="/o-que-fazemos">O que fazemos</a></li>
                <li><a href="/cases">Cases</a></li>
                <li><a href="/como-contratar">Como contratar</a></li>
              </ul>
            </div>
          </div>
          <div className="rodape-base">
            <span>© 2026 Emcomjunto · Random Pesquisa</span>
            <span>Assessoria Comercial Criativa</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
