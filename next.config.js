/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  async rewrites() {
    return [
      {
        source: '/dashboard/:address',
        destination: '/dashboard',
      }
    ]
  }
};
