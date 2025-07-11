import { Router } from 'express';
import {
  authorize,
  authorizePublicUrl,
} from '../middlewares/auth.middleware.js';
import errorMiddleware from '../middlewares/error.middleware.js';
import {
  createLink,
  deleteLink,
  getPublicLink,
  getUserLink,
  getUserLinks,
  updateLink,
  updateVisitsCount,
} from '../controllers/link.controller.js';

const linkRouter = Router();

linkRouter.get(
  '/public-links/:customAddress',
  authorizePublicUrl,
  errorMiddleware,
  getPublicLink
);

linkRouter.put(
  '/public-links/:customAddress',
  authorizePublicUrl,
  errorMiddleware,
  updateVisitsCount
);

linkRouter.get('/', authorize, errorMiddleware, getUserLinks);

linkRouter.post('/', authorize, errorMiddleware, createLink);

linkRouter.get('/:id', authorize, errorMiddleware, getUserLink);

linkRouter.put('/:id', authorize, errorMiddleware, updateLink);

linkRouter.delete('/:id', authorize, errorMiddleware, deleteLink);

export default linkRouter;
