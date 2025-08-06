import express from 'express';
import { config } from '../../../packages/config/env.config';
import Auth from './routes/auth.route';
import { verifyGlobalDbConnection } from '../../../packages/db/verifyDbConection';

const app = express();
const PORT = config.PORT || 4000;

app.get('/auth', (_, res) => {
  res.send({ status: 'Auth Service Running 🏥' });
});

app.use('/api/v1/auth', Auth);
verifyGlobalDbConnection();

app.listen(PORT, () => {
  console.log(`🚀 Hospital service running at http://localhost:${PORT}`);
});
