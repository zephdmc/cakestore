import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
            babel: {
                plugins: [
                    ['@babel/plugin-transform-react-jsx', {
                        runtime: 'automatic',
                        importSource: 'react'
                    }]
                ]
            }
        })
    ],

    // Base configuration
    publicDir: 'public',
    envPrefix: 'VITE_',

    // Build optimization
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
        treeShaking: true,
        minify: true
    },

    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()]
        },
        modules: {
            localsConvention: 'camelCaseOnly'
        }
    },

    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './public')
        },
        dedupe: ['react', 'react-dom']
    },
    // optimizeDeps: {
    //     exclude: ['react', 'react-dom'] // Don't prebundle, let Vite handle this cleanly
    // },
    server: {
        port: 3000,
        strictPort: true,
        host: true,
      proxy: {
      '/api/submit': {
        target: 'https://script.google.com/macros/s/AKfycbwmurUvQstoAFxG1KmgA0ZyqbyInhbrYPSFeRXK8z2pA9PTXvcpd_n_-AQlJsVR4NQmiw/exec',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/submit/, ''),
      },
    },
        watch: {
            usePolling: true,
            interval: 100
        }
    },

    build: {
        // rollupOptions: {
        //     output: {
        //         // manualChunks(id) {
        //         //     if (id.includes('node_modules')) {
        //         //         // Create a dedicated react chunk
        //         //         if (id.includes('react') || id.includes('react-dom')) {
        //         //             return 'vendor-react';
        //         //         }
        //         //         // Group Firebase together
        //         //         if (id.includes('firebase')) {
        //         //             return 'vendor-firebase';
        //         //         }
        //         //         return 'vendor-other';
        //         //     }
        //         // }
        //     }
        // }
    },

    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'react/jsx-runtime',  // Explicitly include JSX runtime
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/messaging'
        ],
        // exclude: ['react', 'react-dom']
    }
});
