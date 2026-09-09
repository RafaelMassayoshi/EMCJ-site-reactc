import { useState } from 'react'

// Porta 1:1 de js/components/form-webhook.js: intercepta o submit de um
// <form data-netlify="true">, respeita o honeypot (campo "bot-*") e envia
// os dados via fetch em JSON para o mesmo webhook do n8n. Cada <form> da
// aplicação chama este hook individualmente (estado de envio independente
// por formulário).
const WEBHOOK_URL = 'https://auto.emcomjunto.com.br/webhook/45274527-deb8-4089-b636-237ff77fb7fe'

function ehCampoHoneypot(nome) {
  return /^bot-/.test(nome || '')
}

export default function useFormWebhook() {
  const [status, setStatus] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget

    const nomeFormulario =
      form.querySelector('input[name="form-name"]')?.value || form.getAttribute('name') || 'formulario'

    const honeypotPreenchido = Array.from(form.querySelectorAll('input')).some(
      (el) => ehCampoHoneypot(el.name) && el.value,
    )

    if (honeypotPreenchido) {
      // Comportamento de honeypot: finge sucesso e não envia nada.
      setStatus('Enviado. Obrigado pelo contato.')
      form.reset()
      return
    }

    const dados = {}
    const fd = new FormData(form)
    fd.forEach((valor, chave) => {
      if (ehCampoHoneypot(chave)) return
      if (Object.prototype.hasOwnProperty.call(dados, chave)) {
        if (!Array.isArray(dados[chave])) dados[chave] = [dados[chave]]
        dados[chave].push(valor)
      } else {
        dados[chave] = valor
      }
    })

    const corpo = {
      formulario: nomeFormulario,
      paginaUrl: window.location.href,
      paginaTitulo: document.title,
      enviadoEm: new Date().toISOString(),
      campos: dados,
    }

    const botao = form.querySelector('button[type="submit"]')
    if (botao) botao.disabled = true
    setStatus('Enviando...')

    try {
      const resp = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Form-Name': encodeURIComponent(nomeFormulario),
          'X-Page-Path': encodeURIComponent(window.location.pathname),
        },
        body: JSON.stringify(corpo),
      })
      if (!resp.ok) throw new Error('HTTP ' + resp.status)
      setStatus('Enviado! A gente responde em breve.')
      form.reset()
    } catch (erro) {
      if (window.console) console.error('form-webhook:', erro)
      setStatus(
        'Não foi possível enviar agora. Tente novamente em instantes ou escreva para contato@emcomjunto.com.br.',
      )
    } finally {
      if (botao) botao.disabled = false
    }
  }

  return { status, handleSubmit }
}
