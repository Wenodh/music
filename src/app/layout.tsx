'use client';

// import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import PwaUpdater from './PwaUpdater';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Music App',
//   description: 'Music app using the components.',
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                // Check if a new service worker is waiting
                if (reg.waiting) {
                    window.wb = reg.waiting; // Assign waiting service worker
                    triggerPwaUpdater();
                }

                // Listen for new service worker state changes
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                window.wb = newWorker; // Assign installing service worker
                                triggerPwaUpdater();
                            }
                        });
                    }
                });
            });

            // Listen for the controlling service worker (active SW takeover)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
    }, []);

    const triggerPwaUpdater = () => {
        const event = new CustomEvent('pwa-update-available');
        window.dispatchEvent(event);
    };

    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
                <PwaUpdater />
            </body>
        </html>
    );
}
