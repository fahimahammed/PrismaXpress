import dotenv from 'dotenv';

dotenv.config();

// Type declaration for environment variables
interface EnvConfig {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    // Add any other environment variables you need here
}

// Validate environment variables
const validateEnv = () => {
    const requiredEnvVars: (keyof EnvConfig)[] = [
        'PORT',
        'DATABASE_URL',
        'NODE_ENV',
        'JWT_SECRET',
        'JWT_EXPIRY'
    ];

    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });
};

// Call validation function to ensure all required env variables are set
validateEnv();

// Export environment variables with types
const env: EnvConfig = {
    PORT: process.env.PORT || '3000',
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1h',
};

export default env;
