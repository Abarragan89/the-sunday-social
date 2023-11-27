// import express, { urlencoded, json, static as staticFiles } from 'express';
const express = require('express');
import { join } from 'path';
const app = express();
import api from './api/index.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import db from './config/connection.js';
import cookieParser from 'cookie-parser';



const PORT = process.env.PORT || 3001;

const server = createServer(app)
app.use(cors());


const io = new Server(server, {
  cors: {
    origin: 'https://the-sunday-social-b780c9b989cc.herokuapp.com/',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {

  // set a join room event. The front end will first join room 
  socket.on('join_room', (data) => {
    socket.join(data)
  })
  // set a leave room event
  socket.on('leave_room', (chatId) => {
    socket.leave(chatId)
  })

  // the 'send_message' will be called at the end of the send message route 
  socket.on('send_message', (data) => {
    // the recieved_message event will have a call back function that will
    // call getMessages() to rerender the messages on the user side
    socket.to(data.chatId).emit('recieve_message', data)
  })

})



app.use(urlencoded({ extended: false }));
app.use(json());

// cookie parser needs to be before the api routes
app.use(cookieParser())
app.use('/api', api)


if (process.env.NODE_ENV === 'production') {
  // serves react app when in production
  app.use(staticFiles(join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  });
}

server.listen(PORT, () => {
  db.sync({ force: false })
  console.log(`API server running on port ${PORT}!`);
})


