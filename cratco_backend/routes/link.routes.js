import {Router} from 'express';
import {authorize, authorizePublicUrl} from "../middlewares/auth.middleware.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import {createLink, getUserLinks, getUserLink, getPublicLink} from "../controllers/link.controller.js";

const linkRouter = Router();

linkRouter.get('/public-links/:customAddress', authorizePublicUrl, errorMiddleware, getPublicLink);

linkRouter.get('/', authorize, errorMiddleware, getUserLinks);

linkRouter.post('/', authorize, errorMiddleware, createLink);

linkRouter.get('/:id', authorize, errorMiddleware, getUserLink);

linkRouter.put('/:id', (req, res) => {
    res.send({title: 'UPDATE link!'});
})

linkRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE link!'});
})

export default linkRouter;