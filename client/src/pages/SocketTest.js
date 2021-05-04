import { useState, useEffect } from "react";
import io from "socket.io-client";
import AUTH from "../utils/AUTH";
import { Card } from '../components/Card';
import { Input } from '../components/Form';
import GamePage from './gamePage';

const ENDPOINT = "http://localhost:3001";
const CHALLENGE_EVENT = 'challenge';
const CHALLENGE_RSP_EVENT = 'challenge response';
const CHAT_MESSAGE_EVENT = 'chat message';
const LOBBY_INFO_EVENT = 'lobby info';
const USER_INFO_EVENT = "user info";
const ENTER_GAME_EVENT = 'enter game';

function SocketTest () {
  const [socket, setSocket] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [reason, setReason] = useState(undefined);
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [challenger, setChallenger] = useState(null);
  const [challengeRsp, setChallengeRsp] = useState(null);
  const [chat, setChat] = useState([]);
  const [game, setGame] = useState(null);
  const [openGame, setOpenGame] = useState(false);
  const [userObject, setUserObject] = useState({
    username: '',
    password: ''
  });

  const login = (username, password) => {
    AUTH.login(username, password).then(response => {
      console.log(response.data);
      if (response.status === 200) {
        connectUser(response.data.user);
        setUserInfo(response.data.user);
      }
    });
  };

  const logout = () => {
    AUTH.logout().then(response => {
      console.log(response.data);
      if (response.status === 200) {
        disconnectUser();
        setUserInfo(null);
        setChallenger(null);
        setChallengeRsp(null);
        setLobbyUsers([]);
        setChat([]);
      }
    });
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.length > 0 && socket) {
      console.log(`Sending message: ${message}`);
      socket.emit(CHAT_MESSAGE_EVENT, { message });
    }
  }

  const handleChange = (event) => {
    setUserObject({
      ...userObject,
      [event.target.name]: event.target.value
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    login(userObject.username, userObject.password);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };

  const handleChallenge = (event) => {
    event.preventDefault();

    setChallengeRsp(null);
    if (socket) {
      socket.emit(CHALLENGE_EVENT, { username: event.target.value });
    }
  }

  const handleChallengeResponse = (event) => {
    event.preventDefault();

    setChallenger(null);
    if (socket) {
      socket.emit(CHALLENGE_RSP_EVENT, { accepted: event.target.value });
    }
  }

  const handleEnterGame = gameInfo => {
    setGame(gameInfo.gameId);
  }

  const connectUser = (info) => {
    if (!info) {
      console.log('No user to connect!');
      return;
    }

    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(ENDPOINT);

    newSocket.on('connect', () => {
      newSocket.emit(USER_INFO_EVENT, {
        userId: info._id
      });

      console.log(`Connecting on socket ${newSocket.id} as user ${info._id}`);

      /* Store socket in state */
      setSocket(newSocket);

      /* Update lobby user list */
      newSocket.on(LOBBY_INFO_EVENT, lobbyInfo => {
        console.log("Updating lobby info");
        setLobbyUsers(lobbyInfo.users);
      });

      /* Update chat messages */
      newSocket.on(CHAT_MESSAGE_EVENT, msg => {
        setChat(prevChat => [...prevChat, msg]);
      });


      /* Receive challenge message */
      newSocket.on(CHALLENGE_EVENT, msg => {
        console.log("Challenge received", msg);
        setChallenger(msg.username);
      });

      /* Receive challenge response */
      newSocket.on(CHALLENGE_RSP_EVENT, rsp => {
        console.log("Challenge response received", rsp);
        setChallengeRsp(rsp);
      });


      /* Receive enter game */
      newSocket.on(ENTER_GAME_EVENT, gameInfo => {
        console.log("Enter Game event received", gameInfo);
        handleEnterGame(gameInfo);
      });

      newSocket.on('disconnect', reason => {
        setReason(reason);
        if (reason === 'io server disconnect') {
          logout();
          setSocket(null);
        }
      });
    });
  }

  const disconnectUser = () => {
    if (socket) {
      console.log(`Disconnecting socket ${socket.id}`);
      socket.disconnect();
      setSocket(null);
    }
  }

  const updateGame = (id) => {
    setGame(id);
  }

  const handleGameButton = () => {
    setOpenGame(true);
  }

  return (
    <div>
      { !openGame ? (
        <>
          {socket && socket.connected ? <h1>Socket opened as {socket.id}</h1> : <h1>Socket not connected</h1>}
          {userInfo ? <h2>User logged in as {userInfo.username} ({userInfo._id})</h2> : <h2>No user logged in</h2>}
          {reason ? <h2>Last disconnect due to {reason}</h2> : ""}
          <Card title="Socket Login Test">
            <form style={{ marginTop: 10 }}>
              <label htmlFor="username">Username: </label>
              <Input
                type="text"
                name="username"
                value={userObject.username}
                onChange={handleChange}
              />
              <label htmlFor="password">Password: </label>
              <Input
                type="password"
                name="password"
                value={userObject.password}
                onChange={handleChange}
              />
              <button onClick={handleLogin}>Login</button>
              <br />
              <button onClick={handleLogout}>Disconnect</button>
              <br />
            </form>
          </Card>
          <Card>
            <h3>Users in lobby:</h3>
            <ul>
              {lobbyUsers.map(user => <li key={user}>{user} <button value={user} onClick={handleChallenge}>Challenge</button></li>)}
            </ul>
          </Card>
          <Card>
            <form>
              <label htmlFor="message">Send Message: </label>
              <Input
                type="text"
                name="message"
                value={message}
                onChange={handleMessageChange}
              />
              <button onClick={handleSendMessage}>Send</button>
            </form>
          </Card>
          <Card>
            {
              challenger && (
                <form>
                  <label htmlFor="challenge">You have been challenged by {challenger} </label>
                  <br />
                  <button value={true} onClick={handleChallengeResponse}>Accept</button>
                  <br />
                  <button value={false} onClick={handleChallengeResponse}>Reject</button>
                </form>
              )
            }
            {
              challengeRsp && (
                <div>
                  <span>Your recent challenge has been {challengeRsp.accepted ? "accepted" : "rejected"}.</span>
                  <br />
                  {challengeRsp.message && <span>The rejection message said: "{challengeRsp.message}"</span>}
                </div>
              )
            }
            {
              game && (
                <div>
                  <span>Your game is ready to enter!</span>
                  <br />
                  <button onClick={handleGameButton}>Enter Game</button>
                </div>
              )
            }
          </Card>
          <h3>Messages:</h3>
          <ul>
            {chat.map(msg => <li key={msg.id}>{msg.username}: {msg.message}</li>)}
          </ul>
        </>
      ) : (
        <GamePage socket={socket} user={userInfo} game={game} updateGame={updateGame} />
      )
      }
    </div >
  );
}

export default SocketTest;
