import CLIENTES from '../data/clientesLogos.js'

/* Porta de js/components/esteira.js: gera os slots de logo e duplica a
   fita para o loop sem emenda. Usada em A Emcomjunto ("Empresas clientes")
   e na home ("Empresas parceiras"); varejo não usa esteira. */
export default function Esteira({ label = 'Empresas parceiras' }) {
  const slot = (c, key) => (
    <div className="slot-logo" key={key}>
      <img src={'/assets/images/clientes/' + c.arquivo} alt={c.nome} loading="lazy" />
    </div>
  )

  return (
    <div className="esteira" aria-label={label}>
      <div className="esteira-fita" id="fitaLogos" aria-hidden="true">
        {CLIENTES.map((c) => slot(c, c.nome))}
        {CLIENTES.map((c) => slot(c, 'dup-' + c.nome))}
      </div>
    </div>
  )
}
