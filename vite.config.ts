/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig, loadEnv, type Plugin } from 'vite'
import injectPrefetch from 'vite-plugin-prefetch-inject'
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
      injectPrefetch({
        files: [
          {
            match: /.*/u,
            attrs: {},
          },
        ],
      }) as unknown as Plugin,
    ],
    define: {
      __VERSION__: JSON.stringify(profile.version),
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

    preview: {
      port: 8080,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
      },
    },
    envDir: './environments/',
    envPrefix: '__',
    base: env.__URL_ALIAS__,
  }
})
