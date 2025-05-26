import express from 'express';
import {PORT} from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import linksRouter from "./routes/links.routes.js";

const app = express();
app.use('/api/v1/users', userRouter);
app.use('/api/v1/links', linksRouter);
app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Welcome to cratco api!');
});

app.listen(PORT, () => {
    console.log(`Cratco API is running on port http://localhost:${PORT}`);
})

export default app;