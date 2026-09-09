import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AEmcomjunto from './pages/AEmcomjunto.jsx'
import OQueFazemos from './pages/OQueFazemos.jsx'
import Varejo from './pages/Varejo.jsx'
import PesquisaClinica from './pages/PesquisaClinica.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import NotFound from './pages/NotFound.jsx'

/* Rotas da aplicação, espelhando a estrutura de URLs do site estático
   original (cada pasta com index.html virou uma rota de mesmo nome).
   pesquisa-clinica.html não usava js/main.js nem o layout de header/rodapé
   compartilhado — por isso PesquisaClinica.jsx monta seu próprio
   header/rodapé em vez de usar MainLayout (ver esse arquivo). */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/a-emcomjunto" element={<AEmcomjunto />} />
      <Route path="/o-que-fazemos" element={<OQueFazemos />} />
      <Route path="/varejo" element={<Varejo />} />
      <Route path="/pesquisa-clinica" element={<PesquisaClinica />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-post" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
