import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'
import useReveal from '../hooks/useReveal.js'
import * as WP from '../services/wordpress.js'

import '../styles/components/buttons.css'
import '../styles/components/nav.css'
import '../styles/components/hero.css'
import '../styles/components/cards.css'
import '../styles/components/esteira.css'
import '../styles/components/forms.css'
import '../styles/components/footer.css'
import '../styles/pages/blog.css'

/* ==========================================================================
   BLOG — busca posts reais da API REST do WordPress (emcomjunto.com.br),
   igual ao site estático original (js/pages/blog.js + js/components/wp-api.js).
   Cada bloco (corredor, destaque, quente, faixas, arquivo) virou uma função
   de render que lê o mesmo estado (posts/categorias/tags) em vez de montar
   innerHTML manualmente — o resultado visual e as regras de negócio (o que
   entra em cada bloco, ordenação, filtros) são as mesmas.
   ========================================================================== */

function CorredorItens({ posts }) {
  if (!posts) return <span className="corredor-item">Carregando as últimas publicações…</span>
  if (!posts.length) return <span className="corredor-item">Sem publicações no momento.</span>
  return posts.slice(0, 6).map((p) => {
    const cat = WP.categoriaDoPost(p)
    const tema = WP.temaDaCategoria(cat)
    return (
      <a className="corredor-item" href={WP.linkDoPost(p)} style={{ '--tema': tema }} key={p.id}>
        <span className="ed-nome">{cat ? cat.name : 'Emcomjunto'}</span>
        {WP.textoLimpo(p.title.rendered)}
      </a>
    )
  })
}

// .corredor-fita anima translateX(0 → -50%) em loop; para o loop ficar sem
// emenda ela precisa conter duas cópias idênticas dos itens lado a lado
// (mesma técnica de js/components/esteira.js) — por isso duas
// .corredor-grupo, a segunda marcada aria-hidden.
function Corredor({ posts }) {
  return (
    <>
      <div className="corredor-grupo" id="corredorGrupo">
        <CorredorItens posts={posts} />
      </div>
      <div className="corredor-grupo" aria-hidden="true">
        <CorredorItens posts={posts} />
      </div>
    </>
  )
}

function Meta({ post, comData, dataRelativa, comLeitura, leituraExtenso }) {
  const cat = WP.categoriaDoPost(post)
  const tema = WP.temaDaCategoria(cat)
  return (
    <p className="post-meta" style={{ '--tema': tema }}>
      <span className="ed-nome">{cat ? cat.name : 'Emcomjunto'}</span>
      {comData !== false && (
        <>
          <span className="ponto" aria-hidden="true"></span>
          <span>{dataRelativa ? WP.dataRelativa(post.date) : WP.dataExtenso(post.date)}</span>
        </>
      )}
      {comLeitura && (
        <>
          <span className="ponto" aria-hidden="true"></span>
          <span>{WP.minutosLeitura(post.content?.rendered)} min{leituraExtenso ? ' de leitura' : ''}</span>
        </>
      )}
    </p>
  )
}

function Arte({ post, classeExtra, tamanho }) {
  const cat = WP.categoriaDoPost(post)
  const tema = WP.temaDaCategoria(cat)
  const img = WP.imagemDestacada(post, tamanho || 'medium_large')
  return (
    <div className={'arte' + (classeExtra ? ' ' + classeExtra : '')} style={{ '--tema': tema }}>
      <span className="sinal" aria-hidden="true"></span>
      {img ? <img src={img} alt="" loading="lazy" /> : <span className="marcador-img">{post.title.rendered || ''}</span>}
    </div>
  )
}

function Destaque({ destaque, recentes }) {
  if (destaque === undefined) return <p className="blog-carregando rv">Carregando o destaque da semana…</p>
  if (!destaque) return <p className="blog-vazio rv">Nenhuma publicação encontrada ainda.</p>

  return (
    <>
      <a className="manchete rv" href={WP.linkDoPost(destaque)}>
        <Arte post={destaque} classeExtra="arte--alta" tamanho="large" />
        <div className="manchete-corpo">
          <span className="selo">{destaque.sticky ? 'Fixado pela redação' : 'Publicação mais recente'}</span>
          <h2>{WP.textoLimpo(destaque.title.rendered)}</h2>
          <p className="resumo">{WP.textoLimpo(destaque.excerpt.rendered)}</p>
          <Meta post={destaque} comLeitura leituraExtenso />
          <span className="blog-link">Ler a matéria <span className="seta">→</span></span>
        </div>
      </a>
      {recentes.length > 0 && (
        <aside className="maislidos rv" aria-label="Publicações recentes">
          <p className="kicker">Recentes</p>
          <ol className="ml-lista">
            {recentes.slice(0, 5).map((p, i) => (
              <li className="ml-item" key={p.id}>
                <span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <a href={WP.linkDoPost(p)}>{WP.textoLimpo(p.title.rendered)}</a>
                  <Meta post={p} comData={false} />
                </div>
              </li>
            ))}
          </ol>
        </aside>
      )}
    </>
  )
}

function Quente({ comImagem, semImagem }) {
  if (comImagem === undefined) return <p className="blog-carregando rv">Carregando publicações recentes…</p>
  if (!comImagem.length && !semImagem.length) return <p className="blog-vazio rv">Nenhuma publicação recente.</p>

  return (
    <>
      {comImagem.slice(0, 2).map((p) => (
        <a className="post-card rv" href={WP.linkDoPost(p)} key={p.id}>
          <Arte post={p} classeExtra="arte--claro" />
          <div className="post-card-corpo">
            <h3>{WP.textoLimpo(p.title.rendered)}</h3>
            <p className="resumo">{WP.textoLimpo(p.excerpt.rendered)}</p>
            <Meta post={p} dataRelativa comLeitura />
          </div>
        </a>
      ))}
      {semImagem.length > 0 && (
        <aside className="ultimas rv" aria-labelledby="tit-ultimas">
          <h3 id="tit-ultimas">Últimas</h3>
          <ol>
            {semImagem.slice(0, 5).map((p) => (
              <li key={p.id}>
                <a href={WP.linkDoPost(p)}>{WP.textoLimpo(p.title.rendered)}</a>
                <Meta post={p} dataRelativa />
              </li>
            ))}
          </ol>
        </aside>
      )}
    </>
  )
}

function Faixas({ categorias, posts }) {
  if (!categorias || !posts) return <p className="blog-carregando rv">Carregando por editoria…</p>

  const faixas = categorias
    .map((cat) => ({ cat, posts: posts.filter((p) => p.categories.includes(cat.id)) }))
    .filter((f) => f.posts.length > 0)
    .slice(0, 4)

  if (!faixas.length) return <p className="blog-vazio rv">Nenhuma editoria com publicações no momento.</p>

  return faixas.map((f) => {
    const tema = WP.temaDaCategoria(f.cat)
    const principal = f.posts[0]
    const demais = f.posts.slice(1, 4)
    return (
      <article className="faixa rv" id={'faixa-' + f.cat.slug} style={{ '--tema': tema }} key={f.cat.id}>
        <div className="faixa-cab">
          <div>
            <h3>{f.cat.name}</h3>
            <p className="faixa-sub">{f.cat.description ? WP.textoLimpo(f.cat.description) : f.posts.length + ' publicações nesta editoria.'}</p>
          </div>
          <a className="blog-link" href={f.cat.link}>Ver a editoria <span className="seta">→</span></a>
        </div>
        <div className="faixa-grade">
          <a className="cartao post-fx" href={WP.linkDoPost(principal)} style={{ '--glow': tema }}>
            <span className="borrao deriva-1" aria-hidden="true"><i></i></span>
            <Arte post={principal} />
            <div className="post-fx-corpo">
              <h4>{WP.textoLimpo(principal.title.rendered)}</h4>
              <p className="resumo">{WP.textoLimpo(principal.excerpt.rendered)}</p>
              <Meta post={principal} />
            </div>
          </a>
          {demais.length > 0 && (
            <ul className="faixa-lista">
              {demais.map((p) => (
                <li key={p.id}>
                  <a href={WP.linkDoPost(p)}>{WP.textoLimpo(p.title.rendered)}</a>
                  <Meta post={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    )
  })
}

function ListaSimples({ titulo, posts }) {
  if (!posts.length) return <p className="blog-vazio rv">Nenhuma publicação encontrada.</p>
  return (
    <aside className="ultimas rv" style={{ borderTop: 0 }}>
      <ol>
        {posts.map((p) => (
          <li key={p.id}>
            <a href={WP.linkDoPost(p)}>{WP.textoLimpo(p.title.rendered)}</a>
            <Meta post={p} comLeitura />
          </li>
        ))}
      </ol>
    </aside>
  )
}

export default function Blog() {
  useDocumentMeta({
    title: 'Blog — Emcomjunto',
    description: 'O que a operação comercial está aprendendo em campo. Leituras de mercado, método e prática em pesquisa clínica, varejo, ESG e outros mercados B2B.',
    canonical: 'https://emcomjunto.com.br/blog',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const termoBusca = searchParams.get('s') || ''
  const mesFiltro = searchParams.get('m') || ''

  const [posts, setPosts] = useState()
  const [categorias, setCategorias] = useState()
  const [tags, setTags] = useState()
  const [resultadosBusca, setResultadosBusca] = useState()
  const [erro, setErro] = useState(false)
  const [buscaInput, setBuscaInput] = useState(termoBusca)

  useEffect(() => {
    setErro(false)
    Promise.all([WP.getPosts({ per_page: 30 }), WP.getCategories(), WP.getTags()])
      .then(([p, c, t]) => {
        setPosts(p)
        setCategorias(c.filter((cat) => cat.count > 0 && cat.slug !== 'uncategorized' && cat.slug !== 'sobre-o-portal'))
        setTags(t)
      })
      .catch((err) => {
        setErro(true)
        if (window.console) console.error('Blog (WordPress):', err)
      })
  }, [])

  useEffect(() => {
    if (!termoBusca) {
      setResultadosBusca(undefined)
      return
    }
    let cancelado = false
    WP.getPosts({ search: termoBusca, per_page: 20 }).then((res) => {
      if (!cancelado) setResultadosBusca(res)
    })
    return () => {
      cancelado = true
    }
  }, [termoBusca])

  useReveal([posts, categorias, tags, resultadosBusca, mesFiltro])

  function aoBuscar(e) {
    e.preventDefault()
    const params = {}
    if (buscaInput) params.s = buscaInput
    setSearchParams(params)
  }

  function aoIrParaMes(e) {
    e.preventDefault()
    const valor = new FormData(e.currentTarget).get('m')
    navigate(valor ? '/blog?m=' + valor : '/blog')
  }

  if (erro) {
    return (
      <MainLayout pageClassName="pagina-blog" headerProps={{ currentLink: 'blog', ctaHref: '/o-que-fazemos#contato' }} footerProps={{}}>
        <section className="secao bloco claro fundo-branco">
          <div className="shell" style={{ paddingBlock: 80 }}>
            <p className="blog-erro">Não foi possível carregar as publicações agora. Tente novamente em instantes.</p>
          </div>
        </section>
      </MainLayout>
    )
  }

  // ---------- Meses disponíveis para o seletor "Ir para o mês" ----------
  const meses = []
  const vistos = {}
  ;(posts || []).forEach((p) => {
    const d = new Date(p.date)
    if (isNaN(d)) return
    const chave = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0')
    if (vistos[chave]) return
    vistos[chave] = true
    const rotulo = WP.dataExtenso(p.date).replace(/^\d+ de /, '')
    meses.push({ valor: chave, rotulo: rotulo.charAt(0).toUpperCase() + rotulo.slice(1) })
  })
  meses.sort((a, b) => b.valor.localeCompare(a.valor))

  const tagsComPosts = (tags || []).filter((t) => t.count > 0).slice(0, 14)

  // ---------- Modo mês (?m=) ----------
  const postsDoMes = mesFiltro && /^\d{6}$/.test(mesFiltro) && posts
    ? posts.filter((p) => {
        const d = new Date(p.date)
        const chave = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0')
        return chave === mesFiltro
      })
    : null

  // ---------- Modo padrão ----------
  let destaque, restantes
  if (posts && !termoBusca && !postsDoMes) {
    destaque = posts.filter((p) => p.sticky)[0] || posts[0] || null
    restantes = posts.filter((p) => p !== destaque)
  }

  const editoriasPills = (() => {
    if (!categorias || !posts) return null
    const faixas = categorias
      .map((cat) => ({ cat, posts: posts.filter((p) => p.categories.includes(cat.id)) }))
      .filter((f) => f.posts.length > 0)
      .slice(0, 4)
    return (
      <>
        <li><a className="ed" href="#topo">Tudo</a></li>
        {faixas.map((f) => (
          <li key={f.cat.id}><a className="ed" href={'#faixa-' + f.cat.slug} style={{ '--tema': WP.temaDaCategoria(f.cat) }}>{f.cat.name}</a></li>
        ))}
        <li><a className="ed" href="#arquivo" style={{ '--tema': '#40A0E7' }}>Arquivo</a></li>
      </>
    )
  })()

  return (
    <MainLayout pageClassName="pagina-blog" headerProps={{ currentLink: 'blog', ctaHref: '/o-que-fazemos#contato' }} footerProps={{}}>
      {/* ============================= CORREDOR DE NOTÍCIAS ============================= */}
      <div className="corredor-topo">
        <div className="corredor">
          <p className="corredor-rotulo"><span className="corredor-ponto" aria-hidden="true"></span>No radar</p>
          <div className="corredor-janela">
            <div className="corredor-fita" id="corredorFita">
              <Corredor posts={posts} />
            </div>
          </div>
        </div>
      </div>

      {/* ============================= HERO · MANCHETE DA SEMANA ============================= */}
      <section className="hero secao hero--blog" id="topo">
        <div className="hero-brilho" id="heroBrilho" aria-hidden="true"></div>
        <div className="hero-scrim" aria-hidden="true"></div>

        <div className="shell hero-conteudo">
          <div className="blog-cab">
            <p className="kicker rv">Blog · Emcomjunto</p>
            <div className="filete rv"></div>
            <h1 className="d40 rv">O que a operação comercial está <span className="ac ac53">aprendendo em campo.</span></h1>
          </div>

          <div className="destaque" id="blogDestaque">
            {termoBusca ? (
              <p className="blog-vazio rv">{'Resultados para "' + termoBusca + '"' + (resultadosBusca ? ' (' + resultadosBusca.length + ')' : '')}</p>
            ) : postsDoMes ? (
              <p className="blog-vazio rv">Publicações do mês selecionado</p>
            ) : (
              <Destaque destaque={destaque} recentes={restantes || []} />
            )}
          </div>
        </div>
      </section>

      {/* ============================= MENU DO BLOG ============================= */}
      <nav className="blog-nav" id="blogNav" aria-label="Editorias do blog">
        <div className="shell blog-nav-in">
          <ul className="editorias" id="blogEditorias">
            {editoriasPills || (
              <>
                <li><a className="ed" href="#topo">Tudo</a></li>
                <li><a className="ed" href="#arquivo" style={{ '--tema': '#40A0E7' }}>Arquivo</a></li>
              </>
            )}
          </ul>
          <form className="busca" role="search" onSubmit={aoBuscar}>
            <label className="pular" htmlFor="q">Buscar no blog</label>
            <input id="q" name="s" type="search" placeholder="Buscar por tema ou mercado" value={buscaInput} onChange={(e) => setBuscaInput(e.target.value)} />
            <button type="submit" aria-label="Buscar">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.6" /><path d="m10.6 10.6 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </form>
        </div>
      </nav>

      {/* ============================= → ENQUANTO ESTÁ QUENTE ============================= */}
      <section className="secao bloco claro fundo-branco" id="quente">
        <div className="shell">
          <div className="cab-solo rv">
            <h2 className="d56" id="quenteTitulo">Não perca <span className="ac ac74">enquanto está quente.</span></h2>
          </div>

          <div className="quente" id="blogQuente" style={termoBusca || postsDoMes ? { gridTemplateColumns: '1fr' } : undefined}>
            {termoBusca ? (
              <ListaSimples posts={resultadosBusca || []} />
            ) : postsDoMes ? (
              <ListaSimples posts={postsDoMes} />
            ) : (
              <Quente comImagem={restantes && restantes.filter((p) => WP.imagemDestacada(p))} semImagem={restantes} />
            )}
          </div>
        </div>
      </section>

      {/* ============================= ∪ POR MERCADO ============================= */}
      {!termoBusca && (
        <section className="secao bloco escuro fundo-escuro" id="mercados">
          <div className="shell">
            <div className="cab-solo rv">
              <h2 className="d56">Cada mercado tem <span className="ac ac74">a sua própria conversa.</span></h2>
            </div>

            <div className="faixas" id="blogFaixas">
              <Faixas categorias={categorias} posts={posts} />
            </div>
          </div>
        </section>
      )}

      {/* ============================= ƒ ARQUIVO ============================= */}
      <section className="secao bloco claro fundo-cinza" id="arquivo">
        <div className="shell">
          <div className="cab2 rv">
            <h2 className="d56">Entra um tema, <span className="ac ac74">sai uma leitura.</span></h2>
            <p className="lead apoio">Todo o arquivo organizado por assunto. Se você chegou atrás de uma coisa específica, comece por aqui.</p>
          </div>

          <div className="temas esc" id="blogTemas">
            {tags === undefined ? null : tagsComPosts.length ? (
              tagsComPosts.map((t) => (
                <a className="tema" href={t.link} key={t.id}>{t.name}</a>
              ))
            ) : (
              <p className="blog-vazio">Sem tags publicadas ainda.</p>
            )}
          </div>

          <div className="arquivo-pe rv">
            <form className="arquivo-mes" onSubmit={aoIrParaMes}>
              <label htmlFor="mes">Ir para o mês</label>
              <select id="mes" name="m" defaultValue={mesFiltro}>
                <option value="">Selecione</option>
                {meses.map((m) => (
                  <option value={m.valor} key={m.valor}>{m.rotulo}</option>
                ))}
              </select>
              <button className="btn-mes" type="submit">Ir</button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
