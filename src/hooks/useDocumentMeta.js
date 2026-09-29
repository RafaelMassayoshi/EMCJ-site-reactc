import { useEffect } from 'react'

// Cada HTML original definia <title>, meta description e <link rel="canonical">
// próprios. Numa SPA isso precisa ser feito em runtime por página.
export default function useDocumentMeta({ title, description, canonical }) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }

    if (canonical) {
      let link = document.getElementById('canonicalTag')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        link.id = 'canonicalTag'
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
  }, [title, description, canonical])
}
