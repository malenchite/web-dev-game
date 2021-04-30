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

module.exports = {
  initialize,
  startGame
};
