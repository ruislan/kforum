const securityHeaders = [
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
    { key: 'Content-Security-Policy', value: `default-src 'self';script-src 'self' 'unsafe-eval' 'unsafe-inline';style-src 'self' 'unsafe-inline';img-src * blob: data:;` },
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
    { key: 'X-Frame-Options', value: 'DENY' },
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            { protocol: 'https', hostname: 'api.dicebear.com' }
        ]
    },
    headers() {
        return [
            { source: '/(.*)', headers: securityHeaders },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/u/:slug/:path',
                destination: '/u/:slug?tab=:path'
            },
            {
                source: '/settings',
                destination: '/settings/general'
            }
        ];
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production'
    }
};
module.exports = nextConfig;
