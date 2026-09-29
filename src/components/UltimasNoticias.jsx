import { useEffect, useState } from 'react'
import * as WP from '../services/wordpress.js'

/* ==========================================================================
   "Últimas do blog" no fim da home, antes do rodapé: os 3 posts mais
   recentes do WordPress (mesmo cliente da página /blog), em cartões com
   imagem, categoria, data, título, resumo e "Confira".
   Enquanto carrega, mostra 3 cartões-esqueleto. Se a API falhar ou não
   houver posts, a seção inteira some (a home não exibe erro).
   Estilos em styles/pages/home.css (prefixo .noticias).
   ========================================================================== */

function resumoCurto(html, max = 150) {
  const t = WP.textoLimpo(html)
  if (t.length <= max) return t
  return t.slice(0, t.lastIndexOf(' ', max)).replace(/[,.;:]$/, '') + '…'
}

export default function UltimasNoticias() {
  const [posts, setPosts] = useState(undefined)

  useEffect(() => {
    let vivo = true
    WP.getPosts({ per_page: 3 })
      .then((lista) => vivo && setPosts(Array.isArray(lista) ? lista : []))
      .catch(() => vivo && setPosts(null))
    return () => {
      vivo = false
    }
  }, [])

  if (posts === null || (Array.isArray(posts) && posts.length === 0)) return null

  return (
    <section className="secao bloco claro fundo-branco noticias" aria-labelledby="tit-noticias">
      <div className="shell">
        <div className="noticias-topo rv">
          <div>
            <p className="kicker">Blog</p>
            <h2 className="d40" id="tit-noticias">Últimas <span className="ac ac53">notícias.</span></h2>
          </div>
          <a className="btn btn--texto" href="/blog">Ver todas as publicações <span className="seta">→</span></a>
        </div>

        <div className="noticias-grade">
          {posts === undefined
            ? [0, 1, 2].map((i) => (
                <div className="noticia noticia--esqueleto" key={i} aria-hidden="true">
                  <div className="noticia-img" />
                  <div className="noticia-corpo"><i /><i /><i /><i /></div>
                </div>
              ))
            : posts.map((p) => {
                const cat = WP.categoriaDoPost(p)
                const img = WP.imagemDestacada(p, 'medium_large')
                return (
                  <a className="noticia" href={WP.linkDoPost(p)} key={p.id} style={{ '--tema': WP.temaDaCategoria(cat) }}>
                    <div className="noticia-img">
                      {img && <img src={img} alt="" loading="lazy" />}
                    </div>
                    <div className="noticia-corpo">
                      <p className="noticia-meta">
                        <span className="noticia-cat">{cat ? cat.name : 'Emcomjunto'}</span>
                        <span>{WP.dataExtenso(p.date)}</span>
                      </p>
                      <h3>{WP.textoLimpo(p.title.rendered)}</h3>
                      <p className="noticia-resumo">{resumoCurto(p.excerpt.rendered)}</p>
                      <span className="noticia-link">Confira <span className="seta">→</span></span>
                    </div>
                  </a>
                )
              })}
        </div>
      </div>
    </section>
  )
}
