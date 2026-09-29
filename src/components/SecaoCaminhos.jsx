/* ==========================================================================
   Seção ⊕ · Caminhos da home: três círculos que se sobrepõem.
   Caminho 1 (Mais vendas) e Caminho 2 (Vender melhor) nas pontas; o do
   meio é a soma dos dois. As sobreposições clareiam por mix-blend-mode,
   então a interseção aparece sozinha. Passar o mouse destaca um círculo.
   Estilos em styles/pages/home.css (prefixo .rota).
   ========================================================================== */

const CAMINHOS = [
  {
    id: 'vendas',
    rotulo: 'Caminho 1',
    titulo: 'Mais vendas.',
    apoio: 'Pilotar abordagens e canais',
    texto: 'Um caminho mais objetivo e simplificado para testar abordagens e canais. Nem sempre depende da sua marca para começar.',
  },
  {
    id: 'combinar',
    rotulo: '1 + 2',
    titulo: 'Combinar os dois caminhos.',
    apoio: 'Gerar demanda enquanto a base evolui',
    texto: 'A operação comercial roda e, ao mesmo tempo, o que ela aprende volta para a marca, o processo e os materiais.',
  },
  {
    id: 'melhor',
    rotulo: 'Caminho 2',
    titulo: 'Vender melhor.',
    apoio: 'Desenhar ou revisar processo, canal ou etapa de vendas',
    texto: 'Para projetos novos ou que precisam evoluir posicionamento, site, conteúdo, apresentações ou novos canais de aquisição.',
  },
]

export default function SecaoCaminhos() {
  return (
    <section className="secao bloco escuro fundo-escuro" id="tres-caminhos">
      <div className="shell">
        <div className="simbolo-linha rv">
          <span className="simbolo">⊕</span><span className="regua"></span><span className="kicker">Por onde começar</span>
        </div>
        <div className="rotas-topo">
          <h2 className="d56 rv">Como funciona em <span className="ac ac74">três caminhos.</span></h2>
          <p className="explica rv">Você escolhe por onde começar: acelerar as vendas, organizar a forma como vende ou fazer as duas coisas juntas.</p>
        </div>

        <ol className="rotas rv">
          {CAMINHOS.map((c) => (
            <li key={c.id} className={'rota rota--' + c.id}>
              <div className="rota-miolo">
                <p className="rota-rotulo">{c.rotulo}</p>
                <h3 className="rota-titulo">{c.titulo}</h3>
                <p className="rota-apoio">{c.apoio}</p>
                <p className="rota-texto">{c.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
