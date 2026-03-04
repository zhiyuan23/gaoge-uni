import type { UserConfig } from 'vite'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { createViteProxy } from './build/config/index'
import createVitePlugins from './build/plugins/index'

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, fileURLToPath(new URL('./env', import.meta.url)))
  const isBuild = process.env.NODE_ENV === 'production'

  return {
    envDir: './env',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: Number.parseInt(env.VITE_APP_PORT, 10),
      hmr: true,
      host: true,
      open: true,
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.git/**',
          '**/unpackage/**',
        ],
      },
      proxy: createViteProxy(env),
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    build: {
      minify: 'terser',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_console: isBuild,
          drop_debugger: isBuild,
        },
      },
    },
    plugins: createVitePlugins(isBuild),
    esbuild: { drop: isBuild ? ['console', 'debugger'] : [] },
  }
})
