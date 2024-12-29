/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        let apiDomain;
        const environment = process.env.NEXT_PUBLIC_VERCEL_ENV || 'development';

        switch (environment) {
            case 'perview':
                apiDomain = 'https://api.dev.commonground.tw';
                break;
            case 'production':
                apiDomain = 'https://api.stage.commonground.tw';
                break;
            default:
                apiDomain = 'http://localhost:3000';
                break;
        }

        if (environment === 'perview') {
            return [
            {
                source: '/api/:path*',
                destination: `${apiDomain}/api/:path*`,
                permanent: false,
            },
            {
                source: '/login',
                destination: `${apiDomain}/login`,
                permanent: false,
            },
            ];
        } else if (environment === 'production') {
            return [
            {
                source: '/api/:path*',
                destination: `${apiDomain}/api/:path*`,
                permanent: false,
            },
            ];
        } else {
            return [];
        }
    },
};

export default nextConfig;
