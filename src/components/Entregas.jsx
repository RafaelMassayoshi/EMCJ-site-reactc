import { useRef, useState } from 'react'

/* ==========================================================================
   "Entregas" — fecha a seção Π · Metodologia da home: o que a operação
   entrega na prática, condensado em 8 frentes. Grade de 8 abas compactas
   (número, nome, quantidade) e um único painel embaixo com o resumo e
   as entregas daquela frente, em etiquetas.
   Estilos em styles/pages/home.css (prefixo .entregas).
   ========================================================================== */

const FRENTES = [
  {
    id: 'estrategia', nome: 'Análise, estratégia e planejamento',
    resumo: 'Onde jogar, com quem falar e como abordar, antes de investir em qualquer canal.',
    itens: ['Go-to-market', 'ABM', 'ICP', 'Personas', 'Segmentação', 'Jornadas', 'Planejamento comercial', 'Pesquisa de mercado', 'Mapeamento de contas', 'Inteligência competitiva', 'Planos de abordagem', 'Playbooks', 'Sales Enablement', 'RevOps'],
  },
  {
    id: 'prospeccao', nome: 'Prospecção, qualificação e relacionamento',
    resumo: 'Conversas abertas com as contas certas e acompanhadas até virar oportunidade.',
    itens: ['Outbound', 'SDR', 'Inside Sales', 'Social Selling', 'LinkedIn', 'E-mail outbound', 'WhatsApp', 'Cadências', 'Listas qualificadas', 'Enriquecimento de bases', 'Enriquecimento de perfis', 'Gestão de mailing', 'CRM', 'Follow-ups'],
  },
  {
    id: 'performance', nome: 'Performance e geração de demanda',
    resumo: 'Campanhas para geração direta de oportunidades ou como apoio a estratégias maiores de posicionamento, relacionamento e prospecção.',
    itens: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Mídia programática', 'Inbound', 'Landing pages', 'Formulários', 'Campanhas', 'Remarketing', 'Nutrição', 'Lead scoring', 'CRO'],
  },
  {
    id: 'conteudo', nome: 'Conteúdo, autoridade e audiovisual',
    resumo: 'Conteúdos e experiências para construir presença, relevância e relacionamento com o mercado.',
    itens: ['LinkedIn', 'Construção de autoridade', 'Artigos', 'Blogs', 'Cases', 'Entrevistas', 'Conteúdos jornalísticos', 'Conteúdos hiperpersonalizados', 'Newsletters', 'Materiais ricos', 'Roteiros', 'Vídeos institucionais e promocionais', 'Podcasts', 'Videocasts', 'Webinars', 'Lives', 'Séries de conteúdo', 'Cobertura de eventos'],
  },
  {
    id: 'digital', nome: 'Websites e presença digital',
    resumo: 'Os lugares onde o mercado encontra, avalia e decide falar com a sua empresa.',
    itens: ['Websites', 'Landing pages', 'Portais', 'Blogs', 'Páginas de campanha', 'Páginas comerciais', 'SEO', 'GEO', 'CRO', 'Formulários', 'Áreas de conteúdo'],
  },
  {
    id: 'offline', nome: 'Eventos e ações offline',
    resumo: 'Presença física que abre portas e aprofunda o relacionamento com quem decide.',
    itens: ['Eventos próprios', 'Participação em feiras', 'Pré-evento', 'Pós-evento', 'Ativações', 'Reuniões presenciais', 'Materiais impressos', 'Apresentações personalizadas', 'Kits comerciais', 'Convites', 'Ações de relacionamento'],
  },
  {
    id: 'tecnologia', nome: 'Tecnologia, automação, IA e dados',
    resumo: 'Tecnologia aplicada para integrar a operação, ganhar escala e transformar dados em melhores decisões.',
    itens: ['CRM', 'Automações', 'Agentes de IA', 'Integrações', 'Fluxos comerciais', 'Formulários inteligentes', 'Lead routing', 'Scoring', 'Dashboards', 'Analytics', 'Análise de funil', 'Atribuição', 'Enriquecimento de dados', 'Inteligência comercial', 'Automação de conteúdo e prospecção'],
  },
  {
    id: 'time', nome: 'Estrutura e evolução do time',
    resumo: 'Materiais, ferramentas e conhecimento para tornar a operação comercial mais estruturada e autônoma.',
    itens: ['Playbooks', 'Templates', 'Scripts', 'Apresentações comerciais', 'Propostas', 'Decks', 'E-mails', 'Landing pages', 'Materiais impressos', 'Roteiros', 'Fluxos', 'Documentação', 'Treinamentos', 'Boas práticas', 'Acompanhamento do time', 'Transferência de conhecimento'],
  },
]

export default function Entregas() {
  const [ativo, setAtivo] = useState(0)
  const abasRef = useRef([])
  const f = FRENTES[ativo]

  function teclado(e, i) {
    let n = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % FRENTES.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + FRENTES.length) % FRENTES.length
    if (e.key === 'Home') n = 0
    if (e.key === 'End') n = FRENTES.length - 1
    if (n === null) return
    e.preventDefault()
    setAtivo(n)
    abasRef.current[n]?.focus()
  }

  return (
    <div className="entregas rv">
      <div className="entregas-cab">
        <h3>Na prática, a metodologia vira <span className="ac ac53">entrega.</span></h3>
      </div>

      <div className="entregas-abas" role="tablist" aria-label="Frentes de entrega">
        {FRENTES.map((fr, i) => (
          <button
            key={fr.id}
            ref={(el) => (abasRef.current[i] = el)}
            type="button"
            role="tab"
            id={'ent-aba-' + fr.id}
            aria-controls="ent-painel"
            aria-selected={ativo === i}
            tabIndex={ativo === i ? 0 : -1}
            className="entregas-aba"
            onClick={() => setAtivo(i)}
            onKeyDown={(e) => teclado(e, i)}
          >
            <span className="entregas-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="entregas-nome">{fr.nome}</span>
          </button>
        ))}
      </div>

      <div className="entregas-painel" id="ent-painel" role="tabpanel" aria-labelledby={'ent-aba-' + f.id} key={f.id}>
        <p className="entregas-resumo">{f.resumo}</p>
        <ul className="entregas-itens">
          {f.itens.map((it, i) => <li key={it} style={{ '--i': i }}>{it}</li>)}
        </ul>
      </div>
    </div>
  )
}
