const express = require('express');
const path = require('path');
const app = express();
const api = require('./api');
const http = require('http');
const { Server } = require('socket.io')
const cors = require('cors')
const db = require('./config/connection');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app)
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://the-sunday-social-b780c9b989cc.herokuapp.com/' : 'http://localhost:5173',
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

  // Add cleanup code here for removing event listeners when no longer needed
  // const cleanupListeners = () => {
  //   socket.off('join_room');
  //   socket.off('leave_room');
  //   socket.off('send_message');
  // };

  // // Example: remove listeners on socket disconnect
  // socket.on('disconnect', () => {
  //   cleanupListeners();
  // });

})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cookie parser needs to be before the api routes
app.use(cookieParser());
app.use('/api', api);


if (process.env.NODE_ENV === 'production') {
  // serves react app when in production
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// db.sync({ alter: false, force: false })
//   .then(() => {
//     server.listen(PORT, () => {
//       console.log(`API server running on port ${PORT}!`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error connecting to the database:', error);
//   });




  (async () => {
    db.sync({ alter: false, force: false })
      .then(() => {
        console.log('database is connected.')
      })
      .catch((err) => {
        console.log('Error connecting to the database:', err)
      })
  })()

  server.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
