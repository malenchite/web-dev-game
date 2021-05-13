const uuid = require('uuid');

const User = require('./classes/User');
const userController = require('../controllers/userController');
const gameService = require('./gameService');

const CHALLENGE_EVENT = 'challenge';
const WITHDRAW_EVENT = 'withdraw challenge';
const CHALLENGE_RSP_EVENT = 'challenge response';
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

/* Finds a user's index by the username */
function findUsernameIndex (username) {
  return activeUsers.findIndex(user => user.username === username);
}

/* Communication functions */

/* Sends lobby info on the given socket */
function sendLobbyInfo () {
  const lobbyInfo = {
    users: activeUsers.filter(user => user.room === 'lobby').map(user => user.username)
  };
  console.log('Updating lobby');
  io.to('lobby').emit(LOBBY_INFO_EVENT, lobbyInfo);
}

/* Sends a challenge response on the provided socket */
function sendChallengeRsp (socket, accepted, message) {
  const response = {
    accepted
  };

  if (message) {
    response.message = message;
  }

  socket.emit(CHALLENGE_RSP_EVENT, response);
}

/* User processing functions */

/* Adds a user to the active users list, removing the old one if that user is already present */
function activateUser (userID, socket) {
  /* Check that this user ID is valid before allowing socket to be activated */
  userController.localAccess(userID)
    .then(match => {
      if (match) {
        const newUser = new User(userID, socket, match.username, match.avatar, io, sendLobbyInfo);
        const oldIdx = findUserIndex(userID);

        if (oldIdx > -1) {
          activeUsers[oldIdx].disconnect();
          removeUser(oldIdx);
        }

        console.log(`Activating user ${match.username} on socket ${socket.id}`);
        activeUsers.push(newUser);

        newUser.changeRoom('lobby');
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

/* Removes a user at a specified index */
function removeUser (idx) {
  if (idx >= 0 && idx < activeUsers.length) {
    const user = activeUsers[idx];
    console.log(`User ${user.id} removed on socket ${user.socket.id}`);

    /* Send challenge response message to opponent, if any */
    if (user.gameInfo.opponent) {
      const opponentIdx = findUserIndex(user.gameInfo.opponent);
      if (opponentIdx > -1) {
        sendChallengeRsp(activeUsers[opponentIdx].socket, false, 'Your opponent has disconnected.');
        activeUsers[opponentIdx].clearGame();
      }
    }
    gameService.removePlayer(user);

    user.changeRoom();

    activeUsers.splice(idx, 1);
  }
}

/* Finds if the target of the challenge is valid and forwards the challenge */
function processChallenge (socket, username) {
  const challengerIdx = findSocketIndex(socket.id);
  const targetIdx = findUsernameIndex(username);

  /* If challenger already has an active challenge, reject */
  if (challengerIdx === -1 || activeUsers[challengerIdx].gameInfo.opponent) {
    sendChallengeRsp(socket, false, 'You already have an opponent.');
    return;
  }

  /* If target not found, reject */
  if (targetIdx === -1) {
    sendChallengeRsp(socket, false, 'Invalid target for challenge.');
    return;
  }

  /* If target is yourself, reject */
  if (targetIdx === challengerIdx) {
    sendChallengeRsp(socket, false, 'You cannot challenge yourself.');
    return;
  }

  /* If target already has an opponent, reject */
  if (activeUsers[targetIdx].gameInfo.opponent) {
    sendChallengeRsp(socket, false, 'Target is not available to challenge.');
    return;
  }

  /* Target found and available, set pending game info and forward challenge to that client */
  const room = uuid.v4();
  const challenger = activeUsers[challengerIdx];
  const target = activeUsers[targetIdx];

  console.log(`${challenger.username} has challenged ${target.username}`);
  target.challenge(challenger.id, room);
  challenger.challenge(target.id, room);

  target.socket.emit(CHALLENGE_EVENT, { username: challenger.username });
}

/* Processes a challenger withdrawing their challenge */
function processChallengeWithdraw (socket) {
  const challengerIdx = findSocketIndex(socket.id);

  /* If challenger does not exist or does not have an active opponnent, ignore */
  if (challengerIdx === -1 || !activeUsers[challengerIdx].gameInfo.opponent) {
    console.log('Error: received challenge withdrawal from invalid user');
    return;
  }

  const targetIdx = findUserIndex(activeUsers[challengerIdx].gameInfo.opponent);

  /* Clear game info from challenger */
  activeUsers[challengerIdx].clearGame();

  /* If target is valid, clear its game info and send challenge response with withdrawn message */
  if (targetIdx !== -1) {
    activeUsers[targetIdx].clearGame();
    sendChallengeRsp(activeUsers[targetIdx].socket, false, 'The challenge has been withdrawn.');
  }
}

/* Processes response from a challenge's target */
function processChallengeRsp (socket, accepted) {
  const targetIdx = findSocketIndex(socket.id);

  if (targetIdx === -1) {
    console.log('Error: received challenge response from invalid user');
    return;
  }

  const challengerIdx = findUserIndex(activeUsers[targetIdx].gameInfo.opponent);
  if (challengerIdx === -1) {
    console.log('Error: received challenge response for invalid opponent');
    activeUsers[targetIdx].clearGame();
    return;
  }

  const challenger = activeUsers[challengerIdx];
  const target = activeUsers[targetIdx];

  if (challenger.gameInfo.opponent !== target.id) {
    console.log('Error: received challenge response from incorrect target');
    target.clearGame();
    return;
  }

  console.log(`${target.username} has ${accepted ? 'accepted' : 'rejected'} the challenge from ${challenger.username}`);
  /* If challenge was rejected, clear game info for target and challenger. Otherwise, confirm the challenge. */
  if (!accepted) {
    challenger.clearGame();
    target.clearGame();
  } else {
    challenger.confirmChallenge();
    target.confirmChallenge();
    gameService.startGame(challenger, target);
  }

  /* Forward challenge response to initial challenger */
  sendChallengeRsp(challenger.socket, accepted);
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

    /* Process challenge event from client */
    socket.on(CHALLENGE_EVENT, chalInfo => {
      processChallenge(socket, chalInfo.username);
    });

    /* Process challenge withdraw from client */
    socket.on(WITHDRAW_EVENT, () => {
      processChallengeWithdraw(socket);
    });

    /* Process challenge response event from client */
    socket.on(CHALLENGE_RSP_EVENT, rspInfo => {
      processChallengeRsp(socket, rspInfo.accepted === 'true');
    });

    /* On disconnect, remove ID from list of connected users */
    socket.on('disconnect', () => {
      console.log('User disconnected');
      deactivateUser(socket.id);
    });
  });
}

module.exports = start;
