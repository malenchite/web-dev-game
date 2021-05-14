const Game = require('./classes/Game');

const activeGames = []; // List of currently running games
let io;

/* Utility functions */

/* Finds a game in the list by its unique ID */
function findGameByID (id) {
  return activeGames.find(game => game.id === id);
}

/* Game engine functions */

/* Callback function for when game ends - removes the game from the list */
function endCB (id) {
  const idx = findGameByID(id);

  if (idx > -1) {
    activeGames.splice(idx, 1);
  }
}

/* Exported functions */

/* Initializes game service */
function initialize (newIO) {
  io = newIO;
}

/* Starts a new game with the provided player User objects */
function startGame (player1, player2) {
  const newGame = new Game(io, player1.gameInfo.room, [player1, player2], endCB);

  newGame.start();

  activeGames.push(newGame);
}

/* Removes a player from their game by finding the game and calling the disconnect method */
function removePlayer (player) {
  for (let i = 0; i < activeGames.length; i++) {
    if (activeGames[i].players.includes(player)) {
      activeGames[i].playerDisconnect(player);
      break;
    }
  }
}

module.exports = {
  initialize,
  startGame,
  removePlayer
};
