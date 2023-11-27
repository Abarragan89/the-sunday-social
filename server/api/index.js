import express from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
import posts from './post.js';


const app = express();

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', posts)


export default app;