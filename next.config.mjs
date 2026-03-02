/* eslint-env node */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Headers para permitir Service Workers y CSP
  async headers() {
      // Cabeceras permisivas para permitir tráfico entrante sin restricciones
    const permissiveCsp = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
      "script-src * 'unsafe-inline' 'unsafe-eval'; " +
      "style-src * 'unsafe-inline'; " +
      "img-src * data: blob:; " +
      "font-src * data:; " +
      "connect-src *; " +
      "frame-src *; " +
      "worker-src * blob:;";

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: permissiveCsp,
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
