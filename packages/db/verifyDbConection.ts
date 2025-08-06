import { globalDb } from './knex';

export async function verifyGlobalDbConnection() {
  try {
    await globalDb.raw('SELECT 1+1 AS result');
    console.log('✅ Global DB connected');
  } catch (err) {
    console.error('❌ Failed to connect to Global DB:', err);
    process.exit(1); // Fail fast
  }
}
