import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'

/* Página 404. Não existe equivalente no site estático original (cada URL
   inexistente simplesmente não tinha arquivo); como a SPA precisa de algo
   para renderizar em qualquer rota não mapeada, criamos esta página mínima,
   sem inventar identidade visual nova além dos utilitários já existentes. */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Página não encontrada — Emcomjunto'
  }, [])

  return (
    <MainLayout headerProps={{ ctaHref: '#' }} footerProps={{}}>
      <section className="secao bloco claro fundo-branco">
        <div className="shell" style={{ paddingBlock: '80px', textAlign: 'center' }}>
          <h1 className="d56">Página não encontrada</h1>
          <p className="lead" style={{ marginTop: 16 }}>
            O endereço acessado não existe ou foi movido.
          </p>
          <p style={{ marginTop: 32 }}>
            <Link className="btn btn--primario" to="/">Voltar para o início</Link>
          </p>
        </div>
      </section>
    </MainLayout>
  )
}
