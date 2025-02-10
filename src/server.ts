import http, { Server } from 'http';
import app from './app';
import { prisma } from './config/database';
import env from './config/env';
import { logger } from './config/logger';

let server: Server | null = null;

async function connectToDatabase() {
    try {
        await prisma.$connect();
        logger.info('Database connected');
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

async function startServer() {
    try {
        await connectToDatabase();

        server = http.createServer(app);
        server.listen(env.PORT, () => {
            console.log(`🚀 Server is running on port ${env.PORT}`);
        });

        handleProcessEvents();
    } catch (error) {
        console.error('❌ Error during server startup:', error);
        process.exit(1);
    }
}

/**
 * Gracefully shutdown the server and close database connections.
 * @param {string} signal - The termination signal received.
 */
async function gracefulShutdown(signal: string) {
    console.warn(`🔄 Received ${signal}, shutting down gracefully...`);

    if (server) {
        server.close(async () => {
            console.log('✅ HTTP server closed.');

            try {
                await prisma.$disconnect();
                console.log('✅ Database connection closed.');
            } catch (error) {
                console.error('❌ Error closing database connection:', error);
            }

            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}

/**
 * Handle system signals and unexpected errors.
 */
function handleProcessEvents() {
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
        console.error('💥 Uncaught Exception:', error);
        gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason) => {
        console.error('💥 Unhandled Rejection:', reason);
        gracefulShutdown('unhandledRejection');
    });
}

// Start the application
startServer();
