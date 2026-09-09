/* ==========================================================================
   Ferramenta de uma vez só: escopa o CSS de pesquisa-clinica (que no site
   estático era uma página HTML totalmente separada, com seu próprio
   reset/tokens) para não vazar nem ser sobrescrito pelo CSS do resto do
   site agora que tudo vive no mesmo documento (SPA). Prefixa cada seletor
   com ".pagina-pesquisa-clinica " e:
     - :root  -> .pagina-pesquisa-clinica   (variáveis passam a cascatear
       a partir do elemento que envolve a página, em vez de :root global)
     - html   -> .pagina-pesquisa-clinica   (scroll-behavior é inofensivo
       num div; o valor real já vem do reset.css principal)
     - body   -> .pagina-pesquisa-clinica   (fundo/cor/fonte da página
       passam a valer no wrapper, que cobre a página toda)
     - dentro de @keyframes, os seletores (0%, 50%, from, to) NÃO são
       tocados — não são seletores de elemento, são nomes de quadro.
   Não altera nenhum valor (cor, medida, easing) — só o alcance das regras.
   Rodar de novo apenas se pesquisa-clinica.css for atualizado a partir do
   arquivo original. Não faz parte do build da aplicação. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PREFIX = '.pagina-pesquisa-clinica'

function transformSelector(selector) {
  return selector
    .split(',')
    .map((s) => s.trim())
    .map((s) => {
      if (s === ':root' || s === 'html' || s === 'body') return PREFIX
      if (s.startsWith('html ') || s.startsWith('body ')) return PREFIX + s.replace(/^(html|body)/, '')
      return PREFIX + ' ' + s
    })
    .join(',\n')
}

function scopeFile(path) {
  const css = fs.readFileSync(path, 'utf8')
  const root = postcss.parse(css)

  root.walkRules((rule) => {
    const dentroDeKeyframes =
      rule.parent && rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)
    if (dentroDeKeyframes) return
    rule.selector = transformSelector(rule.selector)
  })

  fs.writeFileSync(path, root.toString())
  console.log('Escopado:', path)
}

scopeFile(path.join(__dirname, '../src/styles/random/variables.css'))
scopeFile(path.join(__dirname, '../src/styles/random/pesquisa-clinica.css'))
