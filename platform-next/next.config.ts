import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/schools', destination: '/es/vivir-en-paraguay/educacion/colegios', permanent: true },
      { source: '/neighborhoods', destination: '/es/vivir-en-paraguay/ciudades', permanent: true },
      { source: '/permits', destination: '/es/vivir-en-paraguay/residencia', permanent: true },
      { source: '/taxation', destination: '/es/vivir-en-paraguay/fiscalidad', permanent: true },
      { source: '/social-security', destination: '/es/vivir-en-paraguay/sanidad', permanent: true }
    ];
  }
};

export default nextConfig;
