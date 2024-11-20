/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://api.commonground.tw/callback?:path*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
