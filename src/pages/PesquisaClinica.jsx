import { useEffect, useRef, useState } from 'react'
import LogoSprite from '../components/LogoSprite.jsx'
import FormStatus from '../components/FormStatus.jsx'
import VitrineCases from '../components/VitrineCases.jsx'
import SeletorIdioma, { idiomaAtual } from '../components/SeletorIdioma.jsx'
import { EsteiraFunis, TeiaDepoimentos, EstudosAcordeao, AreasPiscando } from '../components/RandomCases.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import useCoreScrollEffects from '../hooks/useCoreScrollEffects.js'
import useFormWebhook from '../hooks/useFormWebhook.js'
import {
  NAV, MISSAO, PROBLEMAS, EVIDENCIAS, PRATICA, VITRINE,
  NUMEROS_PRINCIPAIS, NUMEROS_SECUNDARIOS, CLIENTES, FUNIS, DEPOIMENTOS, ESTUDOS_CASO,
  OUTRAS_AREAS, TIME, PAPEIS, SOLUCOES, TIPOS_ORG, PROCURA, PARTICIPAR, ESTUDOS, CANAIS,
} from './pesquisa-clinica-dados.js'

import '../styles/random/variables.css'
import '../styles/random/pesquisa-clinica.css'
import '../styles/random/pesquisa-clinica-v7.css'

/* ==========================================================================
   PESQUISA CLÍNICA (marca Random) · versão v7
   Estrutura e textos seguem o wireframe aprovado (random_wireframe_ux_v7);
   o visual continua o design system da Random (variables.css +
   pesquisa-clinica.css). Classes novas desta versão ficam em
   pesquisa-clinica-v7.css. Página sem <MainLayout>: header e rodapé
   próprios, tudo escopado em .pagina-pesquisa-clinica.
   Conteúdo (textos, números, fontes) em pesquisa-clinica-dados.js.
   ========================================================================== */

const SETA = (
  <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const SIMBOLO = (
  <>
    <path fill="currentColor" d="M33.34 128.15C68.44 128.15 96.9 99.7 96.9 64.59C96.9 63.4 96.8 0 96.8 0H75.49L75.64 64.73C74.94 87.94 56.2 106.54 33.17 106.54C33.11 106.54 33.06 106.54 33 106.54V128.14C33.11 128.14 33.22 128.14 33.33 128.14L33.34 128.15Z" />
    <path fill="currentColor" d="M63.56 35.5C28.45 35.5 0 63.95 0 99.05C0 100.24 0.1 163.64 0.1 163.64H21.41L21.26 98.91C21.96 75.7 40.7 57.1 63.73 57.1C63.79 57.1 63.84 57.1 63.9 57.1V35.5C63.79 35.5 63.68 35.5 63.57 35.5H63.56Z" />
  </>
)

// Título que se redigita: só a palavra muda ("marketing", "dados"…); o
// resto da frase fica fixo. Digita, espera, apaga e digita a próxima, em
// loop, só enquanto o hero está visível.
const PALAVRAS_TITULO = ['marketing', 'dados', 'tecnologia', 'comunicação', 'inteligência']

function useTituloDigitando(heroRef, tituloRef, alvoRef) {
  useEffect(() => {
    const titulo = tituloRef.current
    const alvo = alvoRef.current
    const hero = heroRef.current
    if (!titulo || !alvo) return undefined
    alvo.textContent = PALAVRAS_TITULO[0]
    // com tradução automática ativa, o título fica parado (o tradutor não
    // acompanha texto que muda a cada letra)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || idiomaAtual() !== 'pt') return undefined

    let v = 0
    let n = PALAVRAS_TITULO[0].length
    let apagando = true
    let relogio = null
    let visivel = true

    function passo() {
      const palavra = PALAVRAS_TITULO[v]
      let espera
      if (apagando) {
        n--
        alvo.textContent = palavra.slice(0, n)
        titulo.classList.add('escrevendo')
        if (n <= 0) {
          apagando = false
          v = (v + 1) % PALAVRAS_TITULO.length
          espera = 380
        } else espera = 45
      } else {
        const nova = PALAVRAS_TITULO[v]
        n++
        alvo.textContent = nova.slice(0, n)
        if (n >= nova.length) {
          apagando = true
          titulo.classList.remove('escrevendo')
          espera = 2400
        } else espera = 70 + Math.random() * 40
      }
      agendar(espera)
    }
    function agendar(ms) {
      clearTimeout(relogio)
      if (!visivel) return
      relogio = setTimeout(passo, ms)
    }

    let ot
    if (hero && 'IntersectionObserver' in window) {
      ot = new IntersectionObserver((e) => {
        visivel = e[0].isIntersecting
        if (visivel) agendar(600)
        else clearTimeout(relogio)
      }, { threshold: 0 })
      ot.observe(hero)
    }
    agendar(2400)
    return () => {
      clearTimeout(relogio)
      if (ot) ot.disconnect()
    }
  }, [heroRef, tituloRef, alvoRef])
}

// Contador que sobe uma vez quando `iniciar` vira true.
function Contador({ alvo, milhar = false, iniciar }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!iniciar || !ref.current) return undefined
    const fmt = (v) => (milhar ? Math.round(v).toLocaleString('pt-BR') : String(Math.round(v)))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current.textContent = fmt(alvo)
      return undefined
    }
    let ini = null
    let q
    function passo(t) {
      if (ini === null) ini = t
      const p = Math.min((t - ini) / 1500, 1)
      ref.current.textContent = fmt(alvo * (1 - Math.pow(1 - p, 3)))
      if (p < 1) q = requestAnimationFrame(passo)
    }
    q = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(q)
  }, [iniciar, alvo, milhar])
  return <span ref={ref}>0</span>
}

// Revelação (.rv/.esc) + disparo dos contadores quando #numeros entra na tela.
function useRevelacaoEContadores(setContar) {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll('.pagina-pesquisa-clinica .rv, .pagina-pesquisa-clinica .esc'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.classList.add('on'))
      setContar(true)
      return undefined
    }
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('on')
        obs.unobserve(e.target)
        if (e.target.id === 'numeros') setContar(true)
      }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    alvos.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [setContar])
}

function Texto({ partes }) {
  return partes.map((x, i) => (typeof x === 'string' ? <span key={i}>{x}</span> : <b key={i}>{x.b}</b>))
}



/* Missão do hero: órbita com o símbolo da Random no centro, anel de texto
   girando e três pontos (Missão, Paciente, Contexto). Cada ponto troca a
   legenda embaixo; sem interação, os três se revezam sozinhos. Passar o
   mouse ou focar pausa o revezamento. */
const MISSAO_PONTOS = [
  { rotulo: 'Nossa missão', curto: 'Missão', t: 'Estudar para comunicar melhor.', p: 'Estudamos, desenvolvemos e implementamos estratégias de comunicação, marketing, inteligência de mercado, dados e tecnologia aplicadas à pesquisa clínica e ao desenvolvimento de medicamentos.' },
  ...MISSAO.map(([t, p], i) => ({ rotulo: i === 0 ? 'Paciente' : 'Contexto', curto: i === 0 ? 'Paciente' : 'Contexto', t, p })),
]
const MISSAO_ANG = [-90, 30, 150]

function MissaoOrbita() {
  const [ativo, setAtivo] = useState(0)
  const [pausado, setPausado] = useState(false)
  const botoesRef = useRef([])
  const DUR = 6500

  useEffect(() => {
    if (pausado || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setTimeout(() => setAtivo((i) => (i + 1) % MISSAO_PONTOS.length), DUR)
    return () => clearTimeout(id)
  }, [ativo, pausado])

  function teclado(e, i) {
    let n = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % MISSAO_PONTOS.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + MISSAO_PONTOS.length) % MISSAO_PONTOS.length
    if (n === null) return
    e.preventDefault()
    setAtivo(n)
    botoesRef.current[n]?.focus()
  }

  return (
    <div className={'missao7' + (pausado ? ' pausado' : '')} onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)} onBlur={() => setPausado(false)}>
      <div className="missao7-orbe">
        <svg className="missao7-arte" viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <linearGradient id="missaoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#75FBFD" />
              <stop offset="1" stopColor="#E44DF2" />
            </linearGradient>
            <path id="missaoAro" d="M200 200 m-194 0 a194 194 0 1 1 388 0 a194 194 0 1 1 -388 0" />
          </defs>
          <circle className="missao7-halo" cx="200" cy="200" r="120" />
          <circle className="missao7-anel" cx="200" cy="200" r="140" />
          <circle className="missao7-anel missao7-anel--fino" cx="200" cy="200" r="176" />
          <g className="missao7-giro">
            <text className="missao7-aro-txt"><textPath href="#missaoAro" startOffset="0">ESTUDAR PARA COMUNICAR MELHOR · PACIENTE NO CENTRO · CONTEXTO CLÍNICO · BENCHMARKING CONTÍNUO ·</textPath></text>
          </g>
          <g transform="translate(170.6 151) scale(.6)" className="missao7-simbolo">{SIMBOLO}</g>
        </svg>

        <div className="missao7-pontos" role="tablist" aria-label="Nossa missão">
          {MISSAO_PONTOS.map((pt, i) => {
            const r = (MISSAO_ANG[i] * Math.PI) / 180
            return (
              <button key={pt.curto} ref={(el) => (botoesRef.current[i] = el)} type="button" role="tab"
                id={'missao-aba-' + i} aria-selected={ativo === i} aria-controls="missao-painel" tabIndex={ativo === i ? 0 : -1}
                className={'missao7-ponto' + (ativo === i ? ' on' : '')}
                style={{ left: 50 + 35 * Math.cos(r) + '%', top: 50 + 35 * Math.sin(r) + '%' }}
                onClick={() => setAtivo(i)} onKeyDown={(e) => teclado(e, i)}>
                <span className="missao7-ponto-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="missao7-ponto-t">{pt.curto}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* As três legendas ficam empilhadas na mesma célula do grid: a caixa
          assume a altura da mais longa e o hero não muda de tamanho na troca. */}
      <div className="missao7-legenda" id="missao-painel" role="tabpanel" aria-labelledby={'missao-aba-' + ativo} aria-live="polite">
        {MISSAO_PONTOS.map((pt, i) => (
          <div className={'missao7-item' + (i === ativo ? ' on' : '')} key={pt.curto} aria-hidden={i !== ativo}>
            <p className="kicker kicker--linha">{pt.rotulo}</p>
            {i === 0 ? <h2 className="h36">{pt.t}</h2> : <h3 className="h36">{pt.t}</h3>}
            <p>{pt.p}</p>
          </div>
        ))}
        <span className="missao7-tempo" aria-hidden="true"><i key={ativo} style={{ animationDuration: DUR + 'ms' }} /></span>
      </div>
    </div>
  )
}

export default function PesquisaClinica() {
  useDocumentMeta({
    title: 'Random · Marketing em pesquisa clínica',
    description: 'A Random une pesquisa clínica, saúde, comunicação, marketing, dados e tecnologia para criar modelos de recrutamento mais mensuráveis, replicáveis e previsíveis.',
    canonical: 'https://emcomjunto.com.br/pesquisa-clinica',
  })
  useCoreScrollEffects()

  const [menuAberto, setMenuAberto] = useState(false)
  const heroRef = useRef(null)
  const tituloRef = useRef(null)
  const palavraRef = useRef(null)
  useTituloDigitando(heroRef, tituloRef, palavraRef)
  const [contando, setContando] = useState(false)
  useRevelacaoEContadores(setContando)

  const [solucao, setSolucao] = useState(0)
  const abasRef = useRef([])
  function tecladoAbas(e, i) {
    let n = null
    if (e.key === 'ArrowRight') n = (i + 1) % SOLUCOES.length
    if (e.key === 'ArrowLeft') n = (i - 1 + SOLUCOES.length) % SOLUCOES.length
    if (e.key === 'Home') n = 0
    if (e.key === 'End') n = SOLUCOES.length - 1
    if (n === null) return
    e.preventDefault()
    setSolucao(n)
    abasRef.current[n]?.focus()
  }
  const s = SOLUCOES[solucao]

  const { status: statusContato, handleSubmit: enviarContato } = useFormWebhook()
  const [procura, setProcura] = useState([])
  const [avisoProcura, setAvisoProcura] = useState('')
  function alternaProcura(v) {
    setAvisoProcura('')
    setProcura((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]))
  }
  function aoEnviar(e) {
    if (!procura.length) {
      e.preventDefault()
      setAvisoProcura('Selecione pelo menos uma opção em "O que você procura?".')
      return
    }
    enviarContato(e)
    setProcura([])
  }

  return (
    <div className="pagina-pesquisa-clinica">
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <LogoSprite />
      <div className="progresso" aria-hidden="true"><i id="barra"></i></div>

      {/* ============================= NAV ============================= */}
      <header className="nav" id="nav">
        <div className="shell">
          <a className="logo" href="#sobre-random" aria-label="Random, início da página">
            <svg viewBox="0 0 347 74" role="img" aria-hidden="true"><use href="#random-wordmark" /></svg>
            <span className="unidade">Clinical trials marketing</span>
          </a>
          <nav className={'nav-links' + (menuAberto ? ' aberto' : '')} id="navLinks" aria-label="Principal" onClick={(e) => {
            if (e.target.tagName === 'A') setMenuAberto(false)
          }}>
            {NAV.map(([h, t]) => <a key={h} href={h}>{t}</a>)}
            <a className="nav-emcj" href="https://emcomjunto.com.br">Emcomjunto ↗</a>
          </nav>
          <SeletorIdioma />
          <button className="nav-btn" id="navBtn" aria-expanded={menuAberto} aria-controls="navLinks" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuAberto((a) => !a)}>
            <i></i>
          </button>
          <a className="btn btn--primario" href="#contato">Falar sobre um projeto ↗</a>
        </div>
      </header>

      <main id="conteudo">
        {/* ============================= HERO · SOBRE A RANDOM ============================= */}
        <section className="hero hero-pesquisa-clinica secao escuro" id="sobre-random" ref={heroRef}>
          <div className="shell">
            <div className="hero7">
              <div className="hero7-texto">
                <p className="kicker kicker--linha">Random Pesquisa Clínica</p>
                <h1 className="d88 titulo-anim" id="tituloHero" ref={tituloRef}>
                  <span className="so-leitor">A Random é marketing em pesquisa clínica.</span>
                  <span className="h1-visual" aria-hidden="true">
                    <span className="h1-fixo">A Random é</span>
                    {/* o molde reserva o espaço da palavra mais longa: o título não pula */}
                    <span className="troca">
                      <span className="troca-molde">inteligência em pesquisa clínica.</span>
                      <span className="troca-viva"><span className="tv-a" ref={palavraRef}>marketing</span><i className="cursor"></i><span className="tv-b"> em pesquisa clínica.</span></span>
                    </span>
                  </span>
                </h1>
                <p className="hero-sub">Unimos pesquisa clínica, saúde, comunicação, marketing, inteligência de mercado, dados e tecnologia na prática para criar modelos de recrutamento mais mensuráveis, replicáveis e progressivamente mais previsíveis.</p>
                <div className="acoes">
                  <a className="btn btn--primario" href="#contato">Falar sobre um protocolo {SETA}</a>
                  <a className="btn btn--secundario" href="#cases">Ver os cases</a>
                </div>
              </div>

              <MissaoOrbita />
            </div>
          </div>
        </section>

        {/* ============================= POR QUE RANDOM · O PROBLEMA ============================= */}
        <section className="secao bloco claro fundo-branco porque7" id="por-que-random">
          <div className="shell">
            <div className="cab rv">
              <p className="kicker kicker--linha">O problema</p>
              <h2 className="h64">Recrutamento é um dos gargalos mais críticos da <span className="ac">pesquisa clínica.</span></h2>
              <p className="lead cab-lead">E pede mais do que verba e divulgação. Exige estratégia integrada entre marketing, dados, tecnologia, atendimento e operação, do planejamento à jornada do paciente.</p>
            </div>

            <div className="problema7">
              <ol className="problema7-lista">
                {PROBLEMAS.map((pr, i) => (
                  <li className="rv" key={pr.t}>
                    <span className="problema7-n">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{pr.t}</h3>
                      <p><Texto partes={pr.p} /></p>
                      <p className="fontes">
                        {pr.fontes.map(([rot, url]) => (
                          <a key={rot} href={url} target="_blank" rel="noopener">Fonte: {rot} ↗</a>
                        ))}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <aside className="entra rv" aria-labelledby="tit-entra">
                <p className="kicker kicker--linha">Onde a Random entra</p>
                <h3 className="h36" id="tit-entra">Falar mais sobre <span className="ac-ciano">Pesquisa Clínica</span> do que sobre aquilo que importa ao paciente pode ser uma miopia de marketing.</h3>
                <p>Antes de ensinar sobre pesquisa clínica, vale uma pergunta: <b>como sua comunicação gera valor para o paciente, conquista seu interesse e acompanha sua jornada?</b></p>
                <ul>
                  <li>Especialistas conectados.</li>
                  <li>Recursos coordenados.</li>
                  <li>Relacionamento contínuo.</li>
                </ul>
                <a className="btn btn--primario" href="#contato">Vamos estudar seu recrutamento ↗</a>
                <p className="entra-nota">Ética, proteção de dados, transparência e autonomia do participante como premissas.</p>
              </aside>
            </div>
          </div>
        </section>

        {/* ============================= EVIDÊNCIAS ============================= */}
        <section className="secao bloco escuro fundo-escuro evid-secao" id="evidencias">
          <div className="shell">
            <div className="cab rv">
              <p className="kicker kicker--linha">Estudos, notícias e benchmarks</p>
              <h2 className="h48">Os desafios têm <span className="ac">evidências.</span></h2>
              <p className="lead cab-lead">O gargalo do recrutamento não é impressão de quem está no dia a dia: está medido em estudos, relatórios e benchmarks recentes. Reunimos nove deles, cada um com a fonte e o limite do que o dado permite afirmar.</p>
            </div>
            {/* Esteira em câmera lenta: pausa ao passar o mouse ou focar um
                cartão, e o número do cartão sob o mouse "salta". Sem hover
                (celular) ou com movimento reduzido, vira faixa rolável. */}
            <div className="evid-esteira rv" role="region" aria-label="Evidências sobre recrutamento">
              <div className="evid-fita">
                {[0, 1].map((k) => (
                  <ul className="evid-grupo" key={k} aria-hidden={k === 1}>
                    {EVIDENCIAS.map((e) => (
                      <li key={e.v}>
                        <article className="evid7" tabIndex={k === 1 ? -1 : 0}>
                          <p className="evid7-tipo">{e.tipo}</p>
                          <span className={'evid7-v' + (e.v.length > 8 ? ' evid7-v--longo' : '')}>{e.v}</span>
                          <span className="evid7-r">{e.r}</span>
                          <p className="evid7-p">{e.p}</p>
                          <p className="evid7-limite">{e.limite}</p>
                          <div className="evid7-rodape">
                            <span>{e.fonte}</span>
                            <a href={e.url} target="_blank" rel="noopener" tabIndex={k === 1 ? -1 : undefined}>{e.link} →</a>
                          </div>
                        </article>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
            <p className="evid-dica rv">Passe o mouse para pausar e ler.</p>
          </div>
        </section>

        {/* ============================= COMO FAZEMOS ============================= */}
        <section className="secao bloco claro fundo-branco" id="como-fazemos">
          <div className="shell">
            <div className="pratica7">
              <div className="rv">
                <p className="kicker kicker--linha">Como fazemos na prática</p>
                <h2 className="h64">Marcas presentes antes, durante e <span className="ac">depois.</span></h2>
              </div>
              <ol className="pratica7-lista rv">
                {PRATICA.map((p, i) => <li key={p}><span>{String(i + 1).padStart(2, '0')}</span>{p}</li>)}
              </ol>
            </div>

            <VitrineCases itens={VITRINE} />

            <p className="pratica7-texto rv">Antes de apresentar uma oportunidade de participação, conectamos <b>marcas, conteúdos, criadores, canais e experiências nos ambientes digital e físico</b> para gerar valor para pacientes e para todos os envolvidos na pesquisa clínica. Esse é o trabalho central do marketing em pesquisa clínica: construir presença, relacionamento e confiança ao longo de toda a jornada.</p>
          </div>
        </section>

        {/* ============================= EXPERIÊNCIA · NÚMEROS ============================= */}
        <section className="secao bloco escuro fundo-escuro" id="experiencia">
          <div className="shell">
            <div className="cab rv">
              <p className="kicker kicker--linha">Números e resultados</p>
              <h2 className="h48">Uma das experiências mais amplas em marketing e comunicação para <span className="ac">pesquisa clínica.</span></h2>
            </div>

            <div className="numeros7 rv" id="numeros">
              <div className="numeros7-top">
                {NUMEROS_PRINCIPAIS.map((n) => (
                  <div key={n.r}><span className="n"><Contador alvo={n.alvo} iniciar={contando} />{n.suf}</span><span className="r">{n.r}</span></div>
                ))}
              </div>
              <div className="numeros7-sec">
                {NUMEROS_SECUNDARIOS.map((n) => (
                  <div key={n.r}><span className="n"><Contador alvo={n.alvo} milhar={n.mil} iniciar={contando} />{n.suf}</span><span className="r">{n.r}</span></div>
                ))}
              </div>
            </div>

            <p className="kicker clientes7-tit rv">Clientes e organizações atendidas em pesquisa clínica</p>
            <ul className="clientes7 rv">
              {CLIENTES.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </section>

        {/* ============================= CASES ============================= */}
        <section className="secao bloco claro fundo-branco" id="cases">
          <div className="shell">
            <div className="cab rv">
              <p className="kicker kicker--linha">Funis de recrutamento</p>
              <h2 className="h48 titulo-linha">Cinco funis, <span className="ac">cinco leituras diferentes.</span></h2>
            </div>
            <EsteiraFunis funis={FUNIS} />

            <div className="cab rv subcab">
              <p className="kicker kicker--linha">Depoimentos</p>
              <h3 className="h36">Quem esteve do outro lado da operação.</h3>
              <p className="lead cab-lead">Relatos históricos compartilhados por profissionais e clientes em projetos de pesquisa clínica.</p>
            </div>
            <TeiaDepoimentos depoimentos={DEPOIMENTOS} logo={<svg className="teia-logo" viewBox="0 0 98 164">{SIMBOLO}</svg>} />

            <div className="cab rv subcab">
              <p className="kicker kicker--linha">Estudos de caso</p>
              <h3 className="h36">Resultados reais, contextos diferentes.</h3>
            </div>
            <EstudosAcordeao casos={ESTUDOS_CASO} funis={FUNIS} />

            <div className="cab rv subcab">
              <p className="kicker kicker--linha">Outras experiências</p>
              <h3 className="h36">Áreas terapêuticas e condições que já passaram pelos nossos projetos.</h3>
            </div>
            <AreasPiscando areas={OUTRAS_AREAS} />
          </div>
        </section>

        {/* ============================= TIME · EMCOMJUNTO + INVICTA ============================= */}
        <section className="secao bloco claro fundo-cinza" id="time">
          <div className="shell">
            <div className="cab rv">
              <p className="kicker kicker--linha">Emcomjunto + Invicta</p>
              <h2 className="h48">Marketing e pesquisa clínica. <span className="ac">Na mesma mesa.</span></h2>
              <p className="lead cab-lead">Na Random, a experiência em comunicação, marketing e tecnologia da Emcomjunto se conecta à vivência de operação, qualidade e processos em pesquisa clínica da Invicta.</p>
            </div>

            <div className="time7 esc">
              {TIME.map((p) => (
                <article className={'pessoa pessoa--' + (p.org === 'Invicta' ? 'invicta' : 'emcj')} key={p.nome}>
                  <span className="pessoa-ini" aria-hidden="true">{p.nome.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
                  <h3>{p.nome}</h3>
                  <p className="pessoa-area">{p.org} · {p.area}</p>
                  <p>{p.p}</p>
                </article>
              ))}
            </div>

            <div className="time7-faixa rv">
              <div>
                <h3>Competências que tradicionalmente aparecem separadas, reunidas para o mesmo desafio.</h3>
                <p>Marketing, criação, mídia, CRM, automação, dados, pesquisa clínica, operação, qualidade, processos e relacionamento trabalhando com a mesma visão de jornada.</p>
              </div>
              <div>
                <h3>Brasil · América Latina · Projetos globais</h3>
                <p>A estratégia acompanha idioma, mercado, população, canais, operação e contexto regulatório de cada projeto.</p>
              </div>
            </div>

            <div className="equipe7 rv">
              <p className="equipe7-num"><b>Mais de 16 profissionais</b> de diferentes especialidades, unidos pela pesquisa clínica e pelo desafio de fazer seu projeto avançar.</p>
              <p className="equipe7-sub">Uma equipe multidisciplinar para transformar estratégia em comunicação, conteúdo, relacionamento, tecnologia e operação.</p>
              <ul className="equipe7-papeis">{PAPEIS.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* ============================= SOLUÇÕES ============================= */}
        <section className="secao bloco claro fundo-branco" id="solucoes">
          <div className="shell">
            <div className="cab rv">
              <p className="kicker kicker--linha">Conheça nossas soluções</p>
              <h2 className="h48">Uma operação diferente para cada <span className="ac">elo da pesquisa clínica.</span></h2>
              <p className="lead cab-lead">Indústrias farmacêuticas, patrocinadores, CROs, centros de pesquisa, vendors, fornecedores, associações e prestadores encontram soluções de marketing, comunicação, recrutamento, relacionamento, dados e tecnologia desenhadas para desafios diferentes, mas integradas pela mesma visão de pesquisa clínica.</p>
            </div>

            <div className="sol-abas rv" role="tablist" aria-label="Soluções por tipo de organização">
              {SOLUCOES.map((x, i) => (
                <button key={x.id} ref={(el) => (abasRef.current[i] = el)} type="button" role="tab" id={'sol-aba-' + x.id}
                  aria-selected={solucao === i} aria-controls="sol-painel" tabIndex={solucao === i ? 0 : -1}
                  className="sol-aba" onClick={() => setSolucao(i)} onKeyDown={(e) => tecladoAbas(e, i)}>
                  {x.aba}
                </button>
              ))}
            </div>

            <div className="sol-painel" id="sol-painel" role="tabpanel" aria-labelledby={'sol-aba-' + s.id} key={s.id}>
              <div className="sol-cab">
                <p className="kicker">{s.label}</p>
                <h3 className="h36">{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
              <div className="sol-grade">
                {s.cards.map(([t, p], i) => (
                  <article className="sol-card" key={t} style={{ '--i': i }}>
                    <span className="sol-n">{String(i + 1).padStart(2, '0')}</span>
                    <h4>{t}</h4>
                    <p>{p}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="sol-fecho rv">
              <p>Em vez de coordenar peças isoladas entre agências, vendors e assessorias, reúna estratégia, criação, recruitment, CRM, dados e tecnologia em uma equipe que já vive a pesquisa clínica. <b>Menos tradução entre fornecedores. Mais colaboração, aprendizado acumulado e visão de ponta a ponta.</b></p>
              <a className="btn btn--primario" href="#contato">Traga seu desafio para a Random ↗</a>
            </div>
          </div>
        </section>

        {/* ============================= CONTATO ============================= */}
        <section className="secao bloco escuro fundo-escuro contato" id="contato">
          <div className="shell">
            <div className="contato7">
              <div className="rv contato7-texto">
                <p className="kicker kicker--linha">Compartilhe seu projeto</p>
                <h2 className="h48">Ideias em movimento. <span className="ac">Projetos em prática.</span></h2>
                <p className="lead">A Random é um espaço aberto para criar, testar, compartilhar e evoluir o marketing em pesquisa clínica, aproximando projetos, pessoas, experiências e conhecimentos de diferentes áreas.</p>
                <p>Se você quer orçar um projeto, entender melhor como trabalhamos ou explorar possibilidades para recrutamento, marca, comunicação, relacionamento, dados e tecnologia, este é o ponto de partida.</p>
                <p>Também é possível acompanhar estudos de caso, novidades, testes, aprendizados e debates na newsletter, no Randomcast, no grupo de WhatsApp e no fórum.</p>
              </div>

              <div className="form-caixa form7 rv">
                <h3>Conecte-se com a Random</h3>
                <p className="form7-sub">Conte quem você é, de onde vem e o que procura. A partir disso, direcionamos melhor a conversa.</p>
                <form name="contato-pesquisa-clinica" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={aoEnviar}>
                  <input type="hidden" name="form-name" value="contato-pesquisa-clinica" />
                  <p hidden><label>Não preencha: <input name="bot-field" /></label></p>

                  <div className="campos">
                    <div className="campo campo--largo"><label htmlFor="f-nome">Nome*</label><input id="f-nome" name="nome" type="text" autoComplete="name" required placeholder="Seu nome completo" /></div>
                    <div className="campo"><label htmlFor="f-email">E-mail profissional*</label><input id="f-email" name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com" /></div>
                    <div className="campo"><label htmlFor="f-whats">WhatsApp</label><input id="f-whats" name="whatsapp" type="tel" autoComplete="tel" placeholder="(11) 90000-0000" /></div>
                    <div className="campo"><label htmlFor="f-cargo">Cargo / função</label><input id="f-cargo" name="cargo" type="text" autoComplete="organization-title" placeholder="Seu cargo" /></div>
                    <div className="campo"><label htmlFor="f-org">Empresa / organização*</label><input id="f-org" name="organizacao" type="text" autoComplete="organization" required placeholder="Nome da organização" /></div>
                    <div className="campo campo--largo">
                      <label htmlFor="f-tipo">Tipo de organização*</label>
                      <select id="f-tipo" name="tipo_organizacao" required defaultValue="">
                        <option value="" disabled>Selecione</option>
                        {TIPOS_ORG.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>

                    <fieldset className="campo campo--largo escolhas">
                      <legend>O que você procura?* <span>Pode selecionar mais de uma opção.</span></legend>
                      <div className="escolhas-lista">
                        {PROCURA.map((p) => (
                          <label className={'escolha' + (procura.includes(p) ? ' marcada' : '')} key={p}>
                            <input type="checkbox" name="procura" value={p} checked={procura.includes(p)} onChange={() => alternaProcura(p)} />
                            <span>{p}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="campo campo--largo"><label htmlFor="f-contexto">Conte brevemente seu contexto, objetivo ou desafio</label><textarea id="f-contexto" name="contexto" placeholder="Protocolo, área terapêutica, regiões, momento do projeto…"></textarea></div>

                    <fieldset className="campo campo--largo escolhas">
                      <legend>Quero participar também:</legend>
                      <div className="escolhas-lista">
                        {PARTICIPAR.map((p) => (
                          <label className="escolha escolha--livre" key={p}>
                            <input type="checkbox" name="participar" value={p} />
                            <span>{p}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  <p className="form7-lgpd">Ao enviar, você concorda com o uso dos dados para responder a esta solicitação. Preferências de conteúdo e comunidade são opcionais e independentes.</p>

                  <div className="form-acoes">
                    <button className="btn btn--primario" type="submit">Conecte-se com a Random ↗</button>
                    {avisoProcura && <p className="form7-aviso" role="alert">{avisoProcura}</p>}
                    <FormStatus status={statusContato} />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= CONTEÚDO ============================= */}
        <section className="secao bloco claro fundo-cinza" id="conteudo">
          <div className="shell">
            <div className="cab rv">
              <p className="kicker kicker--linha">Estudos, análises e benchmarking</p>
              <h2 className="h48">Produção de conhecimento também faz parte <span className="ac">da entrega.</span></h2>
              <p className="lead cab-lead">Projetos geram dados. Dados geram perguntas. Perguntas viram análises, debates e aprendizados que podem voltar melhores para o próximo projeto.</p>
            </div>

            <div className="estudos7 esc">
              {ESTUDOS.map((e) => (
                <article className="estudo7" key={e.t}>
                  <p className="estudo7-tipo">{e.tipo}<span>{e.meta}</span></p>
                  <h3>{e.t}</h3>
                  <p>{e.p}</p>
                  <div className="estudo7-links">
                    {e.analise && <a href={e.analise}>Ler análise →</a>}
                    <a href={e.fonte[1]} target="_blank" rel="noopener">{e.fonte[0]} ↗</a>
                  </div>
                </article>
              ))}
            </div>

            <div className="canais7 rv">
              {CANAIS.map((c) => {
                const miolo = (<><h3>{c.t}</h3><p>{c.p}</p></>)
                return c.href
                  ? <a className="canal7" href={c.href} key={c.t}>{miolo}<span aria-hidden="true">↗</span></a>
                  : <div className="canal7" key={c.t}>{miolo}</div>
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ============================= RODAPÉ ============================= */}
      <footer className="rodape escuro">
        <div className="shell">
          <div className="rodape-grade rodape7">
            <div className="rodape-marca">
              <svg className="logo-pe" viewBox="0 0 347 74" role="img" aria-label="Random"><use href="#random-wordmark" /></svg>
              <p className="rodape7-tag">Clinical trials marketing</p>
              <p>Marketing, comunicação, recruitment, relacionamento, dados e tecnologia aplicados à pesquisa clínica.</p>
              <a className="btn btn--primario" href="#contato">Falar sobre um projeto ↗</a>
              <div className="sociais">
                <a className="social" href="https://www.linkedin.com/company/randompesquisa" aria-label="LinkedIn da Random" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.4 10.4V17M7.4 7.3v.1M11.4 17v-3.8c0-1.2.8-2.1 1.9-2.1s1.9.9 1.9 2.1V17" /></svg>
                </a>
                <a className="social" href="https://www.instagram.com/randompesquisa" aria-label="Instagram da Random" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>
                </a>
                {/* TODO(conteúdo): YouTube e WhatsApp da Random quando houver link. */}
              </div>
            </div>
            <div className="rodape-col">
              <p className="kicker">Navegação</p>
              <ul>{NAV.map(([h, t]) => <li key={h}><a href={h}>{t}</a></li>)}</ul>
            </div>
            <div className="rodape-col">
              <p className="kicker">Soluções</p>
              <ul>
                {SOLUCOES.map((x, i) => (
                  <li key={x.id}><a href="#solucoes" onClick={() => setSolucao(i)}>{x.id === 'eco' ? 'Ecossistema de saúde' : x.aba}</a></li>
                ))}
              </ul>
            </div>
            <div className="rodape-col">
              <p className="kicker">Conteúdo & comunidade</p>
              <ul>
                <li><a href="#conteudo">Estudos & análises</a></li>
                <li><a href="#conteudo">Randomcast</a></li>
                <li><a href="#contato">Newsletter</a></li>
                <li><a href="#conteudo">Fórum</a></li>
                <li><a href="#conteudo">Grupo de WhatsApp</a></li>
                {/* TODO(dev): criar /politica-de-privacidade (mesma pendência da home). */}
                <li><a href="/politica-de-privacidade">Política de Privacidade</a></li>
                <li><a href="https://emcomjunto.com.br">Emcomjunto ↗</a></li>
              </ul>
            </div>
          </div>
          <div className="rodape-base">
            <span>© 2026 Random Pesquisa Clínica. Conteúdo institucional e educacional.</span>
            <span>Uma operação Emcomjunto + Invicta</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
