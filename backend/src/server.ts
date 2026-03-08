import app from './app';
import { unifiedConfig } from './config/unifiedConfig';

const port = unifiedConfig.port;

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Environment: ${unifiedConfig.env}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
        process.exit(0);
    });
});
