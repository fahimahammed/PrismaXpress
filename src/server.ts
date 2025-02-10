import app from './app';
import { prisma } from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('🟢 Database connected');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('🔴 Error starting server:', error);
    }
};

startServer();
