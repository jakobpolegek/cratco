import { Router } from 'express';
import { getUser, getUsers } from '../controllers/user.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';
import errorMiddleware from '../middlewares/error.middleware.js';

const userRouter = Router();

userRouter.get('/', authorize, errorMiddleware, getUsers);

userRouter.get('/me', authorize, errorMiddleware, getUser);

userRouter.post('/', (req, res) => {
  res.send({ title: 'CREATE new users!' });
});

userRouter.put('/:id', (req, res) => {
  res.send({ title: 'UPDATE user!' });
});

userRouter.delete('/:id', (req, res) => {
  res.send({ title: 'DELETE user!' });
});

export default userRouter;
