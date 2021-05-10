import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import Lobby from '../components/Lobby'
import Game from '../components/Game';
import GameRules from '../components/GameRules';

const DEV_ENDPOINT = "http://localhost:3001";
const USER_INFO_EVENT = "user info";

function GameMaster ({ user, logout }) {
  const [gameId, setGameId] = useState(null);
  const [openGame, setOpenGame] = useState(false);
  const [socket, setSocket] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);

  function classNames (...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    connectUser();
  }, [user])

  useEffect(() => {
    return () => disconnectUser();
  }, [socket]);

  const connectUser = () => {
    if (!user) {
      return;
    }

    if (socket) {
      socket.disconnect();
    }

    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(DEV_ENDPOINT);

    newSocket.on("connect", () => {
      newSocket.emit(USER_INFO_EVENT, {
        userId: user._id,
      });

      /* Store socket in state */
      setSocket(newSocket);

      newSocket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          logout();
          setSocket(null);
        }
      });
    });
  };

  const disconnectUser = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const updateGameId = (id) => {
    setGameId(id);
  }

  const updateOpenGame = (open) => {
    setOpenGame(open);
  }

  const openRules = () => {
    setRulesOpen(true);
  }

  const closeRules = () => {
    setRulesOpen(false);
  }

  return (
    <div>
      {/* Slideover Code */}
      <div>
        <div
          className={classNames(
            rulesOpen ? 'text-gray-900' : 'text-gray-500',
            'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer select-none'
          )}>
          <span
            className={classNames(rulesOpen ? 'text-gray-600' : 'text-gray-400', 'ml-2 group-hover:text-gray-500')}
            aria-hidden="true"
            onClick={openRules}
          >
            Game Rules
        </span>
        </div>
      </div>
      <div>
        <GameRules open={rulesOpen} closeRules={closeRules} />
        {(openGame && socket && user && gameId)
          ? <Game socket={socket} user={user} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
          : <Lobby socket={socket} user={user} gameId={gameId} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
        }
      </div>
    </div>
  )
}

export default GameMaster;
