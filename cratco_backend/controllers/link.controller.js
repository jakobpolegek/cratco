import Link from '../models/link.model.js';
import {generateUniqueField} from "../utils/generateUniqueField.js";

export const createLink = async (req, res, next) => {
    try {
        const linkData = { ...req.body, user: req.user._id };
        const uniqueAddress = await generateUniqueField('customAddress', 7);
        if (!linkData.name || !linkData.name.trim()) {
            linkData.name = uniqueAddress;
        }
        if (!linkData.customAddress || !linkData.customAddress.trim()) {
            linkData.customAddress = uniqueAddress;
        }
        const link = await Link.create(linkData);

        res.status(201).json({ success: true, data: link });
    } catch (error) {
        next(error);
    }
};

export const getUserLinks = async (req, res, next) => {
    try {
        const links = await Link.find({ user: req.user._id });

        if (!links) {
            const error = new Error('No links found for this user.');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: links });
    } catch (error) {
        next(error);
    }
}

export const getUserLink = async (req, res, next) => {
    try {
        const link = await Link.findOne({_id: req.params.id, user: req.user._id});

        if (!link) {
            const error = new Error('Link not found.');
            error.status = 404;
            throw error;
        }

        res.status(200).json({success: true, data: link});
    } catch (error) {
        next(error);
    }
}


export const getPublicLink = async (req, res, next) => {
    try {
        const link = await Link.findOne({customAddress: req.params.customAddress});

        if (!link) {
            const error = new Error('Link not found.');
            error.status = 404;
            throw error;
        }

        res.status(200).json({success: true, data: {originalAddress:link.originalAddress, customAddress: link.customAddress}});
    } catch (error) {
        next(error);
    }
}


