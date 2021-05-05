import React, { useState } from 'react';

import Lobby from '../components/Lobby'
import Game from '../components/Game';


function GameMaster ({ socket, user }) {

  const [gameId, setGameId] = useState(null);
  const [openGame, setOpenGame] = useState(false);

  const updateGameId = (id) => {
    setGameId(id);
  }

  const updateOpenGame = (open) => {
    setOpenGame(open);
  }

  return (
    <div>
      {(openGame && socket && user && gameId)
        ? <Game socket={socket} user={user} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
        : <Lobby socket={socket} user={user} gameId={gameId} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
      }
    </div>
  )
}

export default GameMaster
