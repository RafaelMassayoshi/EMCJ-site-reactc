/* Porta de js/components/esteira.js: gera os slots de logo e duplica a
   fita para o loop sem emenda. Usada em A Emcomjunto ("Empresas clientes");
   a home tinha essa seção comentada (desativada) no HTML original e a
   varejo não usa esteira — nenhuma das duas renderiza este componente. */
export default function Esteira({ count = 9, label = 'Empresas parceiras' }) {
  const slots = Array.from({ length: count }, (_, i) => (
    <div className="slot-logo" key={i}>
      <span>Logo {i + 1}</span>
    </div>
  ))

  return (
    <div className="esteira" aria-label={label}>
      <div className="esteira-fita" id="fitaLogos" aria-hidden="true">
        {slots}
        {slots.map((s, i) => (
          <div className="slot-logo" key={'dup-' + i}>
            <span>Logo {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
