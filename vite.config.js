import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: null,
            base: '/',
            buildBase: '/',
            outDir: 'public',
            scope: '/',
            includeAssets: ['favicon.ico', 'icons/noryvaq.svg'],
            manifest: {
                name: 'Noryvaq',
                short_name: 'Noryvaq',
                description: 'La plataforma de reservas para negocios y personas.',
                lang: 'es',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                background_color: '#f8faff',
                theme_color: '#5950f5',
                icons: [
                    {
                        src: '/icons/noryvaq.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                navigateFallback: '/',
                globPatterns: ['**/*.{js,css,html,ico,svg,png,webp,woff2}'],
            },
            devOptions: {
                enabled: true,
                type: 'module',
            },
        }),
    ],
});
