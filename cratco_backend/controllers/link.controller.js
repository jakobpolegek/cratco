import Link from '../models/link.model.js';

export const createLink = async (req, res, next) => {
    try {
        const link = await Link.create({...req.body, user: req.user._id});

        res.status(201).json({success: true, data: link});
    } catch (error) {
        next(error);
    }
}

export const getUserLinks = async (req, res, next) => {
    try {

        if (req.user.id !== req.params.id) {
            const error = new Error('Unauthorized.');
            error.status = 401;
            throw error;
        }
        const links = await Link.find({user: req.params.id});

        res.status(200).json({success: true, data: links});
    } catch (error) {
        next(error);
    }
}