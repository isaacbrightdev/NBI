import react from '@vitejs/plugin-react';
import adastra from 'adastra-plugin';
import path from 'path';
import { defineConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isdev = mode === 'nbi-staging' || mode === 'ipe-staging' || mode === "development";

  return {
    plugins: [
      adastra.default(),
      react(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[name]',
        svgoOptions: {
          plugins: [
            {
              name: 'convertColors',
              params: {
                currentColor: true
              }
            }
          ]
        },
        inject: 'body-first'
      }),
      compression({
        verbose: true,
        disable: isdev ? true : true,
        threshold: 10240, 
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    server: {
      middlewareMode: isdev ? false : true,
      configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
          // Set Cache-Control headers for all static assets
          if (req.url && req.url.startsWith('/assets/')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year caching for assets
          } else if (req.url && req.url.startsWith('/')) {
            res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour for other files
          }
          next();
        });
      },
    },
    publicDir: path.resolve(process.cwd(), 'src/public'),
    build: {
      copyPublicDir: true,
      rollupOptions: {
        output: {
          assetFileNames: `bundle.${isdev ? 'dev.' : ''}[name]-[hash][extname]`,
          chunkFileNames: `chunk.${isdev ? 'dev.' : ''}[name]-[hash].js`,
        },
      },
      minify: isdev ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: true,                // Remove all console.log statements
          drop_debugger: true,               // Remove debugger statements
          passes: 3,                         // Multiple passes for better compression
          pure_funcs: ['console.info', 'console.warn'], // Remove specific console calls
          dead_code: true,                   // Remove unused code
        },
        format: {
          comments: false,                   // Remove all comments
          ecma: 2020,                        // Set the ECMAScript version for modern syntax
        },
        toplevel: true,                      // Enable top-level variable and function name minification
        keep_classnames: false,              // Remove class names
        keep_fnames: false,   
      },
    }
  };
});
