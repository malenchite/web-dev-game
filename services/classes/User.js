class User {
  constructor (userID, socket, username) {
    this.username = username;
    this.id = userID;
    this.socket = socket;
    this.room = 'lobby';
    this.challenge = {
      id: null, // Unique identifer of this player's current outgoing challenge
      opponent: '' // User ID of opponent challenged
    };

    socket.join('lobby');
  }

  changeRoom (room) {
    this.room = room;
    this.socket.join(room);
  }

  disconnect () {
    console.log(`User ${this.username} disconnected on socket ${this.socket.id}`);
    this.socket.disconnect();
  }
}

module.exports = User;
