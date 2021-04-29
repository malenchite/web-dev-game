const User = require('./classes/User');
const userController = require('../controllers/userController');

const USER_INFO_EVENT = 'user info';
const LOBBY_INFO_EVENT = 'lobby info';

const activeUsers = [];
let io;

/* Utility functions */

/* Finds a user's index by the ID of its associated socket */
function findSocketIndex (socketID) {
  return activeUsers.findIndex(user => user.socket.id === socketID);
}

/* Finds a user's index by the user ID */
function findUserIndex (userID) {
  return activeUsers.findIndex(user => user.id === userID);
}

/* Removes a user at a specified index */
function removeUser (idx) {
  if (idx >= 0 && idx < activeUsers.length) {
    console.log(`User ${activeUsers[idx].id} removed on socket ${activeUsers[idx].socket.id}`);
    activeUsers.splice(idx, 1);
    sendLobbyInfo();
  }
}

/* Sends lobby info on the given socket */
function sendLobbyInfo () {
  const lobbyInfo = {
    users: activeUsers.filter(user => user.room === 'lobby').map(user => user.username)
  };
  console.log('Updating lobby');
  io.to('lobby').emit(LOBBY_INFO_EVENT, lobbyInfo);
}

/* Exported functions */

/* Sets the socket IO that will be used here and sets up connection config */
function start (newIO) {
  io = newIO;

  io.on('connection', socket => {
    console.log('New user connected');

    /* Activate user when info is received */
    socket.on(USER_INFO_EVENT, userInfo => {
      activateUser(userInfo.userId, socket);
    });

    /* On disconnect, remove ID from list of connected users */
    socket.on('disconnect', () => {
      console.log('User disconnected');
      deactivateUser(socket.id);
    });
  });
}

/* Adds a user to the active users list, removing the old one if that user is already present */
function activateUser (userID, socket) {
  /* Check that this user ID is valid before allowing socket to be activated */
  userController.localAccess(userID)
    .then(match => {
      if (match) {
        const newUser = new User(userID, socket, match.username, io);
        const oldIdx = findUserIndex(userID);

        if (oldIdx > -1) {
          activeUsers[oldIdx].disconnect();
          removeUser(oldIdx);
        }

        console.log(`Activating user ${match.username} on socket ${socket.id}`);
        activeUsers.push(newUser);

        sendLobbyInfo();
      } else {
        console.log(`Invalid user ${userID} on socket ${socket.id}`);
        socket.disconnect();
      }
    });
}

/* Removes a user based on the ID of its associated socket */
function deactivateUser (socketID) {
  const idx = findSocketIndex(socketID);

  removeUser(idx);
}

module.exports = start;
