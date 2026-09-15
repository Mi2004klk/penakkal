import { PrismaClient } from '@prisma/client';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// For serverless neon in production
// neonConfig.webSocketConstructor = WebSocket;
// const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
// const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// We are not using adapter for local dev. If we configure neon we can uncomment adapter
export const prisma = globalForPrisma.prisma || new PrismaClient({
    // adapter 
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
