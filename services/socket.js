const socketIo = require('socket.io');

const socket = server => {
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
};

module.exports = socket;
