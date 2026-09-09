import { useState } from 'react'
import { Link } from 'react-router-dom'

/* Cabeçalho/nav compartilhado por todas as páginas (menos pesquisa-clinica,
   que tem seu próprio nav no mesmo arquivo — ver src/pages/PesquisaClinica.jsx).
   Réplica de <header class="nav" id="nav">. `currentLink` reproduz o
   aria-current="page" que cada HTML original grava no próprio link do menu.
   Links internos usam <Link> do react-router (navegação sem recarregar a
   página, essencial numa SPA); âncoras de página (#contato) continuam <a>
   simples para o navegador rolar até o elemento.

   NOTA: o HTML de o-que-fazemos.html original marca aria-current="page" no
   link "A Emcomjunto" em vez de "O que fazemos" (bug de copiar/colar da
   página a-emcomjunto.html). Preservamos esse comportamento tal como está —
   ver App.jsx, onde a página passa currentLink="a-emcomjunto". */
export default function Header({ currentLink, logoHref = '/', ctaHref = '#contato', ctaLabel = 'Diagnóstico' }) {
  const [aberto, setAberto] = useState(false)

  function alternarMenu() {
    const novo = !aberto
    setAberto(novo)
    document.body.style.overflow = novo ? 'hidden' : ''
  }

  function fecharMenu() {
    if (!aberto) return
    setAberto(false)
    document.body.style.overflow = ''
  }

  const Cta = ctaHref.startsWith('#') ? 'a' : Link
  const ctaProps = ctaHref.startsWith('#') ? { href: ctaHref } : { to: ctaHref }
  const Logo = logoHref.startsWith('#') ? 'a' : Link
  const logoProps = logoHref.startsWith('#') ? { href: logoHref } : { to: logoHref }

  return (
    <header className="nav" id="nav">
      <div className="shell">
        <Logo className="logo" aria-label="Início" {...logoProps}>
          <img className="logo-header logo-header--white" src="/assets/images/logo-header-white.png" alt="Logo" />
          <img className="logo-header logo-header--blue" src="/assets/images/logo-header-blue.png" alt="" />
        </Logo>

        <nav
          className={'nav-links' + (aberto ? ' aberto' : '')}
          id="navLinks"
          aria-label="Principal"
          onClick={(e) => {
            if (e.target.tagName === 'A') fecharMenu()
          }}
        >
          <Link to="/a-emcomjunto" aria-current={currentLink === 'a-emcomjunto' ? 'page' : undefined}>
            A Emcomjunto
          </Link>
          <Link to="/o-que-fazemos" aria-current={currentLink === 'o-que-fazemos' ? 'page' : undefined}>
            O que fazemos
          </Link>
          <div className="nav-item">
            <Link to="#">Quem assessoramos</Link>
            <svg className="chev" viewBox="0 0 12 8" fill="none" aria-hidden="true">
              <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="nav-sub">
              <Link to="/varejo" aria-current={currentLink === 'varejo' ? 'page' : undefined}>
                Varejo
                <small>Quem vende para o varejo: mercadoria, PDV, estoque e comunicação</small>
              </Link>
              <Link to="/pesquisa-clinica" aria-current={currentLink === 'pesquisa-clinica' ? 'page' : undefined}>
                Pesquisa clínica
                <small>Random · a marca da Emcomjunto em pesquisa clínica</small>
              </Link>
            </div>
          </div>
          <Link to="/blog" aria-current={currentLink === 'blog' ? 'page' : undefined}>
            Blog
          </Link>
        </nav>

        <button
          className="nav-btn"
          id="navBtn"
          aria-expanded={aberto}
          aria-controls="navLinks"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={alternarMenu}
        >
          <i></i>
        </button>

        <Cta className="btn btn--primario" {...ctaProps}>
          {ctaLabel}
        </Cta>
      </div>
    </header>
  )
}
