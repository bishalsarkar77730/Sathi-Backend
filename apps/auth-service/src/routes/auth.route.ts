import express from 'express';
import { signupHandler } from '../controllers/signup.controller';
import { loginController } from '../controllers/signin.controller';

const router = express.Router();

router.post('/signup', signupHandler);
router.post('/sign-in', loginController);

export default router;