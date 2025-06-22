import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'
import { defineConfig as defineVitestConfig } from 'vitest/config'

// Build optimization plugins
import dynamicImport from 'vite-plugin-dynamic-import'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = command === 'serve'
  const isProd = mode === 'production'
  const isAnalyze = env.ANALYZE === 'true'

  const config: UserConfig = {
    plugins: [
      // React with SWC for faster compilation
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: [
            '@emotion/babel-plugin',
            ...(isDev ? ['react-refresh/babel'] : []),
          ],
        },
      }),

      // Dynamic imports optimization
      dynamicImport(),

      // Vendor chunk splitting
      splitVendorChunkPlugin(),

      // HTML template processing
      createHtmlPlugin({
        minify: isProd,
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'NCQ Platform',
            description: env.VITE_APP_DESCRIPTION || 'Next-generation business platform',
            lang: env.VITE_APP_LANG || 'en',
            dir: env.VITE_APP_DIR || 'ltr',
          },
        },
      }),

      // Progressive Web App
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.ncq\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'ncq-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
                cacheKeyWillBeUsed: async ({ request }) => {
                  return `${request.url}?v=${Date.now()}`
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
        manifest: {
          name: 'NCQ Platform',
          short_name: 'NCQ',
          description: 'Next-generation business platform',
          theme_color: '#0ea5e9',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),

      // Legacy browser support
      ...(isProd
        ? [
            legacy({
              targets: ['defaults', 'not IE 11'],
              additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
              renderLegacyChunks: true,
              polyfills: [
                'es.symbol',
                'es.array.filter',
                'es.promise',
                'es.promise.finally',
                'es/map',
                'es/set',
                'es.array.for-each',
                'es.object.define-properties',
                'es.object.define-property',
                'es.object.get-own-property-descriptor',
                'es.object.get-own-property-descriptors',
                'es.object.keys',
                'es.object.to-string',
                'web.dom-collections.for-each',
                'esnext.global-this',
                'esnext.string.match-all',
              ],
            }),
          ]
        : []),

      // Compression
      ...(isProd
        ? [
            compression({
              algorithm: 'gzip',
              ext: '.gz',
            }),
            compression({
              algorithm: 'brotliCompress',
              ext: '.br',
            }),
          ]
        : []),

      // Bundle analyzer
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'dist/stats.html',
              open: true,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
            }),
          ]
        : []),
    ],

    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, '../src'),
        '@components': resolve(__dirname, '../src/components'),
        '@pages': resolve(__dirname, '../src/pages'),
        '@hooks': resolve(__dirname, '../src/hooks'),
        '@utils': resolve(__dirname, '../src/utils'),
        '@services': resolve(__dirname, '../src/services'),
        '@types': resolve(__dirname, '../src/types'),
        '@assets': resolve(__dirname, '../src/assets'),
        '@config': resolve(__dirname, '../src/config'),
        '@constants': resolve(__dirname, '../src/constants'),
        '@contexts': resolve(__dirname, '../src/contexts'),
        '@store': resolve(__dirname, '../src/store'),
        '@layouts': resolve(__dirname, '../src/layouts'),
        '@features': resolve(__dirname, '../src/features'),
        '@shared': resolve(__dirname, '../src/shared'),
        '@ncq/design-system': resolve(__dirname, '../design-system/src'),
      },
    },

    // Development server
    server: {
      port: 3000,
      host: true,
      cors: true,
      hmr: {
        overlay: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // Preview server (for production build testing)
    preview: {
      port: 3001,
      host: true,
      cors: true,
    },

    // Build optimization
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isProd ? 'hidden' : true,
      minify: isProd ? 'esbuild' : false,
      cssMinify: isProd,
      reportCompressedSize: false, // Faster builds
      chunkSizeWarningLimit: 1000,
      
      rollupOptions: {
        output: {
          // Advanced chunking strategy
          manualChunks: {
            // React ecosystem
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // UI libraries
            'ui-vendor': [
              '@headlessui/react',
              '@heroicons/react',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs',
              'lucide-react',
            ],
            
            // Data fetching and state management
            'data-vendor': [
              '@tanstack/react-query',
              'zustand',
              'swr',
              'axios',
            ],
            
            // Form and validation
            'form-vendor': [
              'react-hook-form',
              '@hookform/resolvers',
              'zod',
              'yup',
            ],
            
            // Date and time
            'date-vendor': [
              'date-fns',
              'react-day-picker',
              'dayjs',
            ],
            
            // Chart and visualization
            'chart-vendor': [
              'recharts',
              'd3',
              'react-chartjs-2',
              'chart.js',
            ],
            
            // Utilities
            'utils-vendor': [
              'lodash-es',
              'clsx',
              'class-variance-authority',
              'tailwind-merge',
            ],
            
            // Animation
            'animation-vendor': [
              'framer-motion',
              '@lottiefiles/react-lottie-player',
            ],
            
            // Development tools
            ...(isDev ? {
              'dev-vendor': [
                '@vitejs/plugin-react-swc',
                'vite',
              ],
            } : {}),
          },
          
          // Optimize chunk names
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              const fileName = facadeModuleId.split('/').pop() || 'chunk'
              return `js/[name]-[hash].js`
            }
            return 'js/[name]-[hash].js'
          },
          
          // Optimize asset names
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name?.split('.').pop() || ''
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `images/[name]-[hash][extname]`
            }
            if (/woff2?|eot|ttf|otf/i.test(extType)) {
              return `fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
          
          entryFileNames: 'js/[name]-[hash].js',
        },
        
        // External dependencies (for micro-frontend architecture)
        external: (id) => {
          // Keep certain packages external for module federation
          if (env.VITE_MODULE_FEDERATION === 'true') {
            return ['react', 'react-dom'].includes(id)
          }
          return false
        },
      },
      
      // CSS optimization
      cssCodeSplit: true,
      
      // Worker optimization
      rollupOptions: {
        ...config.build?.rollupOptions,
        output: {
          ...config.build?.rollupOptions?.output,
          // Optimize workers
          inlineDynamicImports: false,
        },
      },
    },

    // CSS processing
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:8]',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
      devSourcemap: isDev,
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
          ...(isProd ? [
            require('cssnano')({
              preset: ['default', {
                discardComments: { removeAll: true },
                normalizeWhitespace: false,
              }],
            }),
          ] : []),
        ],
      },
    },

    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'axios',
        'date-fns',
        'lodash-es',
        'clsx',
        'tailwind-merge',
      ],
      exclude: [
        '@vite/client',
        '@vite/env',
      ],
      esbuildOptions: {
        target: 'esnext',
        supported: {
          'top-level-await': true,
        },
      },
    },

    // Performance
    esbuild: {
      target: 'esnext',
      drop: isProd ? ['console', 'debugger'] : [],
      legalComments: 'none',
      charset: 'utf8',
      minifyIdentifiers: isProd,
      minifySyntax: isProd,
      minifyWhitespace: isProd,
      treeShaking: true,
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __IS_DEV__: JSON.stringify(isDev),
      __IS_PROD__: JSON.stringify(isProd),
    },

    // Testing with Vitest
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.{ts,js}',
          'src/main.tsx',
        ],
      },
    },
  }

  return config
})