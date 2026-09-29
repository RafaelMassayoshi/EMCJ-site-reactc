// Réplica do <p class="form-webhook-status"> que js/components/form-webhook.js
// injetava dentro de .form-acoes/.painel-acoes após o envio.
export default function FormStatus({ status }) {
  if (!status) return null
  return (
    <p className="form-webhook-status" role="status" aria-live="polite" style={{ marginTop: 14, fontSize: 13 }}>
      {status}
    </p>
  )
}
