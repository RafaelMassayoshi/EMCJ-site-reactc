import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import LogoSprite from '../components/LogoSprite.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import useCoreScrollEffects from '../hooks/useCoreScrollEffects.js'

/* Layout usado por todas as páginas menos pesquisa-clinica (que tem seu
   próprio nav/rodapé e sistema visual isolado — ver PesquisaClinica.jsx).
   Reproduz o que era repetido em todo HTML original: o sprite de ícones,
   a barra de progresso de leitura (#barra) e o header/footer.

   Cada página importa <MainLayout> e passa headerProps/footerProps para
   configurar o link ativo do menu, o CTA do header e as variações do
   rodapé (ver comentários em Header.jsx e Footer.jsx) — por isso é um
   componente comum, não um layout de rota com <Outlet/>: o header/rodapé
   muda de conteúdo por página, só o comportamento (scroll, sprite) é
   realmente global.

   `pageClassName` (ex.: "pagina-home", "pagina-varejo") escopa o CSS
   específico de cada página (home.css, varejo.css etc.) — ver
   scripts/scope-page-css.mjs. No site estático cada uma dessas folhas só
   era carregada na própria página (documentos HTML separados); na SPA
   todo CSS carrega junto, então sem esse escopo o ":root" que varejo.css
   usa para retemperar --marca-* em tons de terracota, por exemplo,
   vazava e sobrescrevia a paleta azul do resto do site. O wrapper
   envolve header/rodapé também (não só o <main>) porque algumas dessas
   folhas de página recolorem elementos do nav/rodapé (ex.: varejo.css
   ajusta .nav-sub e .social:hover para o tom laranja da página). */
export default function MainLayout({ headerProps, footerProps, pageClassName, children }) {
  useCoreScrollEffects()

  const location = useLocation()
  useEffect(() => {
    // Troca de página numa SPA não rola a tela sozinha como uma navegação
    // completa faria. Reproduzimos isso: com hash, rola até o elemento
    // (ex.: /o-que-fazemos#contato vindo do rodapé/menu do blog); sem
    // hash, volta ao topo.
    if (location.hash) {
      const id = location.hash.slice(1)
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <div className={pageClassName}>
      <LogoSprite />
      <div className="progresso" aria-hidden="true">
        <i id="barra"></i>
      </div>
      <Header {...headerProps} />
      <main id="conteudo">{children}</main>
      <Footer {...footerProps} />
    </div>
  )
}
