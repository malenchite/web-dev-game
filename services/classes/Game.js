const cardController = require('../../controllers/cardController');
const questionController = require('../../controllers/questionController');

/* Events emitted from game */
const ENTER_GAME_EVENT = 'enter game';
const GAME_OVER_EVENT = 'game over';
const OPPONENT_LEFT_EVENT = 'opponent left';
const NEXT_TURN_EVENT = 'next turn';
const CARD_INFO_EVENT = 'card info';
const TURN_RESULT_EVENT = 'turn result';

/* Events received from players (also possibly related to other players) */
const LEAVE_GAME_EVENT = 'leave game';
const PLAYER_JOINED_EVENT = 'player joined';
const PLAYER_TURN_EVENT = 'player turn';
const CARD_RSP_EVENT = 'card response';

/* Events to stop listening for when a player leaves */
const UNSUBSCRIBE_EVENTS = [
  LEAVE_GAME_EVENT,
  PLAYER_JOINED_EVENT,
  PLAYER_TURN_EVENT,
  CARD_RSP_EVENT
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
    this.cards = [];
    this.frontEndQs = [];
    this.backEndQs = [];
    this.currentPlayer = null;
    this.currentCard = null;
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

    /* Initialize questions */
    questionController.localList('frontend')
      .then(list => { this.frontEndQs = list; });
    questionController.localList('backend')
      .then(list => { this.backEndQs = list; });

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
        this.processCardOption();
        break;
      case 'fund':
        this.processFund();
        break;
      case 'frontend':
        this.processFrontend();
        break;
      case 'backend':
        this.processBackend();
        break;
      case 'bugfix':
        this.processBugfix();
        break;
      default:
        console.log(`Incorrect turn option received: ${turnInfo.option}`);
    }
  }

  sendTurnResult (result) {
    this.io.to(this.id).emit(TURN_RESULT_EVENT, {
      username: this.players[this.currentPlayer].username,
      result
    });

    this.startNextTurn();
  }

  /* Card handling methods */
  processCardOption () {
    this.currentCard = this.drawCard();
    const cardInfo = {
      cardId: this.currentCard._id,
      questionId: this.cardQuestion(this.currentCard)
    };

    this.io.to(this.id).emit(CARD_INFO_EVENT, cardInfo);

    /* Wait for opponent's response */
    this.players.forEach((player, idx) => {
      if (this.currentPlayer !== idx) {
        player.socket.once(CARD_RSP_EVENT, rsp => this.processCardResponse(rsp));
      }
    });
  }

  processCardResponse (rsp) {
    /* Forward response to current player's client */
    this.players[this.currentPlayer].emit(CARD_RSP_EVENT, rsp);

    /* Apply card effect and move to next turn */
    this.applyCard(this.currentCard, rsp.correct === 'true')
      .then(result => {
        this.currentCard = null;
        this.sendTurnResult(result);
      });
  }

  drawCard () {
    const idx = rng(0, this.cards.length);

    /* Remove card from list and return it */
    return this.cards.splice(idx, 1)[0];
  }

  cardQuestion (card) {
    return this.pickQuestion(card.category);
  }

  applyCard (idx, success) {
    const playerState = this.gameState.playerStates[idx];
    return cardController.localCard(this.currentCard._id)
      .then(card => {
        const effect = success ? card.success : card.failure;

        playerState.funding += effect.funding;
        playerState.fep += effect.fep;
        playerState.bep += effect.bep;
        playerState.bugs += effect.bugs;

        return effect;
      });
  }

  /* Question handling methods */
  pickQuestion (category) {
    const list = category === 'frontend' ? this.frontEndQs : this.backEndQs;
    const idx = rng(0, list.length);

    /* Remove question from list and return its ID */
    return list.splice(idx, 1)[0]._id;
  }

  /* Other turn option handlers */
  processFund () {
    const newFunding = rng(0, 3);

    this.gameState.playerStates[this.currentPlayer].funding += newFunding;

    this.sendTurnResult({
      funding: newFunding
    });
  }

  processFrontend () {
    const newFEP = rng(1, 3);

    this.gameState.playerStates[this.currentPlayer].funding -= 1;

    this.sendTurnResult({
      funding: -1,
      fep: newFEP
    });
  }

  processBackend () {
    const newBEP = rng(1, 3);

    this.gameState.playerStates[this.currentPlayer].funding -= 1;

    this.sendTurnResult({
      funding: -1,
      bep: newBEP
    });
  }

  processBugfix () {
    const newBugs = rng(-3, -1);

    this.gameState.playerStates[this.currentPlayer].funding -= 1;

    this.sendTurnResult({
      funding: -1,
      bugs: newBugs
    });
  }
}

module.exports = Game;
