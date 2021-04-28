const socketIo = require('socket.io');
const activeUsers = require('./activeUsers');

const USER_INFO_EVENT = 'user info';

const socket = server => {
  /* Apply CORS for localhost if app is not deployed */
  const io =
    socketIo(server, process.env.REACT_APP_DEPLOYED ? {} : {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

  io.on('connection', socket => {
    console.log('New client connected');

    /* Activate user when info is received */
    socket.on(USER_INFO_EVENT, userInfo => {
      activeUsers.activateUser(userInfo.userId, socket);
    });

    /* On disconnect, remove ID from list of connected clients */
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      activeUsers.deactivateUser(socket.id);
    });
  });
};

module.exports = socket;
