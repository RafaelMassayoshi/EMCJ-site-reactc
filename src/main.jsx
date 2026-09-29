import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Estilos globais (tokens, reset e utilitários) — carregados uma única vez
// para toda a aplicação, na mesma ordem dos <link> do site estático.
import './styles/variables.css'
import './styles/reset.css'
import './styles/global.css'

// Sem StrictMode: várias telas têm efeitos com rAF/setTimeout e observers
// manuais portados 1:1 do JS original (contadores, digitação, trilha SVG).
// O duplo-montagem do StrictMode em desenvolvimento causaria artefatos
// visuais só em dev (não afeta o build de produção), então optamos por
// não usá-lo para manter o comportamento sempre igual ao original.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
