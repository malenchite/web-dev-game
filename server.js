const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const reactRoutes = require('./routes/reactRoutes');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;

/* Create server objects */
const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Production assets and routes */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.use(reactRoutes);
}

app.use(apiRoutes);

/* Socket behavior */
const server = http.createServer(app);

/* Apply CORS for localhost if app is not deployed */
const io =
  socketIo(server, process.env.REACT_APP_DEPLOYED ? {} : {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

const connectedClients = [];

io.on('connection', socket => {
  console.log('New client connected');

  connectedClients.push(socket.id);

  console.log(connectedClients);

  /* On disconnect, remove ID from list of connected clients */
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    const index = connectedClients.indexOf(socket.id);
    if (index > -1) {
      connectedClients.splice(index, 1);
    }
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
