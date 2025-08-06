import { config as dotenvLoad } from 'dotenv';
import { join } from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

dotenvLoad({ path: join(__dirname, `../../.env.${NODE_ENV}`) });
dotenvLoad({ path: join(__dirname, '../../.env') });

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`❌ Missing required env variable: ${name}`);
  return val;
}

console.log(requireEnv('DB_HOST'), 'this is error');

export const config = {
  NODE_ENV: NODE_ENV as 'development' | 'production',
  PORT: Number(process.env.PORT) || 4000,

  // DB Connection (manually construct later in knexfile or db util)
  DB_HOST: requireEnv('DB_HOST'),
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: requireEnv('DB_USER'),
  DB_PASSWORD: requireEnv('DB_PASSWORD'),
  DB_NAME: requireEnv('DB_NAME'),

  // AWS
  S3REGION: requireEnv('S3REGION'),
  ACCESSKEYID: requireEnv('ACCESSKEYID'),
  SECRETACCESSKEY: requireEnv('SECRETACCESSKEY'),
  BUCKET: requireEnv('BUCKET'),

  // Security
  JWT_SECRET: requireEnv('JWT_SECRET'),
  CSRF_SECRET: requireEnv('CSRF_SECRET'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
