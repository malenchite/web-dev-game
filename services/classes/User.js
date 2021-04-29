const uuid = require('uuid');

const CHAT_MESSAGE_EVENT = 'chat message';

class User {
  constructor (userID, socket, username, io) {
    this.io = io;
    this.username = username;
    this.id = userID;
    this.socket = socket;
    this.room = 'lobby';
    this.challenge = {
      id: null, // Unique identifer of this player's current outgoing challenge
      opponent: '' // User ID of opponent challenged
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

  disconnect () {
    console.log(`User ${this.username} disconnected on socket ${this.socket.id}`);
    this.socket.disconnect();
  }
}

module.exports = User;
