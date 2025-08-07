import express from 'express';
import { config } from '../../../packages/config/env.config';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
});

const app = express();
const PORT = config.PORT || 4000;

app.get('/doctor', (_, res) => {
  res.send({ status: 'Doctor Service Running 🏥' });
});

app.listen(PORT, () => {
  console.log(`Doctor service running at http://localhost:${PORT}`);
});
