const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

let retryCount = 0;

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('[DB] MONGODB_URI not set — running without database (Excel-only mode)');
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[DB] MongoDB connected:', mongoose.connection.host);
    retryCount = 0;
    return true;
  } catch (err) {
    retryCount++;
    console.error(`[DB] Connection attempt ${retryCount}/${MAX_RETRIES} failed:`, err.message);

    if (retryCount < MAX_RETRIES) {
      console.log(`[DB] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB();
    }

    console.warn('[DB] Max retries reached — falling back to Excel-only mode');
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[DB] MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('[DB] MongoDB error:', err.message);
});

module.exports = { connectDB };
