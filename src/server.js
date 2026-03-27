import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';

// Load environment variables FIRST before any other imports
dotenv.config();

// Verify critical environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const cloudinaryEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

console.log('═══════════════════════════════════════════════════════════');
console.log('Environment Check:');
console.log('═══════════════════════════════════════════════════════════');

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
  } else {
    console.log(`✅ ${envVar}: SET`);
  }
});

cloudinaryEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing Cloudinary environment variable: ${envVar}`);
  } else {
    console.log(`✅ ${envVar}: ${envVar === 'CLOUDINARY_API_SECRET' ? '***SET' : process.env[envVar]}`);
  }
});

console.log('═══════════════════════════════════════════════════════════');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥 Care-Ed Learning Center API Server                   ║
║                                                           ║
║   Server running in ${process.env.NODE_ENV || 'development'} mode                 ║
║   Port: ${PORT}                                              ║
║   URL: http://localhost:${PORT}                              ║
║                                                           ║
║   API Health: http://localhost:${PORT}/api/health            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  const { default: mongoose } = await import('mongoose');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();