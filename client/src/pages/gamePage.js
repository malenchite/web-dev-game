import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Form';
import GameRender from '../components/GameRender';

/* Events emitted from server */
const GAME_OVER_EVENT = 'game over';
const OPPONENT_LEFT_EVENT = 'opponent left';
const NEXT_TURN_EVENT = 'next turn';
const CARD_INFO_EVENT = 'card info';
const TURN_RESULT_EVENT = 'turn result';

/* Events sent by players (also possibly relayed by server) */
const CHAT_MESSAGE_EVENT = 'chat message';
const LEAVE_GAME_EVENT = 'leave game';
const PLAYER_JOINED_EVENT = 'player joined';
const PLAYER_TURN_EVENT = 'player turn';
const CARD_RSP_EVENT = 'card response';

/* Events to unsubscribe from when leaving */
const UNSUBSCRIBE_EVENTS = [
  GAME_OVER_EVENT,
  OPPONENT_LEFT_EVENT,
  NEXT_TURN_EVENT,
  CARD_INFO_EVENT,
  TURN_RESULT_EVENT,
  PLAYER_TURN_EVENT,
  CARD_RSP_EVENT,
  CHAT_MESSAGE_EVENT
];

function GamePage ({ socket, user, game, setGame }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    if (socket) {
      socket.removeAllListeners(CHAT_MESSAGE_EVENT);

      socket.on(CHAT_MESSAGE_EVENT, msg => {
        console.log("Chat message event");
        setChat(prevChat => [...prevChat, msg]);
      });

      socket.emit(PLAYER_JOINED_EVENT);

      socket.on(OPPONENT_LEFT_EVENT, processOpponentLeft);

      socket.on(NEXT_TURN_EVENT, gameState => processNextTurn(gameState));

      return () => {
        if (socket) {
          UNSUBSCRIBE_EVENTS.forEach(event => {
            socket.removeAllListeners(event);
          });
        }
      }
    }
  }, [socket]);

  /* Check that we have all the data we need */
  const gameCheck = () => {
    return (socket && user && game && game !== '');
  }

  /* Chat room handling */
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    console.log(message, socket);
    if (message.length > 0 && socket) {
      socket.emit(CHAT_MESSAGE_EVENT, { message });
    }
  }

  /* Game flow handling */
  const processOpponentLeft = () => {

  }

  const processNextTurn = gameState => {
    setGameState(gameState);
  }

  return (
    <div>
      {gameCheck() ? (
        <>
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
          <h3>Messages:</h3>
          <ul>
            {chat.map(msg => <li key={msg.id}>{msg.username}: {msg.message}</li>)}
          </ul>
          <GameRender gameState={gameState} setGameState={setGameState} />
        </>
      )
        : <Redirect to="/" />
      }
    </div>
  );
}

export default GamePage