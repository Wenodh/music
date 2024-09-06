import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Next.js PWA',
        short_name: 'NextPWA',
        description: 'A Progressive Web App built with Next.js',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/android/android-launchericon-192-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/windows11/Wide310x150Logo.scale-125.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: '/android/android-launchericon-512-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
