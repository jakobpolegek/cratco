import {Router} from 'express';

const linkRouter = Router();

linkRouter.get('/user/:id', (req, res) => {
    res.send({title: 'GET all links for a user!'});
})

linkRouter.post('/', (req, res) => {
    res.send({title: 'CREATE link!'});
})

linkRouter.put('/:id', (req, res) => {
    res.send({title: 'UPDATE link!'});
})

linkRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE link!'});
})

export default linkRouter;