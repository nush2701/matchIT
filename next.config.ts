import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The libSQL driver (used by the Prisma adapter for Turso) ships non-code
  // files like README.md that the bundler can't parse. Externalize these so
  // they load as native Node modules on the server instead of being bundled.
  serverExternalPackages: ["@prisma/adapter-libsql", "@libsql/client"],
};

export default nextConfig;
