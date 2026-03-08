import { config } from 'dotenv';
config();

export const unifiedConfig = {
    port: parseInt(process.env.PORT || '8080', 10),
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
        jwtExpiresIn: '1d',
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    env: process.env.NODE_ENV || 'development',
};
