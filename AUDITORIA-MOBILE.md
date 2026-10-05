# Auditoria mobile (outubro/2026)

Todos os ajustes valem só até 900 px de largura. A versão desktop não muda.
Os blocos novos de CSS estão no fim de cada arquivo, sob o comentário
"AUDITORIA MOBILE".

## Arquivos novos
- `src/hooks/useMedia.js`: hook que diz se a tela está no tamanho de celular.
- `src/components/PontosFaixa.jsx`: pontinhos de posição das faixas deslizantes.

## Por página
- **Todas:** links do rodapé e botões de texto com área de toque de 44 px (`footer.css`, `buttons.css`); rótulos de formulário com 12 px (`forms.css`); desenho lateral do hero centralizado e inteiro (`hero.css`: `.vertentes{left:auto}`).
- **Home:** rodapé empilhado (o botão saía da tela); Encaixe vira faixa deslizante com pontos; Recorte vira etiquetas de resultado + só as frentes do resultado escolhido (`SecaoDoisLados.jsx`); News com opções compactas e a prévia da caixa de entrada logo abaixo das opções (`SecaoNewsletter.jsx`); textos mínimos de 12 px.
- **O que fazemos:** corrigida a rolagem lateral (o brilho do painel do diagnóstico passava da borda); textos de 12 px.
- **A Emcomjunto:** seção Time oculta no celular, por enquanto; textos de 12 px.
- **Varejo / Blog:** textos de 12 px e áreas de toque.
- **Pesquisa clínica (Random):** véu escuro no hero para contraste; "O porquê" em sanfona; vitrine vira faixa de capas sem iframes (o conteúdo vivo abre só no visualizador, ao tocar); Soluções e Estudos de caso em faixa deslizante com pontos; bandeiras e menu com área de toque maior; textos de 12 px.

## Não alterado (a pedido)
- Avisos de rascunho (frases do time, caixas de logo vazias): o desenvolvedor vai tratar.
- Newsletters no formulário de contato da home e tamanho desse formulário.
