const cardController = require('../../controllers/cardController');

/* Events emitted from game */
const ENTER_GAME_EVENT = 'enter game';
const GAME_OVER_EVENT = 'game over';
const OPPONENT_LEFT_EVENT = 'opponent left';
const NEXT_TURN_EVENT = 'next turn';

/* Events received from players (also possibly related to other players) */
const LEAVE_GAME_EVENT = 'leave game';
const PLAYER_JOINED_EVENT = 'player joined';
const PLAYER_TURN_EVENT = 'player turn';

/* Events to stop listening for when a player leaves */
const UNSUBSCRIBE_EVENTS = [
  LEAVE_GAME_EVENT,
  PLAYER_JOINED_EVENT,
  PLAYER_TURN_EVENT
];

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
    this.ready = Array.from({ length: players.length }, false);
    this.currentPlayer = null;
    this.gameState = {
      turn: 0,
      gameOver: false,
      winner: null,
      playerStates: Array.from({ length: players.length }, {
        username: null,
        funding: 2,
        fep: 0,
        bep: 0,
        bugs: 0
      })
    };
  }

  /* Startup/shutdown methods */
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
      player.socket.once(PLAYER_JOINED_EVENT, () => this.joinPlayer(idx));
    });

    /* Subscribe to "leave game" event for all players */
    this.players.forEach((player, idx) => {
      player.socket.once(LEAVE_GAME_EVENT, () => this.playerLeft(idx));
    });
  }

  end () {
    this.endCB(this.id);
  }

  gameOver () {
    this.io.to(this.id).emit(GAME_OVER_EVENT, { gameState: this.gameState });
  }

  /* Player management methods */
  joinPlayer (idx) {
    this.ready[idx] = true;

    /* If every player is ready, start the game */
    if (this.ready.every(rdy => rdy)) {
      this.startNextTurn();
    }
  }

  removePlayer (idx) {
    if (this.players[idx]) {
      this.players[idx].changeRoom('lobby');
      this.players[idx] = null;
      UNSUBSCRIBE_EVENTS.forEach(event => this.socket.off(event));
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

  playerDisconnect (player) {
    const idx = this.players.indexOf(player);

    if (idx !== -1) {
      this.playerLeft(idx);
    }
  }

  /* Game flow methods */
  startNextTurn () {
    this.gameState.turn++;
    /* Update all players and set/remove listeners */
    this.players.forEach((player, idx) => {
      if (player) {
        /* Send next turn with current game state */
        player.socket.emit(NEXT_TURN_EVENT, {
          yourTurn: this.currentPlayer === idx,
          gameState: this.gameState
        });

        /* Set listeners */
        if (this.currentPlayer === idx) {
          player.socket.on(PLAYER_TURN_EVENT, turnInfo => this.processPlayerTurn(turnInfo));
        } else {
          player.socket.off(PLAYER_TURN_EVENT);
        }
      }
    });
  }

  processPlayerTurn (turnInfo) {
    /* Relay turn choice to other players */
    this.players.forEach((player, idx) => {
      if (idx !== this.currentPlayer && player) {
        player.socket.emit(PLAYER_TURN_EVENT, {
          username: this.players[this.currentPlayer].username,
          turnInfo
        });
      }
    });

    console.log(`${this.players[this.currentPlayer].username} chose: ${turnInfo.option}`);

    switch (turnInfo.option) {
      case 'card':
        break;
      case 'fund':
        break;
      case 'frontend':
        break;
      case 'backend':
        break;
      case 'bugfix':
        break;
      default:
        console.log(`Incorrect turn option received: ${turnInfo.option}`);
    }
  }
}

module.exports = Game;
