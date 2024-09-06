/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';
const isProduction = process.env.NODE_ENV === 'production';

const config = {
    images: {
        domains: ['c.saavncdn.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

const nextConfig = withPWA({
    dest: 'public',
    disable: !isProduction,
    runtimeCaching,
})(config);

export default nextConfig;
