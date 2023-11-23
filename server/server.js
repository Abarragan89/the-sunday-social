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
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {

  socket.on('send_message', (data) => {
    socket.broadcast.emit('recieve_message', data)
  })
})



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cookie parser needs to be before the api routes
app.use(cookieParser())
app.use('/api', api)


if (process.env.NODE_ENV === 'production') {
  // serves react app when in production
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

server.listen(PORT, () => {
  // db.sync({ force: true })
  console.log(`API server running on port ${PORT}!`);
})