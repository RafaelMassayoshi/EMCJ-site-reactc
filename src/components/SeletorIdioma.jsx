import { useEffect, useState } from 'react'

/* ==========================================================================
   Seletor de idioma da página Pesquisa clínica (Random): bandeiras do
   Brasil, EUA e Espanha no menu. A tradução é automática, pelo widget do
   Google Tradutor (tradução de máquina).

   Como funciona: o clique grava o cookie "googtrans" (/pt/en ou /pt/es) e
   recarrega a página; na carga, se o cookie existir, o script do Google é
   injetado e traduz a página. A bandeira do Brasil apaga o cookie e volta
   ao original. O banner do Google é escondido no CSS (pesquisa-clinica-v7.css).

   Proteção para React: o Google troca nós de texto por <font>, o que pode
   quebrar atualizações do React ("removeChild"/"insertBefore"). Com a
   tradução ativa, aplicamos o contorno conhecido (facebook/react#11538)
   que ignora essas operações em nós que já não pertencem ao pai.
   ========================================================================== */

const IDIOMAS = [
  { cod: 'pt', rotulo: 'Português', bandeira: (
    <svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#009B3A" /><path d="M14 3 25 10 14 17 3 10z" fill="#FEDF00" /><circle cx="14" cy="10" r="4.2" fill="#002776" /></svg>
  ) },
  { cod: 'en', rotulo: 'English', bandeira: (
    <svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((k) => <rect key={k} y={k * (20 / 13)} width="28" height={20 / 13} fill="#B22234" />)}
      <rect width="12.5" height={20 / 13 * 7} fill="#3C3B6E" /></svg>
  ) },
  { cod: 'es', rotulo: 'Español', bandeira: (
    <svg viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="3" fill="#AA151B" /><rect y="5" width="28" height="10" fill="#F1BF00" /></svg>
  ) },
]

export function idiomaAtual() {
  if (typeof document === 'undefined') return 'pt'
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/pt\/(\w+)/)
  return m && m[1] !== 'pt' ? m[1] : 'pt'
}

function gravarCookie(valor) {
  const expira = valor ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  const v = valor ? `/pt/${valor}` : ''
  document.cookie = `googtrans=${v}; path=/${expira}`
  const host = window.location.hostname
  if (host && host.includes('.')) {
    document.cookie = `googtrans=${v}; path=/; domain=.${host.replace(/^www\./, '')}${expira}`
  }
}

function protegerReact() {
  if (window.__protecaoTraducao) return
  window.__protecaoTraducao = true
  const remover = Node.prototype.removeChild
  Node.prototype.removeChild = function (filho) {
    if (filho.parentNode !== this) return filho
    return remover.call(this, filho)
  }
  const inserir = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (novo, ref) {
    if (ref && ref.parentNode !== this) return novo
    return inserir.call(this, novo, ref)
  }
}

export default function SeletorIdioma() {
  const [atual] = useState(idiomaAtual)

  useEffect(() => {
    if (atual === 'pt' || document.getElementById('gt-script')) return
    protegerReact()
    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        { pageLanguage: 'pt', includedLanguages: 'en,es', autoDisplay: false },
        'google_translate_element',
      )
    }
    const s = document.createElement('script')
    s.id = 'gt-script'
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    s.async = true
    document.body.appendChild(s)
  }, [atual])

  function escolher(cod) {
    if (cod === atual) return
    gravarCookie(cod === 'pt' ? '' : cod)
    window.location.reload()
  }

  return (
    <div className="idiomas notranslate" translate="no" role="group" aria-label="Idioma da página">
      {IDIOMAS.map((i) => (
        <button key={i.cod} type="button" className={'idioma' + (atual === i.cod ? ' on' : '')} aria-pressed={atual === i.cod}
          aria-label={i.rotulo} title={i.rotulo} onClick={() => escolher(i.cod)}>
          {i.bandeira}
        </button>
      ))}
      <div id="google_translate_element" hidden />
    </div>
  )
}
