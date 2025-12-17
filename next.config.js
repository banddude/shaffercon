/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return [
      // Service page redirects
      {
        source: '/ev-charger-installation',
        destination: '/residential-ev-charger',
        permanent: true,
      },
      {
        source: '/electrical-services',
        destination: '/electrical-repairs',
        permanent: true,
      },
      {
        source: '/led-lighting-installation',
        destination: '/led-retrofit-guide-los-angeles-businesses',
        permanent: true,
      },
      {
        source: '/commercial-electrical-services',
        destination: '/commercial-electrical-systems-navigating-the-complexities',
        permanent: true,
      },
      {
        source: '/industry-insights/commercial-electrical-services',
        destination: '/commercial-electrical-systems-navigating-the-complexities',
        permanent: true,
      },
      // Blog post redirects
      {
        source: '/industry-insights/planning-ev-charger-infrastructure-installation-in-los-angeles-costs-options-and-what-to-expect',
        destination: '/industry-insights/planning-ev-charger-infrastructure-installation-in-los-angeles-costs-options-and-what-to-expect',
        permanent: true,
      },
      {
        source: '/industry-insights/mastering-circuit-breakers-tips-for-effective-resetting',
        destination: '/mastering-circuit-breakers-tips-for-effective-resetting',
        permanent: true,
      },
      {
        source: '/industry-insights/led-lighting-installation-los-angeles',
        destination: '/led-retrofit-guide-los-angeles-businesses',
        permanent: true,
      },
      {
        source: '/led-lighting-installation-los-angeles-commercial',
        destination: '/led-retrofit-guide-los-angeles-businesses',
        permanent: true,
      }
    ];
  },
};

module.exports = nextConfig;
