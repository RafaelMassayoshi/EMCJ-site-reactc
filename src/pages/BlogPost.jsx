import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import useReveal from '../hooks/useReveal.js'
import * as WP from '../services/wordpress.js'

import '../styles/components/buttons.css'
import '../styles/components/nav.css'
import '../styles/components/hero.css'
import '../styles/components/cards.css'
import '../styles/components/esteira.css'
import '../styles/components/forms.css'
import '../styles/components/footer.css'
import '../styles/pages/blog-post.css'

/* ==========================================================================
   POST ÚNICO DO BLOG — lê ?post=<slug> na URL, busca o post na REST API do
   WordPress e preenche o artigo, igual a js/pages/blog-post.js. Também
   busca até 3 posts relacionados (mesma categoria) para "Continue lendo".
   ========================================================================== */
export default function BlogPost() {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('post')

  const [post, setPost] = useState()
  const [relacionados, setRelacionados] = useState([])
  const [naoEncontrado, setNaoEncontrado] = useState(false)

  useEffect(() => {
    document.title = 'Blog — Emcomjunto'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', 'Publicação do blog da Emcomjunto.')
    const canonicalTag = document.getElementById('canonicalTag')
    if (canonicalTag) canonicalTag.setAttribute('href', 'https://emcomjunto.com.br/blog-post')

    if (!slug) {
      setNaoEncontrado(true)
      return
    }

    setPost(undefined)
    setNaoEncontrado(false)
    setRelacionados([])

    WP.getPostBySlug(slug)
      .then((p) => {
        if (!p) {
          setNaoEncontrado(true)
          return
        }
        setPost(p)

        document.title = WP.textoLimpo(p.title.rendered) + ' — Blog Emcomjunto'
        if (metaDesc) metaDesc.setAttribute('content', WP.textoLimpo(p.excerpt.rendered).slice(0, 160))
        // A <link rel="canonical"> genérica aponta para /blog-post (o slug só
        // existe em runtime) — corrige para a URL exata deste post assim que
        // ele carrega, para não indexar todo post como se fosse a mesma página.
        if (canonicalTag) {
          canonicalTag.setAttribute('href', window.location.origin + '/blog-post?post=' + encodeURIComponent(p.slug))
        }

        const cat = WP.categoriaDoPost(p)
        if (cat) {
          WP.getPosts({ per_page: 4, categories: cat.id, exclude: p.id })
            .then((rel) => setRelacionados(rel.slice(0, 3)))
            .catch(() => {
              /* relacionados são um extra, falha silenciosa */
            })
        }
      })
      .catch((err) => {
        setNaoEncontrado(true)
        if (window.console) console.error('Post do blog (WordPress):', err)
      })
  }, [slug])

  useReveal([post, relacionados])

  return (
    <MainLayout pageClassName="pagina-blog-post" headerProps={{ currentLink: 'blog', ctaHref: '/o-que-fazemos#contato' }} footerProps={{}}>
      <section className="secao bloco claro fundo-branco post-secao" id="topo">
        <div className="shell post-shell">
          <nav className="post-volta" aria-label="Voltar">
            <Link to="/blog">← Voltar para o blog</Link>
          </nav>

          <article id="postArtigo">
            {naoEncontrado ? (
              <>
                <p className="blog-erro">Não encontramos essa publicação. Ela pode ter sido movida ou removida.</p>
                <p style={{ marginTop: 16 }}>
                  <Link className="btn btn--primario" to="/blog">Voltar para o blog</Link>
                </p>
              </>
            ) : !post ? (
              <p className="blog-carregando">Carregando publicação…</p>
            ) : (
              <PostConteudo post={post} />
            )}
          </article>

          <div className="post-newsletter-lembrete rv" id="postRelacionados" hidden={relacionados.length === 0}>
            <p className="kicker">Continue lendo</p>
            <ul className="post-relacionados-lista" id="postRelacionadosLista">
              {relacionados.map((p) => (
                <li key={p.id}>
                  <a href={'/blog-post?post=' + encodeURIComponent(p.slug)}>{WP.textoLimpo(p.title.rendered)}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

function PostConteudo({ post }) {
  const cat = WP.categoriaDoPost(post)
  const tema = WP.temaDaCategoria(cat)
  const img = WP.imagemDestacada(post, 'large')
  const autor = post._embedded && post._embedded.author && post._embedded.author[0]

  return (
    <>
      <header>
        <p className="post-meta-topo" style={{ '--tema': tema }}>
          <span className="ed-nome">{cat ? cat.name : 'Emcomjunto'}</span>
          <span className="ponto" aria-hidden="true"></span><span>{WP.dataExtenso(post.date)}</span>
          <span className="ponto" aria-hidden="true"></span><span>{WP.minutosLeitura(post.content.rendered)} min de leitura</span>
          {autor && (<><span className="ponto" aria-hidden="true"></span><span>{autor.name}</span></>)}
        </p>
        <h1 className="post-titulo">{WP.textoLimpo(post.title.rendered)}</h1>
      </header>
      {img && (
        <div className="post-arte">
          <img src={img} alt="" />
        </div>
      )}
      <div className="post-corpo" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <p className="post-fonte">
        Publicado originalmente em <a href={post.link}>emcomjunto.com.br</a>.
      </p>
    </>
  )
}
