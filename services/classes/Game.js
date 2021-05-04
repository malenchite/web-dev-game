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
const CARD_ACK_EVENT = 'card acknowledge';

/* Events to stop listening for when a player leaves */
const UNSUBSCRIBE_EVENTS = [
  LEAVE_GAME_EVENT,
  PLAYER_JOINED_EVENT,
  PLAYER_TURN_EVENT,
  CARD_RSP_EVENT
];

const GAME_OVER_TURN = 6;

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
    this.ready = Array.from({ length: players.length }, () => false);
    this.cards = [];
    this.frontEndQs = [];
    this.backEndQs = [];
    this.currentPlayer = null;
    this.currentCard = null;
    this.gameState = {
      turn: 0,
      gameOver: false,
      winner: null,
      playerStates: Array.from({ length: players.length }, () => {
        return {
          username: null,
          score: null,
          funding: 2,
          fep: 0,
          bep: 0,
          bugs: 0
        };
      })
    };
  }

  /* Startup/shutdown methods */
  start () {
    this.players.forEach((player, idx) => {
      player.changeRoom(this.id);
      this.gameState.playerStates[idx].username = player.username;
    });

    /* Let players know it's time to enter the game */
    this.io.to(this.id).emit(ENTER_GAME_EVENT, { gameId: this.id });

    /* Initialize card deck */
    this.refreshCards();

    /* Initialize questions */
    this.refreshQuestions('frontend');
    this.refreshQuestions('backend');

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
    this.gameState.gameOver = true;
    let topScore = -Infinity;
    let winningIdx = -1;

    this.gameState.playerStates.forEach((state, idx) => {
      let score = Math.min(state.fep, state.bep) - state.bugs;

      if (state.funding < 0) {
        score += state.funding;
      }

      if (score > topScore) {
        winningIdx = idx;
        topScore = score;
      }
      state.score = score;
    });

    /* Stop listening for game process events */
    this.players.forEach((player, idx) => {
      player.socket.removeAllListeners(PLAYER_TURN_EVENT);
      player.socket.removeAllListeners(CARD_RSP_EVENT);
    });

    this.gameState.winner = this.players[winningIdx].username;

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
      if (this.players[idx].socket) {
        UNSUBSCRIBE_EVENTS.forEach(event => this.players[idx].socket.removeAllListeners(event));
      }
    }
    this.players[idx] = null;
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

    /* Pass turn to next player */
    this.currentPlayer = (this.currentPlayer + 1) % (this.players.length);

    if (this.gameState.turn > GAME_OVER_TURN) {
      this.gameOver();
    }

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
          player.socket.removeAllListeners(PLAYER_TURN_EVENT);
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

    switch (turnInfo.choice) {
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
        console.log(`Incorrect turn option received: ${turnInfo.choice}`);
        this.processTurnResult({});
    }
  }

  processTurnResult (result, choice, success) {
    const playerState = this.gameState.playerStates[this.currentPlayer];

    /* Apply results to player state */
    playerState.funding += result.funding ? result.funding : 0;
    playerState.fep += result.fep ? result.fep : 0;
    playerState.bep += result.bep ? result.bep : 0;
    playerState.bugs += result.bugs ? result.bugs : 0;

    /* Check boundaries */
    playerState.fep = Math.max(playerState.fep, 0);
    playerState.bep = Math.max(playerState.bep, 0);
    playerState.bugs = Math.max(playerState.bugs, 0);

    const turnResult = {
      username: this.players[this.currentPlayer].username,
      choice,
      result
    };

    if (success !== undefined) {
      turnResult.success = success;
    }

    /* Send turn result to all players */
    this.io.to(this.id).emit(TURN_RESULT_EVENT, turnResult);

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
    this.players[this.currentPlayer].socket.emit(CARD_RSP_EVENT, rsp);

    /* Wait for current player to acknowledge */
    this.players[this.currentPlayer].socket.once(CARD_ACK_EVENT, () => this.processCardAck(rsp));
  }

  processCardAck (rsp) {
    /* Apply card effect and move to next turn */
    this.getCardEffect(rsp.correct)
      .then(effect => {
        this.currentCard = null;
        this.processTurnResult(effect, 'card', rsp.correct);
      });
  }

  refreshCards () {
    cardController.localList()
      .then(list => { this.cards = list; });
  }

  drawCard () {
    const idx = rng(0, this.cards.length);
    const card = this.cards.splice(idx, 1)[0]; // Retrieve card and remove from list

    /* Refresh deck is empty */
    if (card.length < 1) {
      this.refreshCards();
    }

    return card;
  }

  cardQuestion (card) {
    return this.pickQuestion(card.category);
  }

  getCardEffect (success) {
    return cardController.localCard(this.currentCard._id)
      .then(card => {
        const effect = success ? card.success : card.failure;

        return effect;
      });
  }

  /* Question handling methods */
  refreshQuestions (category) {
    questionController.localList(category)
      .then(list => {
        if (category === 'frontend') {
          this.frontEndQs = list;
        } else if (category === 'backend') {
          this.backEndQs = list;
        }
      });
  }

  pickQuestion (category) {
    const list = category === 'frontend' ? this.frontEndQs : this.backEndQs;
    const idx = rng(0, list.length);
    const question = list.splice(idx, 1)[0]._id; // Retrieve question ID and remove from list

    /* Refresh deck is empty */
    if (list.length < 1) {
      this.refreshQuestions(category);
    }

    return question;
  }

  /* Other turn option handlers */
  processFund () {
    const newFunding = rng(0, 3);

    this.processTurnResult({
      funding: newFunding
    }, 'fund');
  }

  processFrontend () {
    const newFEP = rng(1, 3);
    const newBugs = rng(0, newFEP);

    this.processTurnResult({
      funding: -1,
      fep: newFEP,
      bugs: newBugs
    }, 'frontend');
  }

  processBackend () {
    const newBEP = rng(1, 3);
    const newBugs = rng(0, newBEP);

    this.processTurnResult({
      funding: -1,
      bep: newBEP,
      bugs: newBugs
    }, 'backend');
  }

  processBugfix () {
    const newBugs = rng(1, 3);

    this.processTurnResult({
      funding: -1,
      bugs: -1 * newBugs
    }, 'bugfix');
  }
}

module.exports = Game;
