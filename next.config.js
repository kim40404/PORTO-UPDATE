const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['three'],
    async headers() {
        return [
            {
                source: '/(.*).glb',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'model/gltf-binary',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    }
                ],
            },
        ];
    },
}

export default nextConfig
