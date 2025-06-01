import {Router} from 'express';
import authorize from "../middlewares/auth.middleware.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import {createLink, getUserLinks} from "../controllers/link.controller.js";

const linkRouter = Router();

linkRouter.get('/', authorize, errorMiddleware, getUserLinks);

linkRouter.post('/', authorize, errorMiddleware, createLink);

linkRouter.put('/:id', (req, res) => {
    res.send({title: 'UPDATE link!'});
})

linkRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE link!'});
})

export default linkRouter;