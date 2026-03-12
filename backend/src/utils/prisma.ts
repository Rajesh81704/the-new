import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Parse the prisma+postgres URL if needed, or use a direct postgres:// URL
// Extract the actual databaseUrl from the api_key if it is a prisma+postgres URL
let connectionString = process.env.DATABASE_URL || '';
if (connectionString.startsWith('prisma+postgres://') && connectionString.includes('api_key=')) {
  const apiKey = connectionString.split('api_key=')[1];
  try {
    const decoded = JSON.parse(Buffer.from(apiKey.split('.')[0], 'base64').toString());
    if (decoded.databaseUrl) {
      connectionString = decoded.databaseUrl;
    }
  } catch (e) {
    // ignore
  }
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
