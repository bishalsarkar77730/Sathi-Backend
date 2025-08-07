import express from 'express';
import { config } from '../../../packages/config/env.config';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({
  path: join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
});

const app = express();
const PORT = config.PORT || 4000;

app.get('/nurse', (_, res) => {
  res.send({ status: 'nurse Service Running 🏥' });
});

app.listen(PORT, () => {
  console.log(`nurse service running at http://localhost:${PORT}`);
});
