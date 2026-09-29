import Trilho from './Trilho.jsx'
import Entregas from './Entregas.jsx'

/* ==========================================================================
   Seção Π · Metodologia da home: "Os pilares da nossa metodologia".
   Mesma lógica de "Como funciona a nossa operação" (O que fazemos):
   lista à esquerda, painel à direita, usando o componente Trilho.
   Estilos: styles/components/trilho.css + home.css (prefixo .pilar-).
   ========================================================================== */

function Etiquetas({ itens }) {
  return (
    <ul className="pilar-tags">
      {itens.map((t) => <li key={t}>{t}</li>)}
    </ul>
  )
}

const CANAIS = [
  { grupo: 'Performance', itens: ['Google', 'Meta', 'LinkedIn'] },
  { grupo: 'Prospecção ativa', itens: ['Social selling', 'Outbound', 'SDR', 'E-mails comerciais'] },
  { grupo: 'Relacionamento', itens: ['Newsletters', 'Mailing', 'WhatsApp', 'Ligações'] },
  { grupo: 'Conteúdo', itens: ['Editorial', 'Jornalístico', 'Hiperpersonalizado', 'Audiovisual'] },
  { grupo: 'Eventos', itens: ['Networking', 'Apresentações', 'Materiais impressos', 'Lives e webinars'] },
]

/* Ciclo do pilar 01: as etapas acendem em sequência e o ciclo recomeça. */
const CICLO = ['Imersão + diagnóstico', 'Hipóteses', 'Testes', 'Dados', 'Aprendizados', 'Evolução']

const PILARES = [
  {
    id: 'p-aprendizado',
    titulo: 'Aprendizado contínuo',
    conteudo: (
      <>
        <p className="pilar-rotulo">Aprendizado contínuo</p>
        <h3>Testar. Medir. Aprender. Evoluir.</h3>
        <div className="pilar-ciclo">
          <ol>
            {CICLO.map((etapa, i) => (
              <li key={etapa} style={{ '--i': i }}>
                <span className="pilar-ciclo-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="pilar-ciclo-t">{etapa}</span>
              </li>
            ))}
          </ol>
          <p className="pilar-ciclo-volta">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Volta para novas hipóteses
          </p>
        </div>
        <p className="via-por">Cada ação gera dados e aprendizados que orientam o próximo ciclo. Assim, estratégia, comunicação e processo comercial evoluem continuamente.</p>
      </>
    ),
  },
  {
    id: 'p-personalizacao',
    titulo: 'Personalização de verdade',
    conteudo: (
      <>
        <p className="pilar-rotulo">Personalização de verdade</p>
        <h3>Entender antes de abordar.</h3>
        <p className="via-txt">Estudamos seu negócio, seu mercado e principalmente o mercado dos seus clientes para construir estratégias, abordagens e conteúdos altamente personalizados.</p>
        <Etiquetas itens={['ICP', 'Decisores', 'Jornadas', 'Argumentos', 'Abordagens', 'Conteúdos']} />
      </>
    ),
  },
  {
    id: 'p-multicanal',
    titulo: 'Multicanal',
    conteudo: (
      <>
        <p className="pilar-rotulo">Multicanal</p>
        <h3>O melhor canal é onde a oportunidade está.</h3>
        <dl className="pilar-canais">
          {CANAIS.map((c) => (
            <div key={c.grupo}>
              <dt>{c.grupo}</dt>
              <dd>{c.itens.join(' · ')}</dd>
            </div>
          ))}
        </dl>
        <p className="via-por">Online e offline trabalham juntos. Escolhemos e combinamos os canais de acordo com o mercado, o público e o objetivo comercial.</p>
      </>
    ),
  },
  {
    id: 'p-tecnologia',
    titulo: 'Tecnologia sob medida',
    conteudo: (
      <>
        <p className="pilar-rotulo">Tecnologia sob medida</p>
        <h3>Quando a ferramenta não existe, construímos o caminho.</h3>
        <p className="via-txt">Criamos e integramos soluções para capturar oportunidades, automatizar processos e transformar dados em decisões comerciais.</p>
        <Etiquetas itens={['Landing pages', 'Formulários', 'Automações', 'Fluxos', 'Integrações', 'CRM', 'IA', 'Dashboards', 'Análise de dados']} />
      </>
    ),
  },
  {
    id: 'p-gestao',
    titulo: 'Gestão integrada do projeto',
    conteudo: (
      <>
        <p className="pilar-rotulo">Gestão integrada do projeto</p>
        <h3>Especialistas diferentes. Uma direção só.</h3>
        <p className="via-txt">A Emcomjunto coordena toda a operação para conectar times internos, agências, produtoras, fornecedores e parceiros em torno dos mesmos objetivos comerciais.</p>
        <p className="via-por">O diferencial não está em substituir todos os especialistas, mas em assumir com um time sênior a visão integrada do projeto, conectar as diferentes frentes, identificar gargalos e garantir que comunicação, tecnologia e comercial avancem na mesma direção.</p>
      </>
    ),
  },
]

export default function SecaoPilares() {
  return (
    <section className="secao bloco claro fundo-branco" id="pilares">
      <div className="shell">
        <div className="simbolo-linha rv">
          <span className="simbolo">Π</span><span className="regua"></span><span className="kicker">Metodologia</span>
        </div>
        <div className="cab2 rv">
          <h2 className="d56">Os pilares da <span className="ac ac74">nossa metodologia.</span></h2>
          <div className="pilar-intro">
            <p className="lead apoio"><b>Não seguimos uma fórmula pronta.</b> Encontramos o melhor caminho para vender e construir sua máquina de vendas escalável e com previsibilidade.</p>
          </div>
        </div>

        <Trilho id="trilho-pilares" ariaLabel="Os pilares da metodologia" items={PILARES} />

        <Entregas />
      </div>
    </section>
  )
}
