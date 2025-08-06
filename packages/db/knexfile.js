/* eslint-disable no-undef */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, '../../../.env.development'),
});

export default {
  'production-tenant': {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: '',
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations/tenent'),
      extension: 'ts',
    },
  },
};
