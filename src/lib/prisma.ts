import { PrismaClient } from '@prisma/client';

/**
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 *
 * tl;dr:
 * In development, the command next dev clears Node.js cache on run.
 * This in turn initializes a new PrismaClient instance each time due to hot reloading
 * that creates a connection to the database. This can quickly exhaust the database
 * connections as each PrismaClient instance holds its own connection pool. So we create
 * a global PrismaClient instance.
 */

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
