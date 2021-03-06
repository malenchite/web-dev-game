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

const GAME_OVER_TURN = process.env.GAME_OVER_TURN || 30;

/* Generic RNG */
function rng (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

class Game {
  constructor (io, id, players, endCB) {
    this.io = io;
    this.id = id;
    this.players = players;
    this.endCB = endCB; // Callback function to trigger when game ends
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
          avatar: null,
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
    /* Initialize card deck */
    this.refreshCards();

    /* Initialize questions */
    this.refreshQuestions('frontend');
    this.refreshQuestions('backend');

    /* Randomly determine starting player */
    this.currentPlayer = rng(0, this.players.length);

    /* Subscribe to "player joined" event for all players */
    this.players.forEach((player, idx) => {
      player.socket.once(PLAYER_JOINED_EVENT, () => this.processPlayerJoined(idx));
    });

    /* Subscribe to "leave game" event for all players */
    this.players.forEach((player, idx) => {
      player.socket.once(LEAVE_GAME_EVENT, () => this.processLeaveGame(idx));
    });

    /* Store usernames and avatars in game state and let players know they can enter the game */
    this.players.forEach((player, idx) => {
      this.gameState.playerStates[idx].username = player.username;
      this.gameState.playerStates[idx].avatar = player.avatar;
      player.socket.emit(ENTER_GAME_EVENT, { gameId: this.id });
    });
  }

  end () {
    this.endCB(this.id);
  }

  /* Game over processing, including final score calculation and announcement */
  gameOver () {
    this.gameState.gameOver = true;
    let topScore = -Infinity;
    let winningIdx = -1;
    let tie = false;

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

    if (this.gameState.playerStates.every(state => state.score === topScore)) {
      tie = true;
    }

    /* Stop listening for game process events */
    this.players.forEach((player) => {
      player.socket.removeAllListeners(PLAYER_TURN_EVENT);
      player.socket.removeAllListeners(CARD_RSP_EVENT);
    });

    if (!tie) {
      this.gameState.winner = this.players[winningIdx].username;
    }

    this.io.to(this.id).emit(GAME_OVER_EVENT, { gameState: this.gameState });
  }

  /* Player management methods */

  /* Process when a player's client has joined the game - when everyone's in, start the game */
  processPlayerJoined (idx) {
    this.ready[idx] = true;
    this.players[idx].changeRoom(this.id);

    /* If every player is ready, start the game */
    if (this.ready.every(rdy => rdy)) {
      /* If any players have left before game start, then announce this to players as they join */
      if (this.players.some(player => player === null)) {
        this.io.to(this.id).emit(OPPONENT_LEFT_EVENT);
      } else {
        this.startNextTurn();
      }
    }
  }

  /* Remove a player from the players list because they've left for any reason */
  removePlayer (idx) {
    if (this.players[idx]) {
      const player = this.players[idx];
      player.clearGame();
      player.changeRoom('lobby');
      if (player.socket) {
        UNSUBSCRIBE_EVENTS.forEach(event => player.socket.removeAllListeners(event));
      }
    }
    this.players[idx] = null;
    /* If all players are gone, end the game */
    if (this.players.every(player => player === null)) {
      this.end();
    }
  }

  /* Processes the Leave Game event, removing that player and announcing if needed */
  processLeaveGame (idx) {
    this.removePlayer(idx);

    /* Alert room if this occurs before game over */
    if (!this.gameState.gameOver) {
      this.io.to(this.id).emit(OPPONENT_LEFT_EVENT);
    }
  }

  /* Called externally when a player disconnects to remove them from the game */
  playerDisconnect (player) {
    const idx = this.players.indexOf(player);

    if (idx !== -1) {
      this.processLeaveGame(idx);
    }
  }

  /* Game flow methods */

  /* All next turn processing, including the first turn of the game */
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
          currentPlayer: this.players[this.currentPlayer].username,
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

  /* Processes a player's choice for their action during a turn */
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

  /* Called at the end of every turn option to record and announce the result */
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

  /* Picks a card and a question and announces the IDs to all players */
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

  /* Tell the current player how their answer was judged and wait for their acknowledgement */
  processCardResponse (rsp) {
    /* Forward response to current player's client */
    this.players[this.currentPlayer].socket.emit(CARD_RSP_EVENT, rsp);

    /* Wait for current player to acknowledge */
    this.players[this.currentPlayer].socket.once(CARD_ACK_EVENT, () => this.processCardAck(rsp));
  }

  /* When current player acknowledges the answer, process the card effect and move on */
  processCardAck (rsp) {
    /* Apply card effect and move to next turn */
    this.getCardEffect(rsp.correct)
      .then(effect => {
        this.currentCard = null;
        this.processTurnResult(effect, 'card', rsp.correct);
      });
  }

  /* Refresh the card list with all cards from the DB. Used on start and if the list ever runs out. */
  refreshCards () {
    cardController.localList()
      .then(list => { this.cards = list; });
  }

  /* Pick a card at random from the remaining list, refreshing if the deck runs out */
  drawCard () {
    const idx = rng(0, this.cards.length);
    const card = this.cards.splice(idx, 1)[0]; // Retrieve card and remove from list

    /* Refresh deck is empty */
    if (card.length < 1) {
      this.refreshCards();
    }

    return card;
  }

  /* Choose a question that matches a card's category */
  cardQuestion (card) {
    return this.pickQuestion(card.category);
  }

  /* Retrieve the card effect information from the DB */
  getCardEffect (success) {
    return cardController.localCard(this.currentCard._id)
      .then(card => {
        const effect = success ? card.success : card.failure;

        return effect;
      });
  }

  /* Question handling methods */

  /* Fills the front end or backend list. Used both at start and if either runs out */
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

  /* Choose a question at random in a category. Refill if list is emptied */
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

  /* Processing Seek Funding option that adds funding */
  processFund () {
    const newFunding = rng(0, 3);

    this.processTurnResult({
      funding: newFunding
    }, 'fund');
  }

  /* Process Work on Front-End option that adds front-end and, possibly, bugs */
  processFrontend () {
    const newFEP = rng(1, 3);
    const newBugs = rng(0, newFEP);

    this.processTurnResult({
      funding: -1,
      fep: newFEP,
      bugs: newBugs
    }, 'frontend');
  }

  /* Process Work on Back-End option that adds back-end and, possibly, bugs */
  processBackend () {
    const newBEP = rng(1, 3);
    const newBugs = rng(0, newBEP);

    this.processTurnResult({
      funding: -1,
      bep: newBEP,
      bugs: newBugs
    }, 'backend');
  }

  /* Process Fix Bugs option that removes bugs */
  processBugfix () {
    const newBugs = rng(1, 3);

    this.processTurnResult({
      funding: -1,
      bugs: -1 * newBugs
    }, 'bugfix');
  }
}

module.exports = Game;
