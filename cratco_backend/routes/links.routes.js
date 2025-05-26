import {Router} from 'express';

const linkRouter = Router();

linkRouter.get('/:id', (req, res) => {
    res.send({title: 'GET all links for a user!'});
})

export default linkRouter;