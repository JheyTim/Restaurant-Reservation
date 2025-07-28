const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Connect to MongoDB, return the active connection.
 * Any module that needs DB access can import this file
 * *once*—Mongoose caches the singleton connection underneath.
 */
exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // opt‑in to strict queries; removes silent fail surprises
      autoIndex: false, // perf in production; still build indexes manually
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`🗄️  MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    logger.error(`Mongo error: ${err.message}`);
    process.exit(1); // crash fast; Docker will restart
  }
};

/* Graceful shutdown on SIGTERM / CTRL‑C */
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongo connection closed');
  process.exit(0);
});
