const cardController = require('../../controllers/cardController');

const ENTER_GAME_EVENT = 'enter game';
const GAME_OVER_EVENT = 'game over';
const OPPONENT_LEFT_EVENT = 'opponent left';
const LEAVE_GAME_EVENT = 'leave game';
const PLAYER_JOINED_EVENT = 'player joined';

/* Generic RNG */
function rng (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class Game {
  constructor (io, id, players, endCB) {
    this.io = io;
    this.id = id;
    this.players = players;
    this.endCB = endCB;
    this.cards = [];
    this.gameState = {
      ready: Array.from({ length: players.length }, false),
      currentPlayer: null,
      gameOver: false,
      playerStats: Array.from({ length: players.length }, {})
    };
  }

  start () {
    this.players.forEach(player => player.changeRoom(this.id));

    /* Let players know it's time to enter the game */
    this.io.to(this.id).emit(ENTER_GAME_EVENT);

    /* Initialize card deck */
    cardController.localList()
      .then(list => { this.cards = list; });

    /* Randomly determine starting player */
    this.currentPlayer = rng(0, this.players.length);

    /* Subscribe to "player joined" event for all players */
    this.players.forEach((player, idx) => {
      player.socket.on(PLAYER_JOINED_EVENT, () => this.joinPlayer(idx));
    });

    /* Subscribe to "leave game" event for all players */
    this.players.forEach((player, idx) => {
      player.socket.on(LEAVE_GAME_EVENT, () => this.playerLeft(idx));
    });
  }

  end () {
    this.endCB(this.id);
  }

  gameOver () {
    this.io.to(this.id).emit(GAME_OVER_EVENT, this.gameState);
  }

  joinPlayer (idx) {
    this.gameState.ready[idx] = true;
  }

  removePlayer (idx) {
    if (this.players[idx]) {
      this.players[idx].changeRoom('lobby');
      this.players[idx] = null;
    }

    /* If all players are gone, end the game */
    if (this.players.every(player => player === null)) {
      this.end();
    }
  }

  playerLeft (idx) {
    this.removePlayer(idx);

    /* Alert room if this occurs before game over */
    if (!this.gameState.gameOver) {
      this.io.to(this.id).emit(OPPONENT_LEFT_EVENT);
    }
  }
}

module.exports = Game;
