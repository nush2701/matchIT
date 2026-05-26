import path from 'node:path';
import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

// Lets `prisma db push` / `prisma generate` talk to the remote Turso database
// through the libSQL driver adapter, instead of a local SQLite file.
// Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.
export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    adapter: async () =>
      new PrismaLibSQL({
        url: `${process.env.TURSO_DATABASE_URL}`,
        authToken: `${process.env.TURSO_AUTH_TOKEN}`,
      }),
  },
});
