/* eslint-disable camelcase */
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
            attrs: {
              rel: 'preload',
            },
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
        '@store': '/store',
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
    build: {
      modulePreload: true,
      minify: 'esbuild',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    esbuild: {
      drop: config.mode === 'production' ? ['console', 'debugger'] : [],
    },
    envDir: './environments/',
    envPrefix: '__',
  }
})
