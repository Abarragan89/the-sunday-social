const express = require('express');
const authRouter = require('./auth')
const userRouter = require('./user');
const posts = require('./post');


const app = express();

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', posts)


module.exports = app;