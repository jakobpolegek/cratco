import {generateRandomString} from "./generateRandomString.js";
import Link from "../models/link.model.js";

export const generateUniqueField = async (fieldName, length = 7, maxAttempts = 15) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const randomValue = generateRandomString(length);

        const existing = await Link.findOne({ customAddress: randomValue });

        if (!existing) {
            return randomValue;
        }
    }

    throw new Error(`Unable to generate unique ${fieldName} after ${maxAttempts} attempts`);
};