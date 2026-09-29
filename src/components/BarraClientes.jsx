import { useEffect, useState } from 'react'

/* ==========================================================================
   Barra logo abaixo do hero da home, subindo sobre a borda inferior dele:
   rótulo "Empresas que confiam em nossa representação" + esteira de logos
   em loop + números da EMCJ se revezando. Estilos em styles/pages/home.css
   (prefixo .barra-clientes).
   ========================================================================== */

/* TODO(dev): trocar os nomes em texto pelos arquivos de logo reais
   (SVG ou PNG monocromático em /public/assets/logos/), mantendo `nome`
   como alt. Enquanto o arquivo não existir, o nome aparece como texto.
   Gmar Ambiental: exibir só com autorização confirmada da empresa. */
const CLIENTES = [
  { nome: 'CEMEC', estilo: 'peso' },
  { nome: 'CEPHO', estilo: 'peso' },
  { nome: 'CEON+', estilo: 'leve' },
  { nome: 'Placar', estilo: 'peso' },
  { nome: 'Gmar Ambiental', estilo: 'duas' },
  { nome: 'MMC Saúde', estilo: 'duas' },
]

/* Só números de operação real, com fonte no posicionamento da EMCJ:
   800/mês = volume médio da operação (mesmo número do bloco Combinação);
   25 centros = igual nas duas fontes internas de pesquisa clínica;
   4.500 leads em 28 meses = Neoband, ago/2022 a dez/2024. */
const NUMEROS = [
  { valor: '800', rotulo: 'oportunidades de vendas todos os meses' },
  { valor: '25', rotulo: 'centros de pesquisa clínica assessorados' },
  { valor: '4.500', rotulo: 'leads em 28 meses numa operação de varejo' },
]

function Logo({ nome, estilo }) {
  if (estilo === 'duas') {
    const [a, ...b] = nome.split(' ')
    return (
      <span className="bc-logo bc-logo--duas">
        <b>{a}</b>
        <span>{b.join(' ')}</span>
      </span>
    )
  }
  return <span className={'bc-logo bc-logo--' + estilo}>{nome}</span>
}

export default function BarraClientes() {
  const [atual, setAtual] = useState(0)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    if (pausado) return undefined
    const id = setInterval(() => setAtual((i) => (i + 1) % NUMEROS.length), 3800)
    return () => clearInterval(id)
  }, [pausado])

  const fita = [...CLIENTES, ...CLIENTES]

  return (
    <div className="barra-clientes-envoltorio">
      <div className="shell">
        <div className="barra-clientes rv">
          <p className="bc-rotulo">Empresas que confiam em nossa representação</p>

          <div className="bc-esteira" aria-label="Clientes da Emcomjunto">
            <ul className="bc-sr">
              {CLIENTES.map((c) => (
                <li key={c.nome}>{c.nome}</li>
              ))}
            </ul>
            <div className="bc-fita" aria-hidden="true">
              {fita.map((c, i) => (
                <Logo key={c.nome + i} {...c} />
              ))}
            </div>
          </div>

          <div
            className="bc-numeros"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
          >
            <ul className="bc-sr">
              {NUMEROS.map((n) => (
                <li key={n.valor}>Mais de {n.valor} {n.rotulo}</li>
              ))}
            </ul>
            <div className="bc-palco" aria-hidden="true">
              {NUMEROS.map((n, i) => (
                <p key={n.valor} className={'bc-num' + (i === atual ? ' ativo' : '')}>
                  <span className="bc-valor"><small>+ de</small> {n.valor}</span>
                  <span className="bc-num-rotulo">{n.rotulo}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
