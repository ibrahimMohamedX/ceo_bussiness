import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    qualities: [75, 78, 80, 85],
  },

  serverExternalPackages: ["firebase-admin", "jose", "jwks-rsa"],
};

export default withNextIntl(nextConfig);
