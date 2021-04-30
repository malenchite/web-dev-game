const uuid = require('uuid');

const CHAT_MESSAGE_EVENT = 'chat message';

class User {
  constructor (userID, socket, username, io) {
    this.io = io;
    this.username = username;
    this.id = userID;
    this.socket = socket;
    this.room = 'lobby';
    this.gameInfo = {
      pending: false, // whether or not the game is a pending challenge
      room: null, // Room ID
      opponent: null // User ID of opponent
    };

    socket.join('lobby');

    /* Broadcasts chat messages from user to its current room */
    socket.on(CHAT_MESSAGE_EVENT, msg => this.broadcastChat(msg.message));
  }

  changeRoom (room) {
    this.room = room;
    this.socket.join(room);
  }

  broadcastChat (message) {
    this.io.to(this.room).emit(CHAT_MESSAGE_EVENT,
      {
        message,
        username: this.username,
        id: uuid.v4()
      });
  }

  challenge (opponent, room) {
    this.gameInfo.pending = true;
    this.gameInfo.room = room;
    this.gameInfo.opponent = opponent;
  }

  confirmChallenge () {
    this.gameInfo.pending = false;
  }

  clearGame () {
    this.pending = false;
    this.gameInfo.room = null;
    this.gameInfo.opponent = null;
  }

  disconnect () {
    console.log(`User ${this.username} disconnected on socket ${this.socket.id}`);
    this.socket.disconnect();
  }
}

module.exports = User;
