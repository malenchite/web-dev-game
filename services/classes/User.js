const uuid = require('uuid');

const CHAT_MESSAGE_EVENT = 'chat message';

class User {
  constructor (userID, socket, username, io, roomCB) {
    this.io = io;
    this.username = username;
    this.id = userID;
    this.socket = socket;
    this.room = null;
    this.roomCB = null;
    this.gameInfo = {
      pending: false, // whether or not the game is a pending challenge
      room: null, // Room ID
      opponent: null // User ID of opponent
    };

    /* Broadcasts chat messages from user to its current room */
    socket.on(CHAT_MESSAGE_EVENT, msg => this.broadcastChat(msg.message));
  }

  changeRoom (room) {
    if (room) {
      this.room = room;
      this.socket.join(room);
    } else if (this.room) {
      this.socket.leave(this.room);
    }

    if (this.roomCB) {
      this.roomCB();
    }
  }

  broadcastChat (message) {
    if (this.room) {
      this.io.to(this.room).emit(CHAT_MESSAGE_EVENT,
        {
          message,
          username: this.username,
          id: uuid.v4()
        });
    }
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
