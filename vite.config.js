import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// One `.env` at repo root for `VITE_*` (optional). Backend reads the same file via `pool.js`.
export default defineConfig({
  plugins: [react()],
})
