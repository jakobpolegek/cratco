import express from 'express';
import {FRONTEND_URL, PORT} from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import linksRouter from "./routes/link.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import cors from "cors";

const app = express();
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/links', linksRouter);
app.use('/api/v1/auth', authRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to cratco api!');
});

app.listen(PORT, async () => {
    console.log(`Cratco API is running on port http://localhost:${PORT}`);

    await connectToDatabase();
})