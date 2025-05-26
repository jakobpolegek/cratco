import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env.js";
import process from 'process';

if (!DB_URI) throw new Error('DB_URI is not defined');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to database in ${NODE_ENV} mode.`);
    } catch (err) {
        console.log('Error connecting to database: ', err);
        process.exit(1);
    }
}

export default connectToDatabase;