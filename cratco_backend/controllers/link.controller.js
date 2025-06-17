import Link from '../models/link.model.js';
import {generateUniqueField} from "../utils/generateUniqueField.js";

export const createLink = async (req, res, next) => {
    try {
        let validatedUrl;
        try {
            validatedUrl = new URL(req.body.originalAddress.trim());
        } catch {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid URL.'
            });
        }

        if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
            return res.status(400).json({
                success: false,
                error: 'Only HTTP and HTTPS URLs are allowed.'
            });
        }

        const linkData = { ...req.body, user: req.user._id };
        linkData.originalAddress = validatedUrl.href;

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

export const updateLink = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isVisitUpdate = req.body.visits !== undefined && Object.keys(req.body).length === 1;

        let query;
        if (isVisitUpdate) {
            query = { _id: id };
        } else {
            if (!req.user || !req.user._id) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            query = { _id: id, user: req.user._id };
        }

        const existingLink = await Link.findOne(query);
        if (!existingLink) {
            return res.status(404).json({ success: false, message: 'Link not found' });
        }

        let updateData;
        if (isVisitUpdate) {
            const updatedLink = await Link.findOneAndUpdate(
                query,
                { $inc: { visits: 1 } },
                { new: true }
            );
            return res.status(200).json({ success: true, data: updatedLink });
        } else {
            updateData = { ...req.body };

            delete updateData._id;
            delete updateData.user;
            delete updateData.createdAt;

            const updatedLink = await Link.findOneAndUpdate(
                query,
                updateData,
                { new: true, runValidators: true }
            );

            return res.status(200).json({ success: true, data: updatedLink });
        }

    } catch (error) {
        next(error);
    }
};

export const deleteLink = async (req, res, next) => {
    try {
        const link = await Link.findOneAndDelete({_id: req.params.id, user: req.user._id});
        res.status(200).json({success: true, data: link});
    }
    catch (error) {
        next(error);
    }
}

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

        res.status(200).json({success: true, data: {_id:link._id, originalAddress:link.originalAddress, customAddress: link.customAddress, visits: link.visits}});
    } catch (error) {
        next(error);
    }
}


