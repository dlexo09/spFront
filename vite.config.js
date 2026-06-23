import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const useVike = mode !== 'csr'

  return {
    plugins: [react(), ...(useVike ? [vike()] : [])],
    base: '/',
  }
})
