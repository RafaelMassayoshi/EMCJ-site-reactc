# Alterações: Homepage Emcomjunto

Escopo: só a home (`/`). A página de Pesquisa clínica (Random) está igual à versão original deste repositório. Nenhuma dependência nova: `npm install` e `npm run build`, como antes.

## Arquivos alterados
- `src/pages/Home.jsx`: nova ordem de seções (abaixo), dados dos cartões de mercado, formulário de contato com campos novos, seções Jornada, Decisão e ∞ Caminhos removidas, seção Σ Combinação oculta (ver "Seção oculta").
- `src/styles/pages/home.css`: blocos novos no fim do arquivo, todos escopados em `.pagina-home`. Nenhum CSS compartilhado foi alterado, exceto a importação de `components/trilho.css` na home.
- `src/components/Footer.jsx`: prop nova `semNewsletter` (padrão `false`). A home passa `true` porque tem seção própria de News. As outras páginas não mudam.

## Arquivos novos (src/components)
- `HeroFluxo.jsx`: diagrama do hero em lógica de sistema solar, com cenas de exemplo (Varejo, Saúde, ESG) editáveis no array `CENAS`.
- `BarraClientes.jsx`: barra sobre a borda do hero, com logos em loop e números em revezamento.
- `SecaoPublico.jsx`: seção U (Mercado), com texto à esquerda e "o que se perde entre as duas áreas" à direita.
- `SecaoCaminhos.jsx`: "Como funciona em três caminhos" (círculos sobrepostos).
- `SecaoPilares.jsx`: "Os pilares da nossa metodologia" (usa o componente `Trilho` existente).
- `Entregas.jsx`: fecha a seção de pilares, com 8 frentes de entrega em abas.
- `SecaoDoisLados.jsx`: seção ⊂ Recorte, com Resultados de um lado e entregas do outro, ligados por fios.
- `MercadoArte.jsx`: ilustração e mini-infográfico dos cartões de mercado (aceita foto pela prop `imagem`).
- `SecaoNewsletter.jsx`: seção News, com 7 newsletters, prévia de caixa de entrada e consentimento.
- `UltimasNoticias.jsx`: últimos 3 posts do WordPress antes do rodapé (some se a API falhar).

## Ordem da home
Hero → Barra de clientes → U Mercado → Três caminhos → Π Pilares + Entregas → ⊂ Recorte (dois lados) → ∪ Parceiros → ∩ Encaixe (mercados) → Contato → News → Últimas notícias → Rodapé.

## Seção oculta
Σ Combinação continua no código, desligada por `const MOSTRAR_COMBINACAO = false` no topo de `Home.jsx`. Para voltar a exibir, basta trocar para `true`.

## Formulários (mesmo webhook n8n de hoje, via useFormWebhook)
- **Contato** (`name="contato"`): campos novos `cnpj` (com máscara), `equipe_comercial`, `faturamento`, `orcamento_midia`, `volume_mensal` e `newsletters` (checkbox múltiplo).
- **News** (`name="newsletter-home"`): `nome`, `email`, `newsletters` (múltiplo, mínimo 1) e `consentimento` (obrigatório).
- Se o Netlify Forms ainda for usado em paralelo, registrar os campos novos no HTML estático de referência.

## Pendências (anotadas como TODO no código)
- Criar a página `/politica-de-privacidade`, usada no consentimento da News.
- Logos reais dos clientes em `BarraClientes.jsx` (hoje em texto). A Gmar Ambiental só deve aparecer com autorização.
- Seção ∪ Parceiros: os espaços "LOGO 1…" da Esteira continuam aguardando os arquivos.
- Fotos opcionais dos cartões de mercado (`MercadoArte`, prop `imagem`).
- Âncoras usadas: `#contato` (hero e formulário), `/o-que-fazemos` (botão do hero) e `/o-que-fazemos#cases` ("Ver todos os cases").
