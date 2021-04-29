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

  return io;
};

module.exports = socket;
