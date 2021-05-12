import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Lobby from "../components/Lobby"
import Game from "../components/Game";
import GameRules from "../components/GameRules";

const DEV_ENDPOINT = "http://localhost:3001";
const USER_INFO_EVENT = "user info";

function GameMaster ({ user, logout }) {
  const [gameId, setGameId] = useState(null);
  const [openGame, setOpenGame] = useState(false);
  const [socket, setSocket] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);

  function classNames (...classes) {
    return classes.filter(Boolean).join(" ")
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
    <div className="grid grid-cols-3 gap-1 mt-3" style={{ gridTemplateColumns: "2rem auto 2rem" }}>
      <div>
        <div className="transform -rotate-90 translate-y-36">
          <div>
            <div
              aria-hidden="true"
              onClick={openRules}
              className="font-medium cursor-pointer select-none px-1 py-1 rounded-b-md w-40 bg-red-linen"
            >
              Game Rules
            </div>
          </div>
        </div>
      </div>
      <GameRules open={rulesOpen} closeRules={closeRules} />
      {
        (openGame && socket && user && gameId)
          ? <Game socket={socket} user={user} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
          : <Lobby socket={socket} user={user} gameId={gameId} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
      }
    </div >
  )
}

export default GameMaster;
