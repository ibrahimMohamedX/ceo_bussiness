import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["firebase-admin", "jose", "jwks-rsa"],

  experimental: {
    turbo: false,
  },
};

export default withNextIntl(nextConfig);
