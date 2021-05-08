import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import Lobby from '../components/Lobby'
import Game from '../components/Game';
import SlideOver from '../components/Slideover';

const DEV_ENDPOINT = "http://localhost:3001";
const USER_INFO_EVENT = "user info";

function GameMaster ({ user }) {
  const [gameId, setGameId] = useState(null);
  const [openGame, setOpenGame] = useState(false);
  const [socket, setSocket] = useState(null);

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

  return (
    <div>
      <SlideOver />
      {(openGame && socket && user && gameId)
        ? <Game socket={socket} user={user} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
        : <Lobby socket={socket} user={user} gameId={gameId} updateGameId={updateGameId} updateOpenGame={updateOpenGame} />
      }
    </div>
  )
}

export default GameMaster
