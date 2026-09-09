/* ==========================================================================
   Porta 1:1 de js/components/wp-api.js — cliente mínimo para a REST API do
   WordPress em blog.emcomjunto.com.br, consumida pelas páginas Blog e
   BlogPost exatamente como no site estático (mesmo endpoint, mesmos campos,
   mesmas regras de apresentação: tema por categoria, data, minutos de
   leitura etc.). Nenhuma integração foi trocada nem inventada.
   ========================================================================== */
const BASE = 'https://blog.emcomjunto.com.br/wp-json/wp/v2'

const TEMA_POR_SLUG = {
  varejo: '#1F88D6',
  esg: '#B55D49',
  saude: '#9BD4F4',
  infraestrutura: '#40A0E7',
  risco: '#A63D25',
  negocios: '#206DA7',
  energia: '#80C0EF',
  efluentes: '#53A9EA',
}
const TEMA_PADRAO = '#40A0E7'

export function temaDaCategoria(cat) {
  if (!cat) return TEMA_PADRAO
  return TEMA_POR_SLUG[cat.slug] || TEMA_PADRAO
}

function toQuery(params) {
  return Object.keys(params || {})
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

function getJSON(url) {
  return fetch(url, { headers: { Accept: 'application/json' } }).then((r) => {
    if (!r.ok) throw new Error('WP REST API HTTP ' + r.status + ' em ' + url)
    return r.json()
  })
}

export function getPosts(params) {
  const q = toQuery({ _embed: 1, per_page: 20, ...(params || {}) })
  return getJSON(BASE + '/posts?' + q)
}

export function getPostBySlug(slug) {
  return getPosts({ slug, per_page: 1 }).then((lista) => lista[0] || null)
}

export function getCategories() {
  return getJSON(BASE + '/categories?per_page=100&orderby=count&order=desc')
}

export function getTags() {
  return getJSON(BASE + '/tags?per_page=40&orderby=count&order=desc')
}

export function textoLimpo(html) {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  const texto = (div.textContent || '').replace(/\s+/g, ' ').trim()
  return texto.replace(/\[&hellip;\]\s*$/, '…').replace(/…$/, '…')
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export function dataExtenso(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear()
}

export function dataRelativa(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return ''
  const diffMs = Date.now() - d.getTime()
  const horas = Math.floor(diffMs / 3600000)
  if (horas < 1) return 'agora há pouco'
  if (horas < 24) return 'há ' + horas + ' h'
  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'há 1 dia'
  if (dias < 30) return 'há ' + dias + ' dias'
  return dataExtenso(iso)
}

export function minutosLeitura(html) {
  const palavras = textoLimpo(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(palavras / 200))
}

export function categoriaDoPost(post) {
  const termos = (post._embedded && post._embedded['wp:term']) || []
  const categorias = (termos[0] || []).filter((t) => t.taxonomy === 'category')
  return (
    categorias.filter((c) => c.slug !== 'uncategorized' && c.slug !== 'sobre-o-portal')[0] ||
    categorias[0] ||
    null
  )
}

export function imagemDestacada(post, tamanho) {
  const media = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]
  if (!media) return null
  const sizes = media.media_details && media.media_details.sizes
  if (tamanho && sizes && sizes[tamanho]) return sizes[tamanho].source_url
  return media.source_url || null
}

export function linkDoPost(post) {
  return '/blog-post?post=' + encodeURIComponent(post.slug)
}
