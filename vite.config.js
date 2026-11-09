import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/<cdac-placement-portal-frontend>/', // Replace <your-repo-name> with your exact GitHub repository name
})