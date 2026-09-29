import { useEffect } from 'react'

// Porta do trecho final de js/main.js: 200ms depois de montar, o Venn/grade
// do hero (#vertentes) ganha a classe "pronto" e começa a flutuar. Chamado
// pelas páginas cujo hero tem #vertentes (home, a-emcomjunto, varejo).
export default function useVertentesPronto() {
  useEffect(() => {
    const verts = document.getElementById('vertentes')
    if (!verts) return
    const t = setTimeout(() => verts.classList.add('pronto'), 200)
    return () => clearTimeout(t)
  }, [])
}
