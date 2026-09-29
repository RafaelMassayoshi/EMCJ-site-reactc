import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import Esteira from '../components/Esteira.jsx'
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
import '../styles/pages/a-emcomjunto.css'

const CAMADAS = [
  { n: '01', on: 1, titulo: 'Comunicação', txt: 'Criação, conteúdo, design, desenvolvimento de websites, audiovisual e branding. A base de tudo que a marca fala.', rot: 'O que isso mostrou', mostrou: 'Peça boa não resolve sozinha. Sem demanda entrando de forma organizada, a comunicação não vira conversa comercial.' },
  { n: '02', on: 2, titulo: 'Growth marketing', txt: 'Testes, dados, mídia, CRM, otimização e escala do que funciona. O aprendizado passou a orientar a decisão.', rot: 'O que isso mostrou', mostrou: 'Volume de lead não é volume de oportunidade. O resultado parava na passagem para o comercial, e o que acontecia depois voltava pouco como informação.' },
  { n: '03', on: 3, titulo: 'Rotinas comerciais', txt: 'Geração de demanda, prospecção ativa, funis, qualificação e agendamento de reuniões. Entramos na rotina de quem vende.', rot: 'O que isso mostrou', mostrou: 'Prospectar sem leitura de mercado, sem material e sem sistema custa caro e desgasta o time. A estrutura precisa existir antes de acelerar.' },
  { n: '04', on: 4, titulo: 'Assessoria Comercial Criativa', txt: 'As três camadas anteriores numa estrutura só, partindo da meta comercial. Marketing, tecnologia e vendas no mesmo time.', rot: 'Onde estamos hoje', mostrou: 'É daqui que a operação roda: estudamos o mercado, preparamos o terreno, geramos demanda, acompanhamos a qualificação e transformamos o que funciona em processo repetível.', hoje: true },
]

const PESSOAS = [
  { nome: 'Filipe Plaza', funcao: 'Sócio-fundador e gestor de projetos', ini: 'FP', socio: true },
  { nome: 'Ivens Zanetti', funcao: 'Sócio e gestor de projetos', ini: 'IZ', socio: true },
  { nome: 'Bruno Plaza', funcao: 'Sócio e designer', ini: 'BP', socio: true },
  { nome: 'Vinicius Buguas', funcao: 'Coordenador de conteúdo', ini: 'VB' },
  { nome: 'Thalys Melgaço', funcao: 'Coordenador de performance', ini: 'TM' },
  { nome: 'Rafael Valentin', funcao: 'Coordenador de audiovisual', ini: 'RV' },
  { nome: 'Paula Zanetti', funcao: 'Coordenadora SDR', ini: 'PZ' },
  { nome: 'Lais Souza', funcao: 'Coordenadora SDR', ini: 'LS' },
  { nome: 'Rafael Eda', funcao: 'Desenvolvedor', ini: 'RE' },
  { nome: 'Sheila Silva', funcao: 'Designer', ini: 'SS' },
  { nome: 'Juliana Ribeiro', funcao: 'Designer', ini: 'JR' },
  { nome: 'Guilherme Bazani', funcao: 'Assistente de performance', ini: 'GB' },
  { nome: 'Julia Pezotti', funcao: 'Assistente de audiovisual', ini: 'JP' },
  { nome: 'Jéssica Bazani', funcao: 'Assistente de social media', ini: 'JB' },
]

const REGRAS = [
  { id: 'd1', n: '01', t: 'Entender antes de acelerar', d: 'Primeiro o mapa do terreno, depois o arranque. Acelerar sobre leitura errada só faz o erro chegar mais rápido.' },
  { id: 'd2', n: '02', t: 'Testar antes de escalar', d: 'Várias hipóteses pequenas rodando ao mesmo tempo. Só ganha investimento a que provou em campo.' },
  { id: 'd3', n: '03', t: 'Estratégia antes da peça', d: 'Do mesmo diagnóstico saem entregas diferentes. Não existe lista fixa de peças esperando cliente.' },
  { id: 'd4', n: '04', t: 'Resultado agora, capacidade depois', d: 'A curva sobe durante o trabalho. A base que sustenta a curva fica com você depois dele.' },
]

export default function AEmcomjunto() {
  useDocumentMeta({
    title: 'A Emcomjunto — Assessoria Comercial Criativa',
    description: 'Quem é a Emcomjunto: a tese da assessoria comercial criativa, as quatro camadas da jornada, os princípios de trabalho, o time e a Random Pesquisa.',
    canonical: 'https://emcomjunto.com.br/a-emcomjunto',
  })
  useReveal()
  useVertentesPronto()
  useCartaoBlob()

  const [regraAtiva, setRegraAtiva] = useState(0)
  const regrasRef = useRef([])
  const { status, handleSubmit } = useFormWebhook()

  function aoTecladoRegra(e, i) {
    let n = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % REGRAS.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + REGRAS.length) % REGRAS.length
    if (n !== null) {
      e.preventDefault()
      regrasRef.current[n]?.focus()
      setRegraAtiva(n)
    }
  }

  return (
    <MainLayout pageClassName="pagina-a-emcomjunto" headerProps={{ currentLink: 'a-emcomjunto', ctaHref: '#contato', ctaLabel: 'Diagnóstico' }} footerProps={{}}>
      {/* ============================= HERO ============================= */}
      <section className="hero hero-quem-somos secao" id="topo">
        <div className="hero-brilho" id="heroBrilho" aria-hidden="true"></div>
        <div className="hero-scrim" aria-hidden="true"></div>

        <div className="vertentes" id="vertentes" aria-hidden="true">
          <svg className="venn" viewBox="0 0 600 552" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="brilhoCentro">
                <stop offset="0%" stopColor="#41AFFF" stopOpacity=".34" />
                <stop offset="60%" stopColor="#41AFFF" stopOpacity=".10" />
                <stop offset="100%" stopColor="#41AFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle className="halo-centro" cx="300" cy="276" r="132" />
            <g className="conjunto c-mkt"><circle cx="300" cy="188" r="150" pathLength="1000" /></g>
            <g className="conjunto c-tec"><circle cx="376" cy="320" r="150" pathLength="1000" /></g>
            <g className="conjunto c-vnd"><circle cx="224" cy="320" r="150" pathLength="1000" /></g>
            <text className="t-mkt" x="300" y="105">MARKETING</text>
            <text className="t-tec" x="430" y="412">TECNOLOGIA</text>
            <text className="t-vnd" x="170" y="412">VENDAS</text>
          </svg>
          <div className="marca-nucleo"><svg viewBox="0 0 150 121"><use href="#emcj-logo" /></svg></div>
        </div>

        <div className="shell hero-conteudo">
          <div className="filete rv"></div>
          <p className="kicker rv">A Emcomjunto</p>
          <h1 className="d64 rv">Criatividade para <span className="ac ac90">abrir caminhos.</span> Processo para transformar oportunidades em negócios.</h1>
          <p className="hero-lead rv">Marketing, tecnologia e vendas no mesmo time, com os mesmos objetivos. Não chegamos aqui de uma vez: cada camada da nossa jornada foi somada a partir do aprendizado da anterior, que mostrava onde o resultado parava. Mais de dez anos depois, essas camadas viraram uma estrutura só.</p>
        </div>
      </section>

      {/* ============================= ≡ · DEFINIÇÃO ============================= */}
      <section className="secao bloco claro fundo-branco" id="definicao">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">≡</span><span className="regua"></span><span className="kicker">Definição</span>
          </div>

          <div className="definicao-grade">
            <div className="rv">
              <h2 className="d56"><span className="ac ac74">Em<span className="silaba" aria-hidden="true">·</span>com<span className="silaba" aria-hidden="true">·</span>junto:</span> uma assessoria comercial criativa.</h2>
              <div className="paragrafos" style={{ marginTop: 'var(--esp-6)' }}>
                <p className="lead">Entre o interesse e a venda existe um espaço onde muita oportunidade se perde. O marketing concentra energia em marca, conteúdo e campanhas, medido por alcance e volume de leads. O comercial foca nas carteiras que já garantem faturamento, e o que chega de fora entra na fila sem voltar como informação. A tensão é estrutural, não é culpa de ninguém.</p>
                <p className="lead">A Emcomjunto atua nesse intervalo. Somos a estrutura que assume a visão integrada entre marketing, tecnologia e vendas: a mesma operação que estuda o mercado cria a mensagem, gera demanda, acompanha a qualificação e transforma aprendizado em material, processo e ferramenta.</p>
                <p className="lead">São mais de dez anos de mercado, dentro de universos muito diferentes entre si: varejo e seus fornecedores, indústria, tecnologia, distribuição, energia e meio ambiente, saúde e pesquisa clínica. Cada segmento tem seu decisor, seu argumento e seu tempo de decisão, e é essa variedade que ensinou a montar estratégia por operação em vez de repetir receita.</p>
                <p className="lead">Em vez de contratar tráfego, SDR, produtora, CRM e desenvolvimento separados, cada um enxergando um pedaço da jornada, você contrata quem conecta tudo isso ao objetivo comercial. Não substituímos todo especialista do mercado: trabalhamos junto com times internos, agências e produtoras sempre que faz sentido.</p>
              </div>
            </div>

            <div className="verbete rv">
              <p className="termo">Assessoria Comercial Criativa</p>
              <p className="classe">substantivo feminino · o modelo que a Emcomjunto opera</p>
              <ol>
                <li>Estrutura que assume a visão integrada entre marketing, tecnologia e vendas, com os mesmos objetivos.</li>
                <li>Trabalho que parte da meta comercial, e não do briefing de comunicação.</li>
                <li>Operação que atua no intervalo entre o interesse e a venda, onde a oportunidade costuma se perder.</li>
                <li>Criatividade entendida como encontrar caminhos, não apenas criar uma peça bonita.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= Δ · JORNADA ============================= */}
      <section className="secao bloco escuro fundo-escuro" id="jornada">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">Δ</span><span className="regua"></span><span className="kicker">Jornada</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Cada camada foi somada porque a anterior mostrou <span className="ac ac74">onde o resultado parava.</span></h2>
            <p className="lead apoio">Não partimos de uma tese. Partimos do que a operação mostrou, ano após ano, dentro de mercados diferentes.</p>
          </div>

          <ol className="camadas esc">
            {CAMADAS.map((c) => (
              <li className={'camada' + (c.hoje ? ' camada--hoje' : '')} key={c.n}>
                <div>
                  <span className="camada-n">{c.n}</span>
                  <div className="pilha" aria-hidden="true">
                    {[1, 2, 3, 4].map((k) => (
                      <i key={k} className={k <= c.on ? 'on' : ''}></i>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>{c.titulo}</h3>
                  <p className="txt">{c.txt}</p>
                  <p className="mostrou"><span className="rot">{c.rot}</span>{c.mostrou}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================= ∪ · TIME ============================= */}
      <section className="secao bloco claro fundo-branco" id="time">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∪</span><span className="regua"></span><span className="kicker">Time</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Quem conduz <span className="ac ac74">a operação.</span></h2>
            <p className="lead apoio">Um time próximo do cliente, com sócios dentro dos projetos e especialistas de conteúdo, performance, audiovisual, design, desenvolvimento e prospecção na mesma estrutura.</p>
          </div>

          <div className="pessoas esc">
            {PESSOAS.map((p) => (
              <article className={'pessoa' + (p.socio ? ' pessoa--socio' : '')} key={p.nome}>
                <div className="retrato"><span aria-hidden="true">{p.ini}</span></div>
                <div className="dados">
                  <h3>{p.nome}</h3>
                  <p className="funcao">{p.funcao}</p>
                  <p className="frase frase--vazia">Frase de definição a incluir.</p>
                </div>
              </article>
            ))}
            <article className="pessoa pessoa--vago">
              <div className="retrato"><span aria-hidden="true">—</span></div>
              <div className="dados">
                <h3><span className="pendente">Vaga reservada</span></h3>
                <p className="funcao">Nome e função a definir</p>
                <p className="frase frase--vazia">Frase de definição a incluir.</p>
              </div>
            </article>
            <article className="pessoa pessoa--vago">
              <div className="retrato"><span aria-hidden="true">—</span></div>
              <div className="dados">
                <h3><span className="pendente">Vaga reservada</span></h3>
                <p className="funcao">Nome e função a definir</p>
                <p className="frase frase--vazia">Frase de definição a incluir.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================= ∈ · ESCRITÓRIO ============================= */}
      <section className="secao bloco claro escritorio-background fundo-cinza" id="escritorio">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∈</span><span className="regua"></span><span className="kicker">Onde estamos</span>
          </div>

          <div className="escritorio">
            <div className="rv">
              <h2 className="d40">Escritório no ABC, <span className="ac ac53">porta aberta.</span></h2>
              <p className="explica lead">Nossa base fica na Muvita Coworking, em Santo André, dentro do edifício Jardim Park. É onde o time se encontra, onde as reuniões de diagnóstico acontecem e onde você é bem-vindo para conversar pessoalmente.</p>
              <p className="endereco">
                <b>Muvita Coworking · Edifício Jardim Park</b>
                Av. Industrial, 780 — Jardim<br />
                Santo André, SP
              </p>
            </div>

            <figure className="local rv">
              <iframe
                title="Mapa do escritório da Emcomjunto em Santo André"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Muvita+Coworking+Avenida+Industrial+780+Santo+Andre+SP&output=embed"
              ></iframe>
            </figure>
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
            <h2 className="d56">Operações que já passaram <span className="ac ac74">pela nossa estrutura.</span></h2>
            <p className="lead apoio">Indústria, varejo, tecnologia e saúde. Cada uma com um decisor, um argumento e um tempo de decisão diferentes.</p>
          </div>
        </div>

        <Esteira label="Empresas clientes" />

        <div className="shell">
          <div className="mercados esc">
            <a className="cartao cartao--mercado" href="/varejo" style={{ '--glow': '#1F88D6' }}>
              <span className="borrao deriva-3" aria-hidden="true"><i></i></span>
              <h3>Varejo</h3>
              <p className="txt">Empresas que vendem para o varejo: mercadorias, mobiliário e equipamentos, comunicação visual, estruturas de estoque e tecnologia para ponto de venda. O desafio não é achar quem se interessa, é entender qual solução serve a qual operação e quem participa da decisão.</p>
              <span className="card-link">Ver a frente de varejo <span className="seta">→</span></span>
            </a>

            <a className="cartao cartao--mercado" href="/b2b" style={{ '--glow': '#41AFFF' }}>
              <span className="borrao deriva-1" aria-hidden="true"><i></i></span>
              <h3>B2B</h3>
              <p className="txt">Indústria, tecnologia e SaaS, distribuição, energia e meio ambiente, eficiência operacional e riscos. Venda consultiva em que a mesma solução conversa com diretoria, engenharia, operações, TI e compras, cada área com uma preocupação.</p>
              <span className="card-link">Ver a frente de B2B <span className="seta">→</span></span>
            </a>

            <a className="cartao cartao--mercado" href="/pesquisa-clinica" style={{ '--glow': '#9BD4F4' }}>
              <span className="borrao deriva-4" aria-hidden="true"><i></i></span>
              <h3>Pesquisa clínica</h3>
              <p className="txt">Centros, patrocinadores e parceiros. Recrutamento, comunicação e estrutura comercial conduzidos pela Random Pesquisa, unidade dedicada da Emcomjunto, dentro das regras de CEP e CONEP, CFM, LGPD e das políticas de Meta e Google.</p>
              <span className="card-link">Ver a frente de pesquisa clínica <span className="seta">→</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================= ƒ · PRINCÍPIOS ============================= */}
      <section className="secao bloco claro fundo-branco" id="principios">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">ƒ</span><span className="regua"></span><span className="kicker">Princípios</span>
          </div>
          <div className="cab2 rv">
            <h2 className="d56">Entender antes de acelerar. <span className="ac ac74">Testar antes de escalar.</span></h2>
            <p className="lead apoio">Quatro regras que valem para qualquer cliente, em qualquer mercado. Escolha uma para ver como ela funciona na prática.</p>
          </div>

          <div className="regras rv">
            <div className="regra-lista" role="tablist" aria-label="Nossos princípios">
              {REGRAS.map((r, i) => (
                <button
                  key={r.id}
                  className="regra"
                  type="button"
                  role="tab"
                  ref={(el) => (regrasRef.current[i] = el)}
                  id={'r' + (i + 1)}
                  aria-controls={r.id}
                  aria-selected={regraAtiva === i}
                  data-desenho={r.id}
                  onClick={() => setRegraAtiva(i)}
                  onKeyDown={(e) => aoTecladoRegra(e, i)}
                >
                  <span className="n">{r.n}</span>
                  <span className="t">{r.t}</span>
                  <span className="d"><span>{r.d}</span></span>
                </button>
              ))}
            </div>

            <div className="regra-palco">
              <svg className={'desenho' + (regraAtiva === 0 ? ' on' : '')} id="d1" viewBox="0 0 420 344" role="tabpanel" aria-labelledby="r1" aria-label="Uma varredura percorre o terreno antes de a seta arrancar" hidden={regraAtiva !== 0}>
                <g className="ponto">
                  <circle cx="70" cy="96" r="3" /><circle cx="130" cy="72" r="3" /><circle cx="196" cy="104" r="3" />
                  <circle cx="258" cy="70" r="3" /><circle cx="322" cy="100" r="3" /><circle cx="102" cy="150" r="3" />
                  <circle cx="168" cy="156" r="3" /><circle cx="238" cy="146" r="3" /><circle cx="300" cy="158" r="3" />
                </g>
                <path className="fraco" d="M56 206 H364" />
                <path className="traco varre" d="M70 96 L130 72 L196 104 L258 70 L322 100" strokeDasharray="760" strokeDashoffset="760" />
                <g className="arranque">
                  <path className="traco" d="M60 262 H150" />
                  <path className="traco" d="M136 250 L152 262 L136 274" />
                </g>
                <text className="rot" x="56" y="192">TERRENO</text>
                <text className="rot" x="56" y="248">ARRANQUE</text>
              </svg>

              <svg className={'desenho' + (regraAtiva === 1 ? ' on' : '')} id="d2" viewBox="0 0 420 344" role="tabpanel" aria-labelledby="r2" aria-label="Quatro testes pequenos rodam juntos e um deles cresce" hidden={regraAtiva !== 1}>
                <path className="fraco" d="M56 268 H364" />
                <rect className="cheio barra t1" x="88" y="68" width="42" height="200" rx="6" />
                <rect className="cheio barra t2" x="158" y="68" width="42" height="200" rx="6" />
                <rect className="cheio barra t3" x="228" y="68" width="42" height="200" rx="6" />
                <rect className="cheio barra t4" x="298" y="68" width="42" height="200" rx="6" />
                <text className="rot" x="56" y="296">HIPÓTESE · TESTE · DADO · ESCALA</text>
              </svg>

              <svg className={'desenho' + (regraAtiva === 2 ? ' on' : '')} id="d3" viewBox="0 0 420 344" role="tabpanel" aria-labelledby="r3" aria-label="De um mesmo diagnóstico saem entregas de formatos diferentes" hidden={regraAtiva !== 2}>
                <path className="fraco raio" d="M210 172 L104 96" strokeDasharray="120" strokeDashoffset="120" />
                <path className="fraco raio r2" d="M210 172 L318 100" strokeDasharray="120" strokeDashoffset="120" />
                <path className="fraco raio r3" d="M210 172 L104 250" strokeDasharray="120" strokeDashoffset="120" />
                <path className="fraco raio r4" d="M210 172 L320 246" strokeDasharray="120" strokeDashoffset="120" />
                <circle className="cheio" cx="210" cy="172" r="13" />
                <circle className="cheio saida" cx="104" cy="96" r="15" />
                <rect className="cheio saida s2" x="302" y="84" width="32" height="32" rx="5" />
                <path className="terra saida s3" d="M104 234 L120 262 L88 262 Z" />
                <rect className="cheio saida s4" x="300" y="238" width="40" height="14" rx="7" />
              </svg>

              <svg className={'desenho' + (regraAtiva === 3 ? ' on' : '')} id="d4" viewBox="0 0 420 344" role="tabpanel" aria-labelledby="r4" aria-label="A curva de resultado sobe e a base de capacidade permanece" hidden={regraAtiva !== 3}>
                <path className="fraco" d="M64 252 H360" />
                <path className="traco curva" d="M64 236 C 130 232, 158 176, 208 152 C 258 128, 300 118, 360 78" strokeDasharray="460" strokeDashoffset="460" />
                <circle className="cheio" cx="360" cy="78" r="5" />
                <rect className="terra fica" x="64" y="272" width="296" height="16" rx="8" />
                <text className="rot" x="64" y="316">CAPACIDADE QUE FICA</text>
                <text className="rot" x="64" y="216">RESULTADO</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= ∴ · PRÓXIMO PASSO ============================= */}
      <section className="secao bloco claro fundo-cinza" id="proximo">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∴</span><span className="regua"></span><span className="kicker">Próximo passo</span>
          </div>

          <div className="proximo" id="contato">
            <div className="rv">
              <h2 className="d56">Vamos fazer um <span className="ac ac74">Diagnóstico Comercial e Criativo?</span></h2>
              <p className="explica lead">É por aqui que todo trabalho começa. A gente estuda seu mercado, olha a operação que já existe e devolve uma leitura inicial com os caminhos que fazem sentido testar primeiro.</p>

              <nav className="atalhos" aria-label="Outras páginas">
                <Link to="/o-que-fazemos"><span className="rot">O que fazemos<small>As sete frentes, do diagnóstico ao processo repetível.</small></span><span className="seta">→</span></Link>
                <Link to="/quem-assessoramos"><span className="rot">Quem assessoramos<small>Varejo, ESG e eficiência, pesquisa clínica e outros mercados B2B.</small></span><span className="seta">→</span></Link>
                <a href="/cases"><span className="rot">Cases<small>Operações com número, fonte e período.</small></span><span className="seta">→</span></a>
                <a href="/como-contratar"><span className="rot">Como contratar<small>Formatos de engajamento e o que define o escopo.</small></span><span className="seta">→</span></a>
              </nav>
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
