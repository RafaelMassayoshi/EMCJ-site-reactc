/* ==========================================================================
   Conteúdo da página Pesquisa clínica (Random), versão v7.
   Fonte: random_wireframe_ux_v7-Final.html (aprovado pela EMCJ).
   Texto em dados para a página (PesquisaClinica.jsx) ficar só com layout.
   ========================================================================== */

export const NAV = [
  ['#sobre-random', 'Sobre'],
  ['#por-que-random', 'O porquê'],
  ['#como-fazemos', 'Como fazemos'],
  ['#cases', 'Cases'],
  ['#solucoes', 'Soluções'],
  ['#conteudo', 'Notícias'],
  ['#contato', 'Contato'],
]

export const MISSAO = [
  ['O paciente vem antes do estudo.', 'A comunicação começa antes da abertura do protocolo: geramos valor, informação, educação, orientação e confiança ao longo da jornada.'],
  ['Contexto clínico primeiro. Benchmarking para evoluir.', 'Pesquisa clínica por dentro; referências de saúde, marketing, atendimento, tecnologia e outros mercados por fora, transformadas em estratégia adequada a cada contexto.'],
]

/* Cada item: t = título; p = texto (array: string ou {b: destaque});
   fontes = [[rótulo, url]] */
export const PROBLEMAS = [
  {
    t: 'Sem participantes, não existe pesquisa.',
    p: ['Benchmarks de mercado indicam que ', { b: 'até 85% dos trials' }, ' enfrentam dificuldade para recrutar participantes suficientes. Recruitment precisa estar no centro da estratégia antes de a meta entrar em risco.'],
    fontes: [['WCG Data Intelligence', 'https://www.wcgclinical.com/solutions/participant-recruitment-retention/']],
  },
  {
    t: 'Recruitment é uma campanha complexa.',
    p: ['Trazemos uma revisão de ', { b: '61 artigos' }, ' sobre marketing aplicado a recruitment e retention. O padrão é claro: muito foco em publicidade e promoção; menos em estratégia, relacionamento e experiência.'],
    fontes: [['Trials, 2026', 'https://link.springer.com/article/10.1186/s13063-026-09576-9']],
  },
  {
    t: 'Quando a meta atrasa, toda a cadeia sente.',
    p: ['Cerca de ', { b: '80% dos trials' }, ' não atingem suas metas iniciais de enrollment no prazo. E cada dia de atraso no desenvolvimento pode representar cerca de ', { b: 'US$ 800 mil' }, ' em vendas não realizadas.'],
    fontes: [
      ['IQVIA', 'https://www.iqvia.com/-/media/iqvia/pdfs/library/white-papers/bcs2024-1062-04apr-pscs-site-whitepaper-tankersley.pdf'],
      ['Tufts CSDD', 'https://csdd.tufts.edu/sites/default/files/2025-02/Aug2024'],
    ],
  },
  {
    t: 'Campanha complexa, investimento alto. A inteligência precisa acompanhar.',
    p: ['O orçamento mediano de outreach já supera ', { b: 'US$ 1,3 milhão por estudo' }, ', com cerca de ', { b: '65%' }, ' direcionados a social media e mídia digital. Mais investimento pede mais integração, mensuração e inteligência.'],
    fontes: [
      ['Tufts CSDD / TIRS, 2026', 'https://pubmed.ncbi.nlm.nih.gov/42360616/'],
      ['Evolução das táticas de recruitment', 'https://www.appliedclinicaltrialsonline.com/view/an-examination-of-the-use-of-patient-recruitment-and-retention-tactics-for-global-studies'],
    ],
  },
  {
    t: 'Marketing começa antes da divulgação.',
    p: ['Público, barreiras, canais, mensagens e capacidade precisam entrar no planejamento ', { b: 'antes de a campanha começar' }, '. A literatura aponta para um recruitment mais upstream, conectado a feasibility, protocolo e comunicação.'],
    fontes: [
      ['Recruitment planning · Contemporary Clinical Trials', 'https://pubmed.ncbi.nlm.nih.gov/29330082/'],
      ['Trials · Marketing Strategies Review', 'https://link.springer.com/article/10.1186/s13063-026-09576-9'],
    ],
  },
  {
    t: 'Muitas empresas. Pouca integração.',
    p: ['Sponsor, CRO, vendors, centros e regiões executam partes diferentes da jornada. ', { b: 'Sem métricas comuns, integração e aprendizado compartilhado, cada operação aprende sozinha.' }],
    fontes: [['Recruitment Planning Framework', 'https://pubmed.ncbi.nlm.nih.gov/29330082/']],
  },
  {
    t: 'Interesse esfria. Tempo de resposta também é recruitment. Por que quase ninguém discute isso nos eventos do setor?',
    p: ['Em benchmarks de healthcare, a conversão caiu de ', { b: '26%' }, ' com resposta entre 5 e 15 minutos para ', { b: '7%' }, ' entre 4 e 24 horas. Em outro recorte, apenas ', { b: '54% das ligações' }, ' chegaram a uma pessoa. Atendimento também é performance.'],
    fontes: [
      ['Healthcare Lead Response Benchmark', 'https://ichelonconsulting.com/insights/lead-response-time-conversion-impact-healthcare'],
      ['Invoca Healthcare Benchmarks', 'https://www.invoca.com/reports/the-invoca-healthcare-lead-conversion-benchmarks-report-2026'],
    ],
  },
  {
    t: 'O prontuário encontra. A jornada precisa fazer avançar.',
    p: [{ b: 'O hospital tem o dado.' }, ' Data lake e IA podem encontrar. O médico pode validar. Depois começa o desafio humano: quem aborda, explica, responde à família, acompanha e mede cada próximo passo? Tecnologia identifica oportunidades. Comunicação e atendimento transformam identificação em jornada.'],
    fontes: [['CTTI · Recruitment', 'https://ctti-clinicaltrials.org/about/ctti-projects/recruitment-2/']],
  },
]

/* Evidências padronizadas: valor curto (1 linha), rótulo curto e texto de
   ~150 caracteres, para os cartões terem o mesmo formato. */
export const EVIDENCIAS = [
  { tipo: 'Estudos interrompidos · 2024', v: '36,67%', r: 'pararam por falta de recrutamento', p: 'Entre estudos interrompidos, recrutamento insuficiente foi a causa identificada mais frequente.', fonte: 'Nature Genetics', link: 'Ver estudo', url: 'https://www.nature.com/articles/s41588-024-01854-z', limite: 'Recorte: só estudos interrompidos.' },
  { tipo: 'WCG Data Intelligence · 2024', v: '85%', r: 'dos trials têm dificuldade de recrutar', p: 'Benchmark de mercado usado para dimensionar quantos estudos enfrentam dificuldade de enrollment.', fonte: 'WCG', link: 'Ver fonte', url: 'https://www.wcgclinical.com/solutions/participant-recruitment-retention/', limite: 'Benchmark proprietário da WCG.' },
  { tipo: 'Coorte multicêntrica · 2025', v: '50 × 31', r: 'meses de recrutamento: falha × sucesso', p: 'Quando o recrutamento falhou, o período médio foi 19 meses maior, pressionando cronograma e orçamento.', fonte: 'BMJ Open', link: 'Ver estudo', url: 'https://bmjopen.bmj.com/content/15/1/e087766', limite: 'População e país específicos.' },
  { tipo: 'Tufts CSDD · 2024', v: 'US$ 800 mil', r: 'por dia de atraso no desenvolvimento', p: 'Estimativa de vendas não realizadas a cada dia de atraso. O enrollment pode participar dessa conta.', fonte: 'Tufts CSDD', link: 'Ver white paper', url: 'https://csdd.tufts.edu/sites/default/files/2025-02/Aug2024', limite: 'Receita não realizada ≠ custo de recrutamento.' },
  { tipo: 'Outreach centralizado · 2026', v: 'US$ 1,33 mi', r: 'orçamento mediano de outreach por estudo', p: 'Com verba, canais e vendors crescendo, coordenação e leitura de funil precisam crescer junto.', fonte: 'Tufts CSDD / TIRS', link: 'Ver estudo', url: 'https://pubmed.ncbi.nlm.nih.gov/42360616/', limite: 'Recorte de outreach centralizado.' },
  { tipo: 'Táticas de recrutamento · 2012–2023', v: '3% → 44%', r: 'dos estudos passaram a usar websites', p: 'O digital ganhou espaço. O desafio agora é integrar canal, conteúdo, atendimento e operação.', fonte: 'Tufts / Applied Clinical Trials', link: 'Ver análise', url: 'https://www.appliedclinicaltrialsonline.com/view/an-examination-of-the-use-of-patient-recruitment-and-retention-tactics-for-global-studies', limite: 'Adoção não prova eficácia isolada.' },
  { tipo: 'Revisão e meta-análise · 2020', v: 'US$ 72 × 199', r: 'custo por participante: online × offline', p: 'Online saiu mais barato por participante; offline converteu melhor em parte dos estudos.', fonte: 'JMIR', link: 'Ver estudo', url: 'https://www.jmir.org/2020/11/e22179', limite: 'Mais barato não é melhor funil.' },
  { tipo: 'IQVIA · 2024', v: '80%', r: 'não batem a meta inicial no prazo', p: 'A maioria dos estudos não chega à meta de enrollment no prazo, por falta de tempo, recursos e expertise.', fonte: 'IQVIA', link: 'Ver white paper', url: 'https://www.iqvia.com/-/media/iqvia/pdfs/library/white-papers/bcs2024-1062-04apr-pscs-site-whitepaper-tankersley.pdf', limite: 'Indicador citado pela IQVIA.' },
  { tipo: 'CISCRP · 2025', v: '27% | 48%', r: 'o interesse encontrou silêncio', p: 'O paciente demonstrou interesse e parte da operação parou antes da conversa. Perda que o CPL não mostra.', fonte: 'CISCRP', link: 'Ver relatório', url: 'https://www.ciscrp.org/wp-content/uploads/2025/11/2025-Perceptions-Insights-Deciding-to-Participate_FINAL.pdf', limite: 'Base: 2.532 respondentes.' },
]

export const PRATICA = [
  'Construímos marcas para fazer parte de comunidades.',
  'Desenhamos comunicação para estar presente em cada etapa da jornada.',
  'Criamos valor para conquistar atenção, confiança e proximidade.',
]

/* Vitrine de cases (seção Como fazemos). tipo: site | lp | plano | apres |
   video | reel. `embed` é o endereço carregado no clique; `href` abre em
   nova aba. `capa` é opcional (imagem pública de prévia).
   TODO(conteúdo): confirmar títulos e descrições dos itens marcados com
   "confirmar"; conferir se os PDFs do Drive estão públicos e liberados
   para exibição (planos de campanha podem conter dados de clientes). */
export const VITRINE = [
  { id: 'onconecta', tipo: 'site', grupo: 'sites', titulo: 'Onconecta', desc: 'Portal para a comunidade oncológica.', /* confirmar */
    href: 'https://onconecta.com.br', embed: 'https://onconecta.com.br', dominio: 'onconecta.com.br' },
  { id: 'asma', tipo: 'site', grupo: 'sites', titulo: 'Tudo Sobre Asma', desc: 'Portal que une informação, novidades e oportunidades em pesquisa clínica para quem convive com asma.',
    href: 'https://tudosobreasma.com.br', embed: 'https://tudosobreasma.com.br', dominio: 'tudosobreasma.com.br' },
  { id: 'brtrials-depressao', tipo: 'lp', grupo: 'sites', titulo: 'BR Trials · Depressão', desc: 'Landing page de estudo: acolhimento, informação sobre a doença, como funciona a participação e pré-cadastro.',
    href: 'https://brtrials.com.br/depressao/', embed: 'https://brtrials.com.br/depressao/', dominio: 'brtrials.com.br/depressao',
    capa: 'https://brtrials.com.br/wp-content/uploads/2024/10/Grupo-1.png' },
  /* Planos: páginas convertidas do PDF em WebP e hospedadas no site
     (public/assets/cases/…), sem depender do leitor do Drive. O da CEPHO
     mostra só a campanha (páginas 7 a 18 do PDF); as páginas de
     referências, com peças de terceiros, ficaram de fora. */
  { id: 'plano-1', tipo: 'plano', grupo: 'planos', titulo: 'BR Trials · Alzheimer', desc: 'Conceito e campanha de recrutamento para Alzheimer, com mensagem, criativos e aplicações para pacientes, familiares e cuidadores.',
    href: 'https://drive.google.com/file/d/1pOMX6lbPDCqGto46Z-VLTuU-xDCZMWYt/view',
    modo: 'rolar', proporcao: '1400 / 1400',
    paginas: [
      '/assets/cases/brtrials-alzheimer/s01.webp',
      '/assets/cases/brtrials-alzheimer/s02.webp',
      '/assets/cases/brtrials-alzheimer/s03.webp',
      '/assets/cases/brtrials-alzheimer/s04.webp',
      '/assets/cases/brtrials-alzheimer/s05.webp',
      '/assets/cases/brtrials-alzheimer/s06.webp',
      '/assets/cases/brtrials-alzheimer/s07.webp',
      '/assets/cases/brtrials-alzheimer/s08.webp',
      '/assets/cases/brtrials-alzheimer/s09.webp',
      '/assets/cases/brtrials-alzheimer/s10.webp',
    ] },
  { id: 'plano-2', tipo: 'plano', grupo: 'planos', titulo: 'CEPHO · O Próximo Fôlego', desc: 'Campanha guarda-chuva de recrutamento para câncer de pulmão: conceito, identidade e três frentes de criativos, para pacientes, familiares e quem já tem laudos.',
    href: 'https://drive.google.com/file/d/1wznPrCAj7oHnhFnQpRh7RIOxP5NZYFMY/view',
    modo: 'folhear', proporcao: '16 / 9',
    paginas: [
      '/assets/cases/cepho-proximo-folego/p01.webp',
      '/assets/cases/cepho-proximo-folego/p02.webp',
      '/assets/cases/cepho-proximo-folego/p03.webp',
      '/assets/cases/cepho-proximo-folego/p04.webp',
      '/assets/cases/cepho-proximo-folego/p05.webp',
      '/assets/cases/cepho-proximo-folego/p06.webp',
      '/assets/cases/cepho-proximo-folego/p07.webp',
      '/assets/cases/cepho-proximo-folego/p08.webp',
      '/assets/cases/cepho-proximo-folego/p09.webp',
      '/assets/cases/cepho-proximo-folego/p10.webp',
      '/assets/cases/cepho-proximo-folego/p11.webp',
      '/assets/cases/cepho-proximo-folego/p12.webp',
    ] },
  { id: 'apres', tipo: 'apres', grupo: 'planos', titulo: 'Apresentação institucional', desc: 'Material institucional para apresentar o centro a sponsors, CROs e parceiros.', /* confirmar */
    href: 'https://drive.google.com/file/d/1N4HEFAIOYhjdsKRtTivJ0mDZq22fbgfe/view', embed: 'https://drive.google.com/file/d/1N4HEFAIOYhjdsKRtTivJ0mDZq22fbgfe/preview',
    capa: 'https://drive.google.com/thumbnail?id=1N4HEFAIOYhjdsKRtTivJ0mDZq22fbgfe&sz=w800' },
  { id: 'video-1', tipo: 'video', grupo: 'videos', titulo: 'Vídeo', desc: 'Conteúdo audiovisual produzido para a jornada do paciente.', /* confirmar */
    href: 'https://www.youtube.com/watch?v=7eYXRxWc54Y', embed: 'https://www.youtube-nocookie.com/embed/7eYXRxWc54Y?autoplay=1&rel=0',
    capa: 'https://i.ytimg.com/vi/7eYXRxWc54Y/hqdefault.jpg' },
  { id: 'video-2', tipo: 'video', grupo: 'videos', titulo: 'Vídeo', desc: 'Conteúdo com especialista para educação e confiança.', /* confirmar */
    href: 'https://www.youtube.com/watch?v=9EJHC9Wdgn4', embed: 'https://www.youtube-nocookie.com/embed/9EJHC9Wdgn4?autoplay=1&rel=0',
    capa: 'https://i.ytimg.com/vi/9EJHC9Wdgn4/hqdefault.jpg' },
  { id: 'reel', tipo: 'reel', grupo: 'videos', titulo: 'Reel no Instagram', desc: 'Conteúdo curto para redes sociais.', /* confirmar */
    href: 'https://www.instagram.com/reel/C8XyUBup4Wj/', embed: 'https://www.instagram.com/reel/C8XyUBup4Wj/embed' },
]


/* Números da operação. Os duplicados do wireframe (250+ projetos e 25
   clientes aparecem duas vezes) foram mostrados uma vez só. */
export const NUMEROS_PRINCIPAIS = [
  { alvo: 10, pre: '', suf: '+', r: 'anos de experiência acumulada' },
  { alvo: 25, pre: '', suf: '+', r: 'clientes atendidos' },
  { alvo: 250, pre: '', suf: '+', r: 'projetos de pesquisa clínica' },
]
export const NUMEROS_SECUNDARIOS = [
  { alvo: 15, suf: ' mi+', r: 'pessoas alcançadas em campanhas de estudos' },
  { alvo: 185, suf: ' mil', r: 'leads gerados para estudos' },
  { alvo: 3750, suf: '+', mil: true, r: 'voluntários randomizados em diversas áreas' },
  { alvo: 30, suf: '+', r: 'doenças anunciadas' },
]

/* TODO(compliance): exibir nomes de clientes só com autorização de cada um. */
export const CLIENTES = ['CEMEC', 'CPclin', 'CEPHO', 'CEON+', 'CPC USCS', 'BR Trials', 'IEP São Lucas', 'CoraCentro', 'IPC Tatuí', 'CIpes', 'Méderi', 'Ruschel', 'CECIP Jaú', 'EMS', 'Eurofarma']

export const FUNIS = [
  { area: 'Pneumologia', titulo: 'Asma', destaque: '85', destaqueR: 'pacientes randomizados', tom: 'roxo',
    linhas: [['Impressões', '+12,1 mi'], ['Cliques', '+101 mil'], ['Leads', '4.750'], ['Custo por lead', 'R$ 14,55'], ['Taxa de randomização', '2%'], ['Custo por randomização', 'R$ 814,17']],
    leitura: 'Mídia e conteúdo com um portal dedicado ao paciente: recrutamento que também constrói presença e informação.' },
  { area: 'Neurologia', titulo: 'Enxaqueca', destaque: '151', destaqueR: 'pacientes randomizados', tom: 'ciano',
    linhas: [['Impressões', '+1,7 mi'], ['Cliques', '+13,8 mil'], ['Leads', '1.854'], ['Custo por lead', 'R$ 7,91'], ['Taxa de randomização', '8%'], ['Custo por randomização', 'R$ 96,69']],
    leitura: 'Mídia, comunicação e recrutamento juntos: o digital contribuindo até a randomização, não só até o formulário.' },
  { area: 'Cardiologia', titulo: 'Cardiovascular', subtitulo: 'Doenças cardiovasculares', destaque: '4.888', destaqueR: 'leads gerados', tom: 'magenta',
    linhas: [['Impressões', '+3,5 mi'], ['Cliques', '+59,3 mil'], ['Randomizados', '53'], ['Custo por lead', 'R$ 9,55'], ['Taxa de randomização', '1%'], ['Custo por randomização', 'R$ 880,58']],
    leitura: 'Lead barato pode esconder perdas depois da captura. Qualidade, contato e operação entram no mesmo funil.' },
  { area: 'Endocrinologia', titulo: 'Metabólicas', subtitulo: 'Diabetes, dislipidemia e neuropatia', destaque: '119', destaqueR: 'pacientes randomizados', tom: 'roxo',
    linhas: [['Impressões', '+3,8 mi'], ['Cliques', '+65,8 mil'], ['Leads', '3.300'], ['Custo por lead', 'R$ 11,83'], ['Taxa de randomização', '4%'], ['Custo por randomização', 'R$ 328,11']],
    leitura: 'Três áreas metabólicas, uma base comum de dados, comunicação e aprendizado reaproveitado entre estudos.' },
  { area: 'Urologia', titulo: 'Próstata', subtitulo: 'Hiperplasia prostática', destaque: '16%', destaqueR: 'taxa de randomização', tom: 'ciano',
    linhas: [['Impressões', '+1,1 mi'], ['Cliques', '+13,5 mil'], ['Leads', '611'], ['Custo por lead', 'R$ 16,39'], ['Randomizados', '98'], ['Custo por randomização', 'R$ 102,22']],
    leitura: 'Menos volume, maior conversão: o CPL isolado diz pouco sobre o resultado que importa para o estudo.' },
]

export const DEPOIMENTOS = [
  { destaque: 'A Emcomjunto tem sido um grande diferencial para nosso centro. Tanto no fortalecimento de nossa marca, quanto na divulgação de nossos estudos e contatos com novos pacientes.',
    completo: 'A expertise do time na área de Pesquisa Clínica faz toda a diferença e tem trazido resultados excelentes. Agradecemos por toda parceria! Vida longa à Emcomjunto!',
    nome: 'Thais Peretti Pereira', cargo: 'Coordenadora de Estudos Clínicos · IPC Tatuí' },
  { destaque: 'Quando começamos a parceria, mudou da água para o vinho desde a nossa imagem até campanhas, o que refletiu na performance.',
    completo: 'A Emcomjunto é uma empresa de marketing que tem sido muito valiosa para o nosso centro, pois tivemos uma experiência anterior com outra agência que não tinha conhecimento prévio em pesquisa clínica. Indicamos pois são super competentes no que entregam e de fácil comunicação!',
    nome: 'Vinicius Santana', cargo: 'Cofundador · CENDERS' },
  { destaque: 'Em alguns estudos, o número de voluntários randomizados que conheceram o estudo pelas redes sociais foi superior a 50%.',
    completo: 'Em nossa experiência, as campanhas direcionadas em redes sociais impactaram positivamente o recrutamento de participantes, principalmente em estudos voltados para doenças com alta incidência na população, impactando positivamente o número de participantes randomizados.',
    nome: 'Christian Sbeghen', cargo: 'Coordenador de Recrutamento · Bioserv Life Sciences' },
  { destaque: 'Iniciamos um relacionamento comercial que logo se tornou uma verdadeira parceria.',
    completo: 'Há cerca de um ano e meio, procurava por uma agência de marketing para me ajudar a impulsionar o recrutamento de participantes por mídias sociais. Foi assim que conheci a EMCJ. Com um time jovem, mas muito competente, a EMCJ deu vida à marca BR Trials e nos ajudou a entrar para o seleto time dos grandes centros de pesquisa.',
    nome: 'Silvana Glikmanas', cargo: 'Diretora de Recrutamento · BR Trials' },
  { destaque: 'Discutir pesquisas clínicas, abordar nossas demandas e planejar estratégias tornou-se muito mais simples quando temos interlocutores que falam a nossa língua.',
    completo: 'Trabalhar com a Emcomjunto foi uma grata surpresa. Encontramos nela um conhecimento sobre o mercado de pesquisa clínica que não havíamos encontrado em outras empresas de marketing digital. Esse alinhamento é essencial e reflete o valor significativo que eles agregam para nós.',
    nome: 'José Roberto Ruschel Siffert', cargo: 'Diretor · Ruschel Medicina e ACESSE' },
]

/* `funil` aponta para o índice em FUNIS: o cartão desenha a mini-escada do
   funil com os mesmos números. */
export const ESTUDOS_CASO = [
  { funil: 0, tag: 'Asma · Pneumologia', t: 'Conteúdo, portal próprio e recrutamento nacional', p: 'Mais de 12,1 milhões de impressões, 4.750 leads e 85 randomizados em uma estratégia que combinou mídia, informação para o paciente e atuação em diferentes regiões.' },
  { funil: 1, tag: 'Enxaqueca · Neurologia', t: '151 randomizados e 8% de taxa de randomização', p: 'Um funil em que campanha digital, comunicação e operação contribuíram juntas para transformar alcance em participantes randomizados.' },
  { funil: 2, tag: 'Cardiologia · BR Trials', t: '4.888 leads e uma lição sobre olhar além do CPL', p: 'Alto volume e CPL competitivo mostraram por que a otimização precisa incluir qualidade, atendimento, critérios e conversão até a randomização.' },
  { funil: 3, tag: 'Endocrinologia', t: '119 randomizados em diferentes demandas metabólicas', p: 'Estratégias planejadas para públicos e estudos distintos, preservando uma base comum de dados, comunicação e aprendizado operacional.' },
  { funil: 4, tag: 'Hiperplasia de próstata · Urologia', t: '16% de taxa de randomização', p: '611 leads e 98 randomizados: um recorte em que menor volume veio acompanhado de uma conversão final muito mais alta.' },
]

export const OUTRAS_AREAS = ['Psiquiatria', 'Ginecologia', 'Hipertensão', 'Gastroenterologia', 'Diabetes', 'Insônia', 'Oncologia', 'Fibrose pulmonar', 'Alopecia', 'Dermatologia', 'Retocolite', 'Covid', 'Mioma', 'Infectologia', 'Alzheimer', 'Lúpus', 'Esclerose múltipla', 'DPOC', 'Doenças raras', 'Bronquiectasia', 'Reumatologia', 'Endometriose', 'Psicologia', 'Depressão', 'Obesidade']

/* TODO(conteúdo): confirmar sobrenome do André e grafia "Filipe Bazani". */
export const TIME = [
  { nome: 'Grazielle Santana', org: 'Invicta', area: 'Operação em pesquisa clínica', p: 'Estruturação e gestão de centros, processos, coordenação, qualidade, treinamento e desenvolvimento operacional.' },
  { nome: 'Ivens Zanetti', org: 'Emcomjunto', area: 'Marketing & comunicação', p: 'Estratégia, marcas, campanhas, geração de demanda, tecnologia e processos de relacionamento.' },
  { nome: 'André', org: 'Invicta', area: 'Legal, compliance & ética', p: 'Contratos, LGPD, compliance, ética e suporte a processos que conectam comunicação e operação em pesquisa clínica.' },
  { nome: 'Filipe Bazani', org: 'Emcomjunto', area: 'Marketing & comunicação', p: 'Estratégia, marcas, campanhas, tecnologia, dados e processos de relacionamento aplicados à pesquisa clínica.' },
]

export const PAPEIS = ['Designers', 'Jornalistas', 'Filmmakers', 'Editores', 'Social media', 'Community managers', 'Gerentes de projetos', 'SDRs', 'Pré-atendimento', 'CRM', 'Mídia', 'Desenvolvedores', 'Engenharia de IA']

export const SOLUCOES = [
  { id: 'pharma', aba: 'Indústrias & patrocinadores', label: 'Para indústrias e patrocinadores',
    titulo: 'Recruitment, patient advocacy e relacionamento em uma operação global.',
    texto: 'Da inteligência inicial à execução, conectamos recruitment marketing, patient advocacy, community management, conteúdo, atendimento, CRM, dados e tecnologia em projetos locais ou globais, com adaptação a mercados, idiomas, públicos e operações diferentes.',
    cards: [
      ['Recruitment marketing', 'Estratégia, canais, criativos, comunidades, landing pages, mídia, atendimento, pré-qualificação e otimização conectados ao funil do estudo.'],
      ['Dados & inteligência', 'Diagnóstico, imersão, benchmarks, dashboards, scoring e análise de toda a cadeia para gerar hipóteses de otimização, prioridades e decisões.'],
      ['Patient advocacy & community management', 'Relacionamento estruturado com pacientes, associações, comunidades, profissionais e creators para gerar escuta, valor e presença antes, durante e depois dos estudos, com capacidade de entrega global.'],
      ['Marca & comunicação', 'Conceitos de campanha, conteúdo multicanal, peças digitais e offline, produções audiovisuais personalizadas, materiais de eventos e comunicação para diferentes pontos da jornada.'],
      ['CRM & relacionamento estratégico', 'Newsletters, clipping, SDR, cadências, automações, gestão de contatos, segmentação e jornadas para pacientes, sites, parceiros e outros stakeholders.'],
      ['Tecnologia aplicada à comunicação & dados', 'Assessoria de stack, integrações, IA, dashboards e avaliação de KPIs de recruitment e marketing para reduzir trabalho manual e aumentar capacidade de gestão.'],
    ] },
  { id: 'cro', aba: 'CROs', label: 'Para CROs',
    titulo: 'Recruitment, marca e relacionamento para CROs que operam em escala global.',
    texto: 'Apoiamos CROs na execução e leitura de recruitment em múltiplos sites e mercados, ao mesmo tempo em que fortalecemos marca, conteúdo e relacionamento com indústrias farmacêuticas globais. Uma camada especializada de marketing com capacidade de entrega internacional.',
    cards: [
      ['Estratégia de recruitment multi-site', 'Planejamento por país, região e site, definição de canais, criativos, orçamento, metas e apoio a rescue recruitment quando necessário.'],
      ['Dados & performance', 'Dashboards comparáveis, leitura de funis por site e origem, indicadores de atendimento, análises de perda e hipóteses para redistribuição de esforço e verba.'],
      ['Marca, comunicação & relacionamento global', 'Posicionamento, materiais, conteúdo, community management e comunicação institucional para fortalecer presença junto a sponsors, indústrias, sites, pacientes e parceiros em diferentes mercados.'],
      ['Site enablement', 'Kits de recrutamento, guias, materiais, treinamento de comunicação e suporte para que centros executem com mais clareza e velocidade.'],
      ['CRM & relacionamento', 'Jornadas, cadências, newsletters, comunicação com sites e stakeholders, automações e acompanhamento estruturado de contatos e tarefas.'],
      ['Tecnologia & integração', 'Integrações entre formulários, CRM, automação, mídia e dashboards para consolidar sinais de performance e reduzir fragmentação operacional.'],
    ] },
  { id: 'sites', aba: 'Centros & redes', label: 'Para centros e redes de pesquisa',
    titulo: 'Do plano de negócios à atração de estudos. Do lead à triagem.',
    texto: 'Estruturamos marca, posicionamento, desenvolvimento comercial e recruitment para centros que querem crescer, atrair feasibilities, captar recursos e construir presença contínua com pacientes e mercado, do plano de negócios à produção de conteúdo.',
    cards: [
      ['Plano de negócios & posicionamento', 'Modelos de atuação, proposta de valor, naming, identidade, apresentações institucionais, vídeos e estratégia de crescimento para centros e redes.'],
      ['Sites, social media & presença digital', 'Website institucional, páginas de estudos, social media, vídeos, conteúdos, SEO, mídia e ativos digitais para apoiar reputação, pacientes e desenvolvimento comercial.'],
      ['Feasibility & demanda B2B', 'Posicionamento para sponsors e CROs, prospecção, relacionamento, materiais comerciais, organização de dados do centro e estratégias para atração de novos estudos.'],
      ['Recruitment & captação de recursos', 'Campanhas, planejamento de mídia, creators, parcerias e modelos para estruturar ou captar recursos destinados ao recruitment de estudos.'],
      ['Campanhas, CEPs & comunicação', 'Apoio à preparação de materiais de campanha, fluxos de aprovação, adequações de comunicação e organização de versões para submissão aos CEPs responsáveis.'],
      ['CRM, atendimento & automação', 'Pré-atendimento, triagem, SLAs, cadências, automações, dashboards e relacionamento de longo prazo com interessados e participantes.'],
    ] },
  { id: 'vendors', aba: 'Vendors & fornecedores', label: 'Para vendors, fornecedores e prestadores',
    titulo: 'Marketing B2C para gerar valor ao paciente. Marketing B2B para vender ao ecossistema.',
    texto: 'Combinamos entendimento técnico de pesquisa clínica com estratégia e produção de marketing para posicionar vendors, gerar demanda, vender soluções complexas e fortalecer relacionamento com sponsors, CROs, centros e profissionais. Para vendors de recruitment, também podemos potencializar campanhas de captação de participantes.',
    cards: [
      ['Site & posicionamento', 'Sites, landing pages, arquitetura de mensagem, proposta de valor e materiais digitais para explicar com clareza o que a empresa faz e para quem.'],
      ['Apresentações & audiovisual', 'Decks comerciais, vídeos institucionais, demonstrações, cases, infográficos e materiais para reuniões, congressos, eventos e vendas.'],
      ['SDR & outbound', 'Mapeamento de contas, listas qualificadas, cadências, abordagem, apoio a SDR e processos para abrir conversas com sponsors, CROs, centros e parceiros.'],
      ['Newsletters & CRM', 'Relacionamento recorrente, segmentação, clipping, conteúdo, automações e jornadas para manter a empresa presente entre uma oportunidade e outra.'],
      ['Campanhas B2B & recruitment', 'LinkedIn, Google, Meta e outros canais com criativos, conteúdo e landing pages para gerar demanda B2B e, quando o vendor atua em recruitment, potencializar campanhas de captação de participantes.'],
      ['Conteúdo & autoridade', 'Artigos, estudos, webinars, cases, social media e thought leadership para transformar conhecimento técnico em presença de mercado.'],
    ] },
  { id: 'eco', aba: 'Ecossistema', label: 'Para associações, saúde, profissionais e creators',
    titulo: 'Marcas, comunidades e conteúdo para quem influencia saúde e pesquisa clínica.',
    texto: 'Produzimos marcas, conteúdos, comunidades e experiências para associações, organizações de pacientes, empresas de saúde, clínicas, laboratórios, profissionais e creators, incluindo construção e gestão de marcas pessoais para médicos e especialistas.',
    cards: [
      ['Associações de pacientes', 'Portais, campanhas educativas, comunidades, newsletters, eventos, conteúdos e projetos de informação e relacionamento com pacientes e familiares.'],
      ['Associações de pesquisa e saúde', 'Comunicação institucional, membership, congressos, projetos de conteúdo, posicionamento, relacionamento e divulgação de iniciativas do setor.'],
      ['Associações médicas & sociedades', 'Conteúdo científico, eventos, jornadas de comunicação, materiais educativos e experiências digitais para profissionais de saúde.'],
      ['Clínicas, laboratórios & empresas de saúde', 'Marca, site, geração de demanda, CRM, conteúdo, mídia e comunicação para serviços de saúde que precisam crescer e se relacionar melhor.'],
      ['Marcas pessoais para médicos & especialistas', 'Posicionamento, identidade, conteúdo, audiovisual, social media e presença digital para médicos, pesquisadores e especialistas que querem construir autoridade com consistência.'],
      ['Creators & projetos editoriais', 'Estratégia, formatos, roteiros, produção e distribuição para criadores que precisam transformar conhecimento em conteúdo confiável e relevante.'],
    ] },
]

export const TIPOS_ORG = ['Indústria farmacêutica', 'Patrocinador de estudos', 'CRO', 'Centro de pesquisa', 'Rede de centros', 'Hospital / clínica', 'Vendor / fornecedor', 'Prestador de serviços', 'Associação / organização de pacientes', 'Associação de pesquisa clínica ou saúde', 'Laboratório', 'Profissional de saúde', 'Criador de conteúdo em saúde', 'Outro']

export const PROCURA = ['Quero orçar um projeto', 'Quero entender como a Random trabalha', 'Recruitment marketing', 'Marketing, comunicação ou marca', 'Dados, tecnologia ou inteligência', 'CRM, atendimento ou relacionamento', 'Demanda B2B / feasibility', 'Estruturação / desenvolvimento de centro']

export const PARTICIPAR = ['Newsletter, estudos e cases', 'Randomcast', 'Grupo profissional de WhatsApp', 'Fórum e discussões da comunidade']

/* TODO(conteúdo): "Ler análise" ainda sem destino (as análises não estão
   publicadas). Quando existirem, preencher `analise` com o link. */
export const ESTUDOS = [
  { tipo: 'Estudo & análise', meta: 'Trials · 2026', t: '61 artigos sobre marketing em pesquisa clínica. E uma pergunta: onde está o marketing?', p: 'Uma revisão mostra que o setor usa marketing principalmente como promoção e ainda explora pouco estratégia, valor, relacionamento, comunidades e experiência.', analise: '', fonte: ['Estudo base', 'https://link.springer.com/article/10.1186/s13063-026-09576-9'] },
  { tipo: 'Benchmarking Random', meta: 'Atendimento & recruitment', t: 'O lead chegou. Quem responde agora?', p: 'Tempo de primeira resposta, cadência, CRM, priorização, e-mail e gestão de atendimento podem ser alguns dos gargalos mais invisíveis do recrutamento.', analise: '', fonte: ['Fonte CISCRP', 'https://www.ciscrp.org/wp-content/uploads/2025/11/2025-Perceptions-Insights-Deciding-to-Participate_FINAL.pdf'] },
  { tipo: 'Patient engagement', meta: 'Comunidades & advocacy', t: 'Quem conhece a jornada do paciente precisa participar da conversa antes da campanha.', p: 'Associações, organizações e comunidades podem contribuir com linguagem, barreiras, confiança, educação, co-criação e relacionamento, muito além da divulgação de um estudo.', analise: '', fonte: ['Referência', 'https://ctti-clinicaltrials.org/about/ctti-projects/recruitment-2/'] },
]

/* TODO(conteúdo): links de Randomcast, fórum e grupo de WhatsApp. */
export const CANAIS = [
  { t: 'Newsletter', p: 'Estudos, análises, novidades e curadoria.', href: '#contato' },
  { t: 'Randomcast', p: 'Conversas entre marketing, saúde e research.', href: '' },
  { t: 'Fórum & discussões', p: 'Perguntas e aprendizados que merecem circular.', href: '' },
  { t: 'Grupo de WhatsApp', p: 'Conexão profissional e atualização da comunidade.', href: '' },
]
