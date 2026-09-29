/* ==========================================================================
   Espaço de imagem dos cartões de mercado da home (seção ∩ · Encaixe).

   Enquanto não houver foto, desenha uma ilustração em traço sobre o degradê
   da cor do mercado. Para usar foto, passe `imagem` (ex.:
   imagem="/assets/images/mercado-varejo.jpg", 16:9, mín. 800px de largura):
   a foto entra no lugar da ilustração com o mesmo recorte e o mesmo véu.
   Estilos em styles/pages/home.css (prefixo .mercado-arte).
   ========================================================================== */

function Varejo() {
  return (
    <g>
      {/* gôndola: três prateleiras com produtos */}
      <path d="M44 34v112M276 34v112" />
      <path d="M44 62h232M44 102h232M44 142h232" />
      <g className="ma-cheio">
        <rect x="58" y="40" width="22" height="22" rx="3" /><rect x="86" y="46" width="16" height="16" rx="3" />
        <rect x="108" y="36" width="26" height="26" rx="3" /><rect x="140" y="44" width="18" height="18" rx="3" />
        <rect x="200" y="42" width="20" height="20" rx="3" /><rect x="226" y="38" width="30" height="24" rx="3" />
        <rect x="58" y="80" width="30" height="22" rx="3" /><rect x="94" y="86" width="20" height="16" rx="3" />
        <rect x="150" y="78" width="24" height="24" rx="3" /><rect x="180" y="84" width="26" height="18" rx="3" />
        <rect x="236" y="80" width="22" height="22" rx="3" />
        <rect x="64" y="120" width="24" height="22" rx="3" /><rect x="120" y="116" width="30" height="26" rx="3" />
        <rect x="190" y="122" width="18" height="20" rx="3" /><rect x="214" y="118" width="34" height="24" rx="3" />
      </g>
      {/* etiqueta de preço destacada */}
      <g className="ma-destaque">
        <path d="M166 38h24l8 12-8 12h-24z" />
        <circle cx="173" cy="50" r="2.4" />
      </g>
    </g>
  )
}

function Esg() {
  return (
    <g>
      {/* tanques de tratamento, tubulação e ondas */}
      <rect x="40" y="70" width="70" height="66" rx="8" />
      <rect x="126" y="54" width="70" height="82" rx="8" />
      <path d="M40 96c12-6 24 6 35 0s23 6 35 0M126 84c12-6 24 6 35 0s23 6 35 0" />
      <path d="M110 110h16M196 110h28v-40h30" />
      {/* folha */}
      <g className="ma-destaque">
        <path d="M252 30c-26 0-42 14-42 34 0 5 1 9 3 12l-7 7 3 3 7-7c4 2 8 3 12 3 20 0 24-22 24-52z" />
        <path d="M216 76c8-12 18-22 30-30" />
      </g>
      {/* gotas */}
      <g className="ma-cheio">
        <path d="M262 110c0 5-4 8-8 8s-8-3-8-8c0-6 8-14 8-14s8 8 8 14z" />
        <path d="M284 128c0 4-3 6-6 6s-6-2-6-6c0-4 6-10 6-10s6 6 6 10z" />
      </g>
    </g>
  )
}

function Pesquisa() {
  const nos = [[70, 60], [120, 36], [168, 70], [120, 108], [70, 124], [216, 40], [250, 96], [210, 130], [168, 142]]
  const arestas = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 0], [2, 5], [5, 6], [6, 2], [6, 7], [7, 3], [7, 8], [8, 3]]
  return (
    <g>
      {arestas.map(([a, b], i) => (
        <path key={i} d={`M${nos[a][0]} ${nos[a][1]}L${nos[b][0]} ${nos[b][1]}`} />
      ))}
      <g className="ma-cheio">
        {nos.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 2 ? 0 : 6} />)}
      </g>
      {/* nó central: a cruz */}
      <g className="ma-destaque">
        <circle cx="168" cy="70" r="16" />
        <path d="M168 62v16M160 70h16" />
      </g>
    </g>
  )
}

const DESENHOS = { varejo: Varejo, esg: Esg, pesquisa: Pesquisa }

export default function MercadoArte({ tipo, imagem, alt = '' }) {
  const Desenho = DESENHOS[tipo]
  return (
    <div className="mercado-arte">
      {imagem ? (
        <img src={imagem} alt={alt} loading="lazy" />
      ) : (
        <svg viewBox="0 0 320 170" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          {Desenho && <Desenho />}
        </svg>
      )}
    </div>
  )
}

/* Infográfico resumido do cartão: números da operação, com barra para os
   percentuais. `pct` (0–100) liga a barra. */
export function MercadoNumeros({ itens, fonte }) {
  return (
    <div className="mercado-nums">
      <dl>
        {itens.map((it) => (
          <div key={it.rotulo} className="mercado-num">
            <dt>{it.rotulo}</dt>
            <dd>
              {it.valor}
              {typeof it.pct === 'number' && (
                <span className="mercado-barra" aria-hidden="true"><i style={{ '--pct': it.pct + '%' }} /></span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {fonte && <p className="mercado-fonte">{fonte}</p>}
    </div>
  )
}
