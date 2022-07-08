/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import profile from './package.json'

export default defineConfig(config => {
  return {
    plugins: [
      react({
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],
    define: {
      'process.env.NODE_ENV':
        config.mode === 'development' ? '"development"' : '"production"',
      VERSION: JSON.stringify(profile.version),
    },
    resolve: {
      alias: {
        '@': '/source',
      },
    },
    server: {
      host: '0.0.0.0',
    },
    envDir: './environments/',
    envPrefix: '__',
  }
})
