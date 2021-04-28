class User {
  constructor (userID, socket) {
    this.id = userID;
    this.socket = socket;
    this.room = 'lobby';
  }

  disconnect () {
    console.log(`User ${this.id} disconnected on socket ${this.socket.id}`);
    this.socket.disconnect();
  }
}

module.exports = User;
