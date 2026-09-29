import { Link } from 'react-router-dom'
import useFormWebhook from '../hooks/useFormWebhook.js'
import FormStatus from './FormStatus.jsx'

/* Rodapé compartilhado por todas as páginas menos pesquisa-clinica (que tem
   rodapé próprio dentro de PesquisaClinica.jsx). `topo` é o bloco de CTA
   "Criatividade para abrir caminho..." que só existe no rodapé da home.
   `newsletterHeading`/`newsletterSub` e `extraHidden` cobrem as pequenas
   variações de texto e campo oculto (pagina-origem) que a página de
   varejo usa no próprio formulário de newsletter. `semNewsletter` esconde o
   bloco de newsletter (a home tem uma seção própria de News). */
export default function Footer({
  topo = null,
  newsletterHeading = 'O que estamos aprendendo em campo, uma vez por mês.',
  newsletterSub = 'Leituras de mercado, testes que deram certo e os que não deram, e o que isso muda na prática comercial.',
  formName = 'newsletter',
  extraHidden = null,
  semNewsletter = false,
}) {
  const { status, handleSubmit } = useFormWebhook()

  return (
    <footer className="rodape escuro">
      <div className="shell">
        {topo && (
          <div className="rodape-topo">
            <h2 className="d56 rv">
              {topo.headingA} <span className="ac ac74">{topo.headingB}</span>
            </h2>
            <div className="rv">
              <p className="rodape-lead">{topo.lead}</p>
              <a className="btn btn--primario" href={topo.ctaHref}>
                {topo.ctaLabel}
              </a>
            </div>
          </div>
        )}

        {!semNewsletter && (
        <div className="newsletter rv">
          <div>
            <p className="kicker">Newsletter</p>
            <h3>{newsletterHeading}</h3>
            <p className="sub">{newsletterSub}</p>
          </div>

          <form name={formName} method="POST" data-netlify="true" netlify-honeypot="bot-news" onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value={formName} />
            {extraHidden && <input type="hidden" name={extraHidden.name} value={extraHidden.value} />}
            <p hidden>
              <label>
                Não preencha: <input name="bot-news" />
              </label>
            </p>

            <div className="news-campos">
              <div>
                <label className="pular" htmlFor="n-nome">Nome</label>
                <input id="n-nome" name="nome" type="text" autoComplete="name" required placeholder="Seu nome" />
              </div>
              <div>
                <label className="pular" htmlFor="n-email">E-mail</label>
                <input id="n-email" name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" />
              </div>
            </div>

            <label className="consenti">
              <input type="checkbox" name="consentimento" required />
              <span className="marca-cx" aria-hidden="true"></span>
              <span className="txt">
                Aceito receber os conteúdos da Emcomjunto por e-mail e autorizo o uso dos meus dados para essa
                finalidade. Dá para sair da lista a qualquer momento.
              </span>
            </label>

            <button className="btn btn--primario" type="submit">
              Quero assinar
              <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <FormStatus status={status} />
          </form>
        </div>
        )}

        <div className="rodape-grade">
          <div className="rodape-marca">
            <svg className="logo-pe" viewBox="0 0 150 121" role="img" aria-label="Emcomjunto">
              <use href="#emcj-logo" />
            </svg>
            <p>Assessoria Comercial Criativa. Marketing, tecnologia e vendas dentro do mesmo plano comercial.</p>
            <div className="sociais">
              <a className="social" href="https://www.instagram.com/emcomjunto" aria-label="Instagram da Emcomjunto" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a className="social" href="https://www.facebook.com/emcomjunto" aria-label="Facebook da Emcomjunto" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M14.5 8.5h2.2V5.4h-2.4c-2.4 0-3.9 1.5-3.9 4v2.1H8.2v3.1h2.2V21h3.2v-6.4h2.3l.4-3.1h-2.7V9.6c0-.8.3-1.1.9-1.1z" />
                </svg>
              </a>
              <a className="social" href="https://www.linkedin.com/company/emcomjunto" aria-label="LinkedIn da Emcomjunto" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.4 10.4V17M7.4 7.3v.1M11.4 17v-3.8c0-1.2.8-2.1 1.9-2.1s1.9.9 1.9 2.1V17" />
                </svg>
              </a>
            </div>
          </div>
          <div className="rodape-col">
            <p className="kicker">Modelo</p>
            <ul>
              <li><a href="/assessoria-comercial-criativa">Assessoria Comercial Criativa</a></li>
              <li><a href="/metodo">Método</a></li>
              <li><a href="/como-trabalhamos-juntos">Como trabalhamos juntos</a></li>
              <li><a href="/o-que-fica-com-voce">O que fica com você</a></li>
            </ul>
          </div>
          <div className="rodape-col">
            <p className="kicker">Mercados</p>
            <ul>
              <li><Link to="/varejo">Varejo</Link></li>
              <li><a href="/esg-eficiencia-riscos">ESG, eficiência e riscos</a></li>
              <li><Link to="/pesquisa-clinica">Pesquisa clínica</Link></li>
              <li><a href="/random-pesquisa">Random Pesquisa</a></li>
            </ul>
          </div>
          <div className="rodape-col">
            <p className="kicker">A Emcomjunto</p>
            <ul>
              <li><a href="/cases">Cases</a></li>
              <li><a href="/conteudo">Conteúdo</a></li>
              <li><a href="/sobre">Sobre</a></li>
              <li><a href="mailto:contato@emcomjunto.com.br">Falar com a gente</a></li>
            </ul>
          </div>
        </div>
        <p className="rodape-base">© 2026 Emcomjunto</p>
      </div>
    </footer>
  )
}
