import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Site migrado de HTML/CSS/JS estático para React, preservando URLs
// absolutas (/assets/..., /css/... viravam imports do bundle) e o
// roteamento client-side via react-router-dom (ver src/App.jsx).
export default defineConfig({
  plugins: [react()],
})
