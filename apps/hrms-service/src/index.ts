import express from 'express';
import { config } from '../../../packages/config/env.config';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
});

const app = express();
const PORT = config.PORT || 4000;

app.get('/hrms', (_, res) => {
  res.send({ status: 'HRMS Service Running 🏥' });
});

app.listen(PORT, () => {
  console.log(`HRMS service running at http://localhost:${PORT}`);
});
