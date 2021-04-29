const User = require('./classes/User');
const userController = require('../controllers/userController');

const activeUsers = [];

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
  }
}

/* Exported functions */

/* Adds a user to the active users list, removing the old one if that user is already present */
function activateUser (userID, socket) {
  /* Check that this user ID is valid before allowing socket to be activated */
  userController.localCheck(userID)
    .then(found => {
      if (found) {
        const newUser = new User(userID, socket);
        const oldIdx = findUserIndex(userID);

        if (oldIdx > -1) {
          activeUsers[oldIdx].disconnect();
          removeUser(oldIdx);
        }

        console.log(`Activating user ${userID} on socket ${socket.id}`);
        activeUsers.push(newUser);
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

module.exports = {
  activateUser,
  deactivateUser
};
