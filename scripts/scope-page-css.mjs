/* ==========================================================================
   Ferramenta de uma vez só: escopa o CSS específico de cada página do site
   principal (home.css, a-emcomjunto.css, o-que-fazemos.css, varejo.css,
   blog.css, blog-post.css). No site estático original, cada um desses
   arquivos só era carregado (via <link>) na própria página, então um
   ":root{--marca-900:...}" ou um ".hero{background:...}" dentro de
   varejo.css, por exemplo, só podia afetar a página /varejo.

   Na SPA, como todo CSS é carregado no mesmo documento, isso vaza: o
   ":root" de varejo.css (que reaproveita os tokens --marca-* com uma
   paleta laranja/terracota só para aquela página) estava sobrescrevendo
   os tokens azuis usados pela home e por todas as outras páginas assim
   que o app carregava — bug real encontrado ao comparar screenshot a
   screenshot com o site original.

   Prefixa cada seletor com ".pagina-<slug> " e:
     - :root  -> .pagina-<slug>   (tokens passam a cascatear a partir do
       elemento que envolve a página inteira — ver MainLayout.jsx)
     - body   -> .pagina-<slug>   (esse wrapper cobre página inteira)
   Não altera nenhum valor — só o alcance das regras.
   ========================================================================== */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function transformSelector(selector, prefixClass) {
  return selector
    .split(',')
    .map((s) => s.trim())
    .map((s) => {
      if (s === ':root' || s === 'html' || s === 'body') return prefixClass
      if (s.startsWith('html ') || s.startsWith('body ')) return prefixClass + s.replace(/^(html|body)/, '')
      return prefixClass + ' ' + s
    })
    .join(',\n')
}

function scopeFile(relPath, prefixClass) {
  const filePath = path.join(__dirname, '..', relPath)
  const css = fs.readFileSync(filePath, 'utf8')
  const root = postcss.parse(css)

  root.walkRules((rule) => {
    const dentroDeKeyframes =
      rule.parent && rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)
    if (dentroDeKeyframes) return
    rule.selector = transformSelector(rule.selector, prefixClass)
  })

  fs.writeFileSync(filePath, root.toString())
  console.log('Escopado:', relPath, '->', prefixClass)
}

const ALVOS = [
  ['src/styles/pages/home.css', '.pagina-home'],
  ['src/styles/pages/a-emcomjunto.css', '.pagina-a-emcomjunto'],
  ['src/styles/pages/o-que-fazemos.css', '.pagina-o-que-fazemos'],
  ['src/styles/pages/varejo.css', '.pagina-varejo'],
  ['src/styles/pages/blog.css', '.pagina-blog'],
  ['src/styles/pages/blog-post.css', '.pagina-blog-post'],
]

for (const [relPath, prefixClass] of ALVOS) scopeFile(relPath, prefixClass)
