/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import profile from './package.json'

export default defineConfig(config => {
  const env = loadEnv(config.mode, './environments/', '__')

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
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8000,
    },
    envDir: './environments/',
    envPrefix: '__',
    base: env.__URL_ALIAS__,
  }
})
