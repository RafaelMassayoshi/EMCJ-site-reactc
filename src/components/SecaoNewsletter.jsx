import { useState } from 'react'
import useFormWebhook from '../hooks/useFormWebhook.js'
import FormStatus from './FormStatus.jsx'
import useMedia from '../hooks/useMedia.js'

/* ==========================================================================
   Seção News da home (entre o formulário de contato e as últimas notícias).

   - Faixa com os assuntos rodando em loop, como um letreiro de notícias.
   - Esquerda: o texto da seção e uma "caixa de entrada" que se monta ao
     vivo conforme a pessoa escolhe as newsletters (cada escolha vira um
     e-mail na prévia).
   - Direita: as 7 newsletters em cartões selecionáveis, nome, e-mail,
     consentimento (obrigatório) e "Quero acompanhar".
   Envia pelo mesmo webhook do n8n (useFormWebhook), formulário
   "newsletter-home", campo "newsletters" com a lista escolhida.
   Estilos em styles/pages/home.css (prefixo .news-).
   ========================================================================== */

/* TODO(dev): criar a página /politica-de-privacidade (ou ajustar o link). */
const LINK_PRIVACIDADE = '/politica-de-privacidade'

const ASSUNTOS = ['Cases', 'Notícias comentadas', 'Tendências', 'Ferramentas', 'IA', 'Marketing', 'Vendas', 'Tecnologia',
  'Comunicação', 'Inovação', 'Boas práticas', 'Estudos e aprendizados de campo']

const LISTAS = [
  { n: '01', nome: 'Vendas & Marketing', cor: '#41AFFF', desc: 'Estratégias, canais, ferramentas, cases e aprendizados sobre geração de demanda e vendas.' },
  { n: '02', nome: 'B2B', cor: '#206DA7', desc: 'Marketing e vendas aplicados a negócios, relacionamento com contas e vendas complexas.' },
  { n: '03', nome: 'ESG & Energia', cor: '#B55D49', desc: 'Os mesmos temas vistos pela realidade de sustentabilidade, meio ambiente, energia e soluções técnicas.' },
  { n: '04', nome: 'Indústria', cor: '#80C0EF', desc: 'Marketing, vendas, tecnologia e geração de demanda aplicados ao mercado industrial.' },
  { n: '05', nome: 'Varejo', cor: '#1F88D6', desc: 'Vendas, marketing, trade, tecnologia e comportamento aplicados ao ecossistema do varejo.' },
  { n: '06', nome: 'SaaS & Tech', cor: '#53A9EA', desc: 'Go-to-market, growth, marketing, vendas e tecnologia para empresas de software e tecnologia.' },
  { n: '07', nome: 'Saúde & Pesquisa Clínica', cor: '#9BD4F4', desc: 'Marketing, comunicação, geração de demanda e recrutamento aplicados à saúde e à pesquisa clínica.' },
]

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.3l2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  )
}

export default function SecaoNewsletter() {
  const { status, handleSubmit } = useFormWebhook()
  const [escolhidas, setEscolhidas] = useState([])
  const [aviso, setAviso] = useState('')

  function alterna(nome) {
    setAviso('')
    setEscolhidas((atual) => (atual.includes(nome) ? atual.filter((x) => x !== nome) : [...atual, nome]))
  }

  function enviar(e) {
    if (!escolhidas.length) {
      e.preventDefault()
      setAviso('Escolha pelo menos uma newsletter.')
      return
    }
    handleSubmit(e)
    setEscolhidas([])
  }

  const caixa = LISTAS.filter((l) => escolhidas.includes(l.nome))

  const celular = useMedia('(max-width: 900px)')
  /* No celular a prévia da caixa de entrada vem logo abaixo das opções,
     para a pessoa ver a reação ao marcar (no desktop fica na coluna do texto). */
  const caixaEntrada = (
    <div className={'news-inbox' + (celular ? ' news-inbox--m' : ' rv')} aria-hidden="true">
      <div className="news-inbox-topo">
        <span className="news-inbox-pontos"><i /><i /><i /></span>
        <span>Sua caixa de entrada</span>
        <span className="news-inbox-cont">{caixa.length ? caixa.length + (caixa.length > 1 ? ' novas' : ' nova') : ''}</span>
      </div>
      <ul className="news-inbox-lista">
        {caixa.length === 0 && (
          <li className="news-inbox-vazio">Escolha uma newsletter e veja como ela chega para você.</li>
        )}
        {caixa.map((l) => (
          <li key={l.nome} className="news-email" style={{ '--cor': l.cor }}>
            <span className="news-email-avatar">EM</span>
            <span className="news-email-corpo">
              <span className="news-email-de">Emcomjunto News · <b>{l.nome}</b></span>
              <span className="news-email-resumo">{l.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section className="secao bloco escuro fundo-escuro news" id="news" aria-labelledby="tit-news">
      <div className="news-letreiro">
        <p className="news-letreiro-rotulo">O que você vai encontrar</p>
        <ul className="bc-sr">{ASSUNTOS.map((a) => <li key={a}>{a}</li>)}</ul>
        <div className="news-letreiro-fita" aria-hidden="true">
          {[0, 1].map((k) => (
            <span className="news-letreiro-grupo" key={k}>
              {ASSUNTOS.map((a) => <span key={a}>{a}</span>)}
            </span>
          ))}
        </div>
      </div>

      <div className="shell">
        <div className="news-grade">
          <div className="news-texto">
            <p className="news-selo rv"><span className="news-selo-marca">News</span>Últimas notícias, estudos e histórias</p>
            <h2 className="d40 rv" id="tit-news">Nossa produção e curadoria especial para quem quer interagir e ficar por dentro do <span className="ac ac53">nosso universo.</span></h2>
            <p className="lead rv"><b>Conteúdo feito de profissional para profissional, de graça e com muito carinho.</b> Compartilhamos aquilo que estudamos, testamos, observamos e aprendemos no dia a dia sobre marketing, vendas, tecnologia, comunicação e geração de demanda, sempre buscando traduzir isso para a realidade dos mercados em que atuamos.</p>
            <p className="lead rv">Preencha o formulário e escolha os assuntos que quer acompanhar. Receba nossas análises, cases, referências, ferramentas, tendências e descobertas direto no seu e-mail.</p>

            {!celular && caixaEntrada}
          </div>

          <form className="news-form rv" name="newsletter-home" method="POST" data-netlify="true" netlify-honeypot="bot-news-home" onSubmit={enviar}>
            <input type="hidden" name="form-name" value="newsletter-home" />
            <p hidden><label>Não preencha: <input name="bot-news-home" /></label></p>

            <div className="news-form-cab">
              <h3>Escolha suas newsletters</h3>
              <p>Você pode selecionar mais de uma.</p>
            </div>

            <fieldset className="news-listas">
              <legend className="bc-sr">Newsletters</legend>
              {LISTAS.map((l) => {
                const marcada = escolhidas.includes(l.nome)
                return (
                  <label key={l.nome} className={'news-lista' + (marcada ? ' marcada' : '')} style={{ '--cor': l.cor }}>
                    <input type="checkbox" name="newsletters" value={l.nome} checked={marcada} onChange={() => alterna(l.nome)} />
                    <span className="news-lista-n">{l.n}</span>
                    <span className="news-lista-txt">
                      <b>{l.nome}</b>
                      <span>{l.desc}</span>
                    </span>
                    <span className="news-lista-check"><Check /></span>
                  </label>
                )
              })}
            </fieldset>

            {celular && caixaEntrada}

            <div className="news-campos">
              <label className="news-campo">
                <span>Nome</span>
                <input name="nome" type="text" autoComplete="name" required placeholder="Seu nome" />
              </label>
              <label className="news-campo">
                <span>E-mail</span>
                <input name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" />
              </label>
            </div>

            <label className="news-consent">
              <input type="checkbox" name="consentimento" value="sim" required />
              <span className="news-consent-caixa"><Check /></span>
              <span>Aceito receber newsletters e outras comunicações de marketing e comerciais da Emcomjunto, incluindo conteúdos, convites, novidades, ofertas e contatos relacionados aos seus serviços. Declaro que li e estou ciente da <a href={LINK_PRIVACIDADE}>Política de Privacidade</a> e sei que posso cancelar o recebimento e retirar meu consentimento a qualquer momento.</span>
            </label>

            <div className="news-acoes">
              <button className="btn btn--primario" type="submit">
                Quero acompanhar
                <svg className="seta" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span className="news-contagem" aria-live="polite">
                {aviso || (escolhidas.length ? escolhidas.length + (escolhidas.length > 1 ? ' newsletters selecionadas' : ' newsletter selecionada') : '')}
              </span>
              <FormStatus status={status} />
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
