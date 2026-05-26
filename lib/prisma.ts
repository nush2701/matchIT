// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

// Connect to Turso (hosted libSQL) via the Prisma driver adapter.
// Credentials come from the Turso dashboard (app.turso.tech) and live in .env:
//   TURSO_DATABASE_URL=libsql://<your-db>.turso.io
//   TURSO_AUTH_TOKEN=<token>
const adapter = new PrismaLibSQL({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
