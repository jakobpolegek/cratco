import { Router } from 'express';
import {
  signIn,
  signOut,
  signUp,
  socialLogin,
} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/social-login', socialLogin);
authRouter.post('/sign-out', signOut);

export default authRouter;
