const uuid = require('uuid');

const CHAT_MESSAGE_EVENT = 'chat message';

class User {
  constructor (userID, socket, username, avatar, io, roomCB) {
    this.io = io;
    this.username = username;
    this.avatar = avatar;
    this.id = userID;
    this.socket = socket;
    this.room = null;
    this.roomCB = roomCB; // Callback to trigger when a user changes rooms
    this.gameInfo = {
      room: null, // Room ID of upcoming game
      opponent: null // User ID of opponent
    };

    /* Broadcasts chat messages from user to its current room */
    socket.on(CHAT_MESSAGE_EVENT, msg => this.broadcastChat(msg.message));
  }

  /* Leave current room and join the new one. Also callback if necessary. */
  changeRoom (room) {
    this.socket.leave(this.room);

    if (room) {
      this.room = room;
      this.socket.join(room);
    } else {
      this.room = null;
    }
    if (this.roomCB) {
      this.roomCB();
    }
  }

  /* Sends a chat message to all members of the user's current room */
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

  /* Set the challenge information for a new challenge */
  challenge (opponent, room) {
    this.gameInfo.room = room;
    this.gameInfo.opponent = opponent;
  }

  /* Clears the challenge/game information */
  clearGame () {
    this.gameInfo.room = null;
    this.gameInfo.opponent = null;
  }

  /* Disconnects the user's socket */
  disconnect () {
    console.log(`User ${this.username} disconnected on socket ${this.socket.id}`);
    this.socket.disconnect();
  }
}

module.exports = User;
