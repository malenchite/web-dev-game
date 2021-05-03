const Game = require('./classes/Game');

const activeGames = [];
let io;

/* Utility functions */
function findGameByID (id) {
  return activeGames.find(game => game.id === id);
}

/* Game engine functions */

/* Callback function for when game ends */
function endCB (id) {
  const idx = findGameByID(id);

  if (idx > -1) {
    activeGames.splice(idx, 1);
  }
}

/* Exported functions */
function initialize (newIO) {
  io = newIO;
}

function startGame (player1, player2) {
  const newGame = Game(io, player1.gameInfo.room, [player1, player2], endCB);

  newGame.start();

  activeGames.push(newGame);
}

function removePlayer (player) {
  for (let i = 0; i < activeGames.length; i++) {
    if (activeGames[i].players.includes(player)) {
      /* TODO: implement Game object player disconnect response */
      // activeGames[i].playerDisconnect(player);
      break;
    }
  }
}

module.exports = {
  initialize,
  startGame,
  removePlayer
};
