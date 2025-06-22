import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CompressionPlugin from 'compression-webpack-plugin'
import WorkboxPlugin from 'workbox-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { DefinePlugin, ProgressPlugin } from 'webpack'
import { ModuleFederationPlugin } from 'webpack/lib/container/ModuleFederationPlugin'

const createWebpackConfig = (env: any, argv: any): webpack.Configuration => {
  const isDev = argv.mode === 'development'
  const isProd = argv.mode === 'production'
  const isAnalyze = process.env.ANALYZE === 'true'
  const isFederation = process.env.MODULE_FEDERATION === 'true'

  const config: webpack.Configuration = {
    target: ['web', 'es2020'],
    
    entry: {
      main: path.resolve(__dirname, '../src/main.tsx'),
      // Separate entries for micro-frontends
      ...(isFederation ? {
        'ncq-shell': path.resolve(__dirname, '../src/shell/index.tsx'),
        'ncq-auth': path.resolve(__dirname, '../src/auth/index.tsx'),
        'ncq-dashboard': path.resolve(__dirname, '../src/dashboard/index.tsx'),
        'ncq-admin': path.resolve(__dirname, '../src/admin/index.tsx'),
      } : {}),
    },

    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
      chunkFilename: isDev ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
      publicPath: process.env.PUBLIC_PATH || '/',
      clean: true,
      pathinfo: false, // Faster builds
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, '../src'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@pages': path.resolve(__dirname, '../src/pages'),
        '@hooks': path.resolve(__dirname, '../src/hooks'),
        '@utils': path.resolve(__dirname, '../src/utils'),
        '@services': path.resolve(__dirname, '../src/services'),
        '@types': path.resolve(__dirname, '../src/types'),
        '@assets': path.resolve(__dirname, '../src/assets'),
        '@config': path.resolve(__dirname, '../src/config'),
        '@constants': path.resolve(__dirname, '../src/constants'),
        '@contexts': path.resolve(__dirname, '../src/contexts'),
        '@store': path.resolve(__dirname, '../src/store'),
        '@layouts': path.resolve(__dirname, '../src/layouts'),
        '@features': path.resolve(__dirname, '../src/features'),
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@ncq/design-system': path.resolve(__dirname, '../design-system/src'),
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
      },
    },

    module: {
      rules: [
        // TypeScript and React
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                    dynamicImport: true,
                    decorators: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                      development: isDev,
                      refresh: isDev,
                    },
                  },
                  target: 'es2020',
                  loose: true,
                  externalHelpers: false,
                },
                module: {
                  type: 'es6',
                },
                minify: isProd,
              },
            },
          ],
        },

        // JavaScript
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'ecmascript',
                    jsx: true,
                    dynamicImport: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                      development: isDev,
                      refresh: isDev,
                    },
                  },
                  target: 'es2020',
                },
              },
            },
          ],
        },

        // CSS and SCSS
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: isDev,
                modules: {
                  auto: true,
                  localIdentName: isDev
                    ? '[name]__[local]__[hash:base64:5]'
                    : '[hash:base64:8]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss'),
                    require('autoprefixer'),
                    ...(isProd ? [
                      require('cssnano')({
                        preset: ['default', {
                          discardComments: { removeAll: true },
                        }],
                      }),
                    ] : []),
                  ],
                },
              },
            },
          ],
        },

        {
          test: /\.s[ac]ss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('tailwindcss'),
                    require('autoprefixer'),
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                additionalData: `@import "@/styles/variables.scss";`,
              },
            },
          ],
        },

        // Images
        {
          test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb
            },
          },
          generator: {
            filename: 'images/[name].[contenthash:8][ext]',
          },
        },

        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash:8][ext]',
          },
        },

        // Videos
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'media/[name].[contenthash:8][ext]',
          },
        },

        // SVG as React components
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                typescript: true,
                icon: true,
                svgProps: {
                  fill: 'currentColor',
                },
              },
            },
          ],
        },
      ],
    },

    plugins: [
      // Clean dist folder
      new CleanWebpackPlugin(),

      // HTML template
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'index.html',
        inject: true,
        minify: isProd ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false,
        templateParameters: {
          title: process.env.REACT_APP_TITLE || 'NCQ Platform',
          description: process.env.REACT_APP_DESCRIPTION || 'Next-generation business platform',
          lang: process.env.REACT_APP_LANG || 'en',
          dir: process.env.REACT_APP_DIR || 'ltr',
        },
      }),

      // Environment variables
      new DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: argv.mode,
          REACT_APP_VERSION: process.env.npm_package_version,
          REACT_APP_BUILD_TIME: new Date().toISOString(),
          ...Object.keys(process.env)
            .filter(key => key.startsWith('REACT_APP_'))
            .reduce((env, key) => {
              env[key] = process.env[key]
              return env
            }, {} as Record<string, any>),
        }),
        __DEV__: JSON.stringify(isDev),
        __PROD__: JSON.stringify(isProd),
      }),

      // Progress indicator
      new ProgressPlugin({
        activeModules: false,
        entries: true,
        modules: false,
        modulesCount: 5000,
        profile: false,
        dependencies: false,
        dependenciesCount: 10000,
        percentBy: null,
      }),

      // TypeScript type checking
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, '../tsconfig.json'),
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
        eslint: {
          files: '../src/**/*.{ts,tsx,js,jsx}',
        },
      }),

      // CSS extraction
      ...(isProd ? [
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
      ] : []),

      // React Fast Refresh
      ...(isDev ? [
        new ReactRefreshWebpackPlugin({
          overlay: {
            entry: require.resolve('react-dev-utils/webpackHotDevClient'),
            module: require.resolve('react-dev-utils/refreshOverlayInterop'),
            sockIntegration: false,
          },
        }),
      ] : []),

      // Copy static assets
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist'),
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),

      // Service Worker
      ...(isProd ? [
        new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          skipWaiting: true,
          swDest: 'sw.js',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.ncq\.com\/.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'ncq-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
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
        }),
      ] : []),

      // Compression
      ...(isProd ? [
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
        }),
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
        }),
      ] : []),

      // Bundle analyzer
      ...(isAnalyze ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: 'bundle-analyzer-report.html',
        }),
      ] : []),

      // Module Federation for micro-frontends
      ...(isFederation ? [
        new ModuleFederationPlugin({
          name: 'ncq_platform',
          filename: 'remoteEntry.js',
          exposes: {
            './Shell': './src/shell/index.tsx',
            './Auth': './src/auth/index.tsx',
            './Dashboard': './src/dashboard/index.tsx',
            './Admin': './src/admin/index.tsx',
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: '^18.0.0',
            },
            'react-dom': {
              singleton: true,
              requiredVersion: '^18.0.0',
            },
            'react-router-dom': {
              singleton: true,
              requiredVersion: '^6.0.0',
            },
            '@ncq/design-system': {
              singleton: true,
            },
          },
        }),
      ] : []),
    ],

    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: isProd,
              drop_debugger: isProd,
              pure_funcs: isProd ? ['console.log', 'console.info'] : [],
            },
            mangle: {
              safari10: true,
            },
            format: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: false,
              },
            ],
          },
        }),
      ],
      
      // Advanced chunking strategy
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          // React ecosystem
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'react-vendor',
            priority: 40,
            reuseExistingChunk: true,
          },
          
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](@headlessui|@heroicons|@radix-ui|lucide-react)[\\/]/,
            name: 'ui-vendor',
            priority: 35,
            reuseExistingChunk: true,
          },
          
          // Data libraries
          data: {
            test: /[\\/]node_modules[\\/](@tanstack|zustand|swr|axios)[\\/]/,
            name: 'data-vendor',
            priority: 30,
            reuseExistingChunk: true,
          },
          
          // Form libraries
          forms: {
            test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod|yup)[\\/]/,
            name: 'form-vendor',
            priority: 25,
            reuseExistingChunk: true,
          },
          
          // Chart libraries
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3|chart\.js|react-chartjs-2)[\\/]/,
            name: 'chart-vendor',
            priority: 25,
            reuseExistingChunk: true,
          },
          
          // Utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|clsx|class-variance-authority|tailwind-merge)[\\/]/,
            name: 'utils-vendor',
            priority: 20,
            reuseExistingChunk: true,
          },
          
          // Animation libraries
          animation: {
            test: /[\\/]node_modules[\\/](framer-motion|@lottiefiles)[\\/]/,
            name: 'animation-vendor',
            priority: 20,
            reuseExistingChunk: true,
          },
          
          // Other vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            reuseExistingChunk: true,
          },
          
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      
      // Runtime chunk
      runtimeChunk: {
        name: 'runtime',
      },
      
      // Module IDs
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    },

    devServer: {
      port: 3000,
      host: '0.0.0.0',
      hot: true,
      compress: true,
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, '../public'),
        publicPath: '/',
      },
      proxy: {
        '/api': {
          target: process.env.REACT_APP_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '',
          },
        },
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
    },

    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',

    performance: {
      hints: isProd ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    stats: {
      preset: 'minimal',
      moduleTrace: true,
      errorDetails: true,
    },

    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },

    experiments: {
      topLevelAwait: true,
      outputModule: false,
    },
  }

  return config
}

export default createWebpackConfig