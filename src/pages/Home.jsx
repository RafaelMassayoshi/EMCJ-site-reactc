import { useRef } from 'react'
import MainLayout from '../layouts/MainLayout.jsx'
import CountUp from '../components/CountUp.jsx'
import Esteira from '../components/Esteira.jsx'
import HeroFluxo from '../components/HeroFluxo.jsx'
import BarraClientes from '../components/BarraClientes.jsx'
import SecaoPublico from '../components/SecaoPublico.jsx'
import SecaoCaminhos from '../components/SecaoCaminhos.jsx'
import SecaoPilares from '../components/SecaoPilares.jsx'
import SecaoDoisLados from '../components/SecaoDoisLados.jsx'
import MercadoArte, { MercadoNumeros } from '../components/MercadoArte.jsx'
import UltimasNoticias from '../components/UltimasNoticias.jsx'
import PontosFaixa from '../components/PontosFaixa.jsx'
import useMedia from '../hooks/useMedia.js'
import SecaoNewsletter from '../components/SecaoNewsletter.jsx'
import FormStatus from '../components/FormStatus.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import useReveal from '../hooks/useReveal.js'
import useCartaoBlob from '../hooks/useCartaoBlob.js'
import useFormWebhook from '../hooks/useFormWebhook.js'

import '../styles/components/buttons.css'
import '../styles/components/nav.css'
import '../styles/components/hero.css'
import '../styles/components/cards.css'
import '../styles/components/esteira.css'
import '../styles/components/trilho.css'
import '../styles/components/forms.css'
import '../styles/components/footer.css'
import '../styles/pages/home.css'

/* Números dos cartões de mercado (seção ∩ · Encaixe).
   Varejo e pesquisa clínica: mesmos números da página O que fazemos (CASES).
   ESG: números da operação em tratamento de efluentes, informados pela EMCJ. */
const NUMEROS_MERCADO = {
  varejo: {
    itens: [
      { valor: '+4.500', rotulo: 'leads captados' },
      { valor: '< R$35', rotulo: 'custo por lead' },
      { valor: '33%', rotulo: 'qualificados', pct: 33 },
      { valor: '8%', rotulo: 'conversão nas páginas', pct: 8 },
    ],
  },
  esg: {
    itens: [
      { valor: '+5 anos', rotulo: 'de operação contínua' },
      { valor: 'R$20', rotulo: 'custo por lead' },
      { valor: '+100', rotulo: 'leads todo mês' },
      { valor: '40%', rotulo: 'qualificados', pct: 40 },
    ],
  },
  pesquisa: {
    itens: [
      { valor: '+140', rotulo: 'estudos clínicos' },
      { valor: '+25', rotulo: 'centros assessorados' },
      { valor: '+1.500', rotulo: 'voluntários selecionados' },
      { valor: '+8', rotulo: 'estados' },
    ],
  },
}

const NEWSLETTERS = ['Vendas & Marketing', 'B2B', 'ESG & Energia', 'Indústria', 'Varejo', 'SaaS & Tech', 'Saúde & Pesquisa Clínica']

// Máscara simples de CNPJ enquanto digita: 00.000.000/0000-00
function mascaraCnpj(e) {
  const d = e.target.value.replace(/\D/g, '').slice(0, 14)
  let v = d
  if (d.length > 12) v = d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
  else if (d.length > 8) v = d.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4')
  else if (d.length > 5) v = d.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3')
  else if (d.length > 2) v = d.replace(/(\d{2})(\d{0,3})/, '$1.$2')
  e.target.value = v
}

// Seção Σ · Combinação: oculta por enquanto (ver comentário na seção).
const MOSTRAR_COMBINACAO = false

export default function Home() {
  const celular = useMedia('(max-width: 900px)')
  const mercadosRef = useRef(null)
  useDocumentMeta({
    title: 'Emcomjunto — Assessoria Comercial Criativa',
    description: 'Onde demanda e oferta se cruzam. Marketing, tecnologia e vendas dentro do mesmo plano comercial.',
    canonical: 'https://emcomjunto.com.br/',
  })
  useReveal()
  useCartaoBlob()

  const { status, handleSubmit } = useFormWebhook()

  return (
    <MainLayout
      pageClassName="pagina-home"
      headerProps={{ ctaHref: '#contato', ctaLabel: 'Diagnóstico' }}
      footerProps={{
        semNewsletter: true,
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

        <HeroFluxo />

        <div className="shell hero-conteudo">
          <p className="hero-tag rv"><span>Mais demanda, mais vendas, <b>menos dispersão</b></span></p>
          <div className="filete rv"></div>
          <h1 className="d64 rv">Uma representação comercial que <span className="ac ac90">vende e assessora</span> você em seus processos</h1>
          <p className="hero-lead rv">A Emcomjunto atua como uma extensão do seu time para gerar demanda, qualificar oportunidades e acelerar vendas. Mergulhamos em mercados especializados e desenhamos a estratégia sob medida para cada um.</p>
          <div className="hero-acoes rv">
            <a className="btn btn--primario" href="#contato">Quero vender mais</a>
            <a className="btn btn--texto" href="/o-que-fazemos">Conheça nossas soluções <span className="seta">→</span></a>
          </div>
        </div>
      </section>

      {/* ======================= BARRA DE CLIENTES E NÚMEROS ======================= */}
      <BarraClientes />

      {/* ============================= U · MERCADO ============================= */}
      <SecaoPublico />

      {/* ============================= ⊕ · CAMINHOS ============================= */}
      <SecaoCaminhos />

      {/* ============================= Π · PILARES DA METODOLOGIA ============================= */}
      <SecaoPilares />

      {/* ============================= Σ · COMBINAÇÃO =============================
          Oculta por decisão de conteúdo (redundante com Pilares/Recorte). Para
          voltar a exibir, troque MOSTRAR_COMBINACAO para true no topo do arquivo. */}
      {MOSTRAR_COMBINACAO && (
      <section className="secao bloco escuro fundo-escuro">
        <div className="shell combinacao">
          <div className="simbolo-linha rv">
            <span className="simbolo">Σ</span><span className="regua"></span><span className="kicker">Combinação</span>
          </div>
          <h2 className="d56 rv">Nosso diferencial está na <span className="ac ac74">combinação.</span></h2>
          <p className="explica rv">A Emcomjunto conecta estratégia, personalização, canais, tecnologia e gestão em uma operação única, que aprende com o mercado e evolui continuamente.</p>

          <div className="combo-metrica rv">
            <CountUp className="valor" alvo={800} prefixo="+" />
            <span className="rotulo">oportunidades de negócios qualificadas todos os meses para nossos clientes</span>
            <span className="nota">Volume médio da operação em B2B, vendas consultivas, segmentos técnicos e pesquisa clínica.</span>
          </div>
        </div>
      </section>
      )}

      {/* ============================= ⊂ · RECORTE: DOIS LADOS ============================= */}
      <SecaoDoisLados />

      {/* ============================= ∪ · PARCEIROS ============================= */}
      <section className="secao bloco claro fundo-branco">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">∪</span><span className="regua"></span><span className="kicker">Parceiros</span>
          </div>
          <div className="parceiros-cab rv">
            <h2 className="d56">Empresas que já caminharam <span className="ac ac74">com a gente.</span></h2>
            <p className="lead">Operações de indústria, varejo, tecnologia e saúde que passaram pela nossa estrutura comercial.</p>
          </div>
        </div>

        <Esteira label="Empresas parceiras" />
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

          <div className="mercados esc" ref={mercadosRef}>
            <a className="cartao cartao--mercado" href="/varejo" style={{ '--glow': '#1F88D6' }}>
              <span className="borrao deriva-3" aria-hidden="true"><i></i></span>
              <MercadoArte tipo="varejo" />
              <h3>Varejo</h3>
              <p className="txt">Empresas que vendem para o varejo: mercadorias, mobiliário e equipamentos, comunicação visual, estruturas de estoque e tecnologia para ponto de venda.</p>
              <MercadoNumeros {...NUMEROS_MERCADO.varejo} />
              <span className="card-link">Ver o mercado de varejo <span className="seta">→</span></span>
            </a>

            <a className="cartao cartao--mercado" href="/esg-eficiencia-riscos" style={{ '--glow': '#B55D49' }}>
              <span className="borrao deriva-1" aria-hidden="true"><i></i></span>
              <MercadoArte tipo="esg" />
              <h3>ESG, eficiência e riscos</h3>
              <p className="txt">Energia, tratamento de água e efluentes, segurança do trabalho, qualidade e tecnologia para gestão de riscos. Venda consultiva, muitos decisores.</p>
              <MercadoNumeros {...NUMEROS_MERCADO.esg} />
              <span className="card-link">Ver o mercado técnico <span className="seta">→</span></span>
            </a>

            <a className="cartao cartao--mercado" href="/pesquisa-clinica" style={{ '--glow': '#9BD4F4' }}>
              <span className="borrao deriva-5" aria-hidden="true"><i></i></span>
              <MercadoArte tipo="pesquisa" />
              <h3>Pesquisa clínica</h3>
              <p className="txt">Centros, patrocinadores e parceiros. Comunicação, geração de demanda e recrutamento, com unidade dedicada, a Random Pesquisa.</p>
              <MercadoNumeros {...NUMEROS_MERCADO.pesquisa} />
              <span className="card-link">Ver pesquisa clínica <span className="seta">→</span></span>
            </a>
          </div>

          {celular && <PontosFaixa alvo={mercadosRef} total={3} rotulo="Mercados" />}

          <div className="mercados-acoes rv">
            <a className="btn btn--contorno" href="/o-que-fazemos#cases">Ver todos os cases <span className="seta">→</span></a>
          </div>
        </div>
      </section>

      {/* ============================= → · CONTATO ============================= */}
      <section className="secao bloco claro fundo-cinza" id="contato">
        <div className="shell">
          <div className="simbolo-linha rv">
            <span className="simbolo">→</span><span className="regua"></span><span className="kicker">Primeiro passo</span>
          </div>

          <div className="decisao contato">
            <div className="contato-texto rv">
              <h2 className="d40">O que vamos vender? Para quem? <span className="ac ac53">Pronto para dar o primeiro passo pra escalarmos?</span></h2>
              <p className="contato-chamada">Conte pra gente os detalhes do seu projeto.</p>
              <p className="lead">A Emcomjunto entra para entender seu negócio, seus clientes e o mercado que queremos conquistar. Fazemos a imersão, diagnosticamos o cenário, levantamos hipóteses e colocamos os melhores caminhos em teste.</p>
              <p className="lead">Vamos ao mercado juntos para aprender mais rápido, gerar oportunidades e transformar os aprendizados em vendas e evolução para a sua operação.</p>
            </div>

            <div className="formulario rv">
              <h3>Preencha o formulário e vamos vender juntos.</h3>

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
                    <label htmlFor="f-cnpj">CNPJ</label>
                    <input id="f-cnpj" name="cnpj" type="text" inputMode="numeric" autoComplete="off" placeholder="00.000.000/0000-00" maxLength={18} onChange={mascaraCnpj} />
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
                    <label htmlFor="f-equipe">Tamanho da equipe comercial</label>
                    <select id="f-equipe" name="equipe_comercial" defaultValue="">
                      <option value="">Selecione</option>
                      <option>Ainda não temos equipe</option>
                      <option>1 a 3 pessoas</option>
                      <option>4 a 10 pessoas</option>
                      <option>11 a 30 pessoas</option>
                      <option>Mais de 30 pessoas</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label htmlFor="f-fat">Faixa de faturamento anual</label>
                    <select id="f-fat" name="faturamento" defaultValue="">
                      <option value="">Selecione</option>
                      <option>Até R$ 4,8 milhões</option>
                      <option>De R$ 4,8 a 20 milhões</option>
                      <option>De R$ 20 a 100 milhões</option>
                      <option>De R$ 100 a 300 milhões</option>
                      <option>Acima de R$ 300 milhões</option>
                      <option>Prefiro não informar</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label htmlFor="f-midia">Orçamento de mídia mensal</label>
                    <select id="f-midia" name="orcamento_midia" defaultValue="">
                      <option value="">Selecione</option>
                      <option>Ainda não investimos em mídia</option>
                      <option>Até R$ 5 mil</option>
                      <option>De R$ 5 a 20 mil</option>
                      <option>De R$ 20 a 50 mil</option>
                      <option>Acima de R$ 50 mil</option>
                    </select>
                  </div>
                  <div className="campo">
                    <label htmlFor="f-volume">Vendas ou leads por mês</label>
                    <select id="f-volume" name="volume_mensal" defaultValue="">
                      <option value="">Selecione</option>
                      <option>Até 20</option>
                      <option>De 21 a 100</option>
                      <option>De 101 a 500</option>
                      <option>Acima de 500</option>
                      <option>Não sei informar</option>
                    </select>
                  </div>
                  <div className="campo campo--largo">
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
                  <fieldset className="campo campo--largo campo-news">
                    <legend>Quer receber algumas das nossas newsletters?</legend>
                    <div className="news-opcoes">
                      {NEWSLETTERS.map((n) => (
                        <label className="news-opcao" key={n}>
                          <input type="checkbox" name="newsletters" value={n} />
                          <span>{n}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
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

      {/* ============================= NEWS · NEWSLETTER ============================= */}
      <SecaoNewsletter />

      {/* ============================= ÚLTIMAS NOTÍCIAS ============================= */}
      <UltimasNoticias />
    </MainLayout>
  )
}
