import { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Input } from '../Form';
import GameRender from '../GameRender';
import API from '../../utils/API';

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
const CARD_ACK_EVENT = 'card acknowledge';

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

function Game({ socket, user, updateGameId, updateOpenGame }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [yourTurn, setYourTurn] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [lastTurnResult, setLastTurnResult] = useState(null);
  const [card, setCard] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [questionText, setQuestionText] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [choiceMade, setChoiceMade] = useState(false);
  const [judgementMade, setJudgementMade] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on(CHAT_MESSAGE_EVENT, msg => {
        setChat(prevChat => [...prevChat, msg]);
      });

      socket.emit(PLAYER_JOINED_EVENT);

      socket.on(OPPONENT_LEFT_EVENT, processOpponentLeft);

      socket.on(NEXT_TURN_EVENT, gameState => processNextTurn(gameState));

      socket.on(TURN_RESULT_EVENT, turnResult => processTurnResult(turnResult));

      socket.on(GAME_OVER_EVENT, turnResult => processGameOver(turnResult));

      socket.on(CARD_INFO_EVENT, cardInfo => processCardInfo(cardInfo));

      socket.on(CARD_RSP_EVENT, cardRsp => processCardResponse(cardRsp));

      return () => {
        if (socket) {
          socket.emit(LEAVE_GAME_EVENT);
          UNSUBSCRIBE_EVENTS.forEach(event => {
            socket.removeAllListeners(event);
          });
        }
      }
    }
  }, [socket]);

  /* UI handling */
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    console.log(message, socket);
    if (message.length > 0 && socket) {
      socket.emit(CHAT_MESSAGE_EVENT, { message });
    }
    setMessage("")
  }

  const handleReturnToLobby = (event) => {
    event.preventDefault();
    updateGameId(null);
    updateOpenGame(false);
  }

  const handleTurnChoice = (event) => {
    event.preventDefault();
    setChoiceMade(true);
    if (socket) {
      const contents = { choice: event.target.value };
      socket.emit(PLAYER_TURN_EVENT, contents);
    }
  }

  const handleJudgement = (event) => {
    event.preventDefault();
    setJudgementMade(true);
    socket.emit(CARD_RSP_EVENT, { correct: event.target.value === 'true' });
  }

  const handleCardAck = (event) => {
    event.preventDefault();
    socket.emit(CARD_ACK_EVENT);
  }

  /* Game flow processing  */
  const processOpponentLeft = () => {
    setOpponentLeft(true);
  }

  const processNextTurn = turnInfo => {
    setGameState(turnInfo.gameState);
    setChoiceMade(false);
    setCard(null);
    setQuestionText(null);
    setAnswer(null);
    setCorrect(null);
    setYourTurn(turnInfo.yourTurn);
  }

  const processTurnResult = turnResult => {
    setLastTurnResult(turnResult);
  }

  const processGameOver = gameOver => {
    setGameState(gameOver.gameState);
  }

  const processCardInfo = cardInfo => {
    setQuestionId(cardInfo.questionId);

    /* Pull card information from database */
    API.getCard(cardInfo.cardId)
      .then(res => setCard(res.data))
      .catch(err => console.log(err));

    /* Need to use the setYourTurn function to get updated state of yourTurn */
    setYourTurn(yT => {
      if (yT) {
        API.getQuestion(cardInfo.questionId)
          .then(res => {
            setCorrect(null);
            setQuestionText(res.data);
            setAnswer(null);
          })
          .catch(err => console.log(err));
      } else {
        API.getQuestionComplete(cardInfo.questionId)
          .then(res => {
            setQuestionText(res.data.text);
            setAnswer(res.data.answer);
            setJudgementMade(false);
          })
          .catch(err => console.log(err));
      }
      return yT
    });
  }

  const processCardResponse = (cardRsp) => {
    setCorrect(cardRsp.correct);
    setQuestionId(id => {
      API.getQuestionComplete(id)
        .then(res => {
          setAnswer(res.data.answer);
        })
        .catch(err => console.log(err));
      return null;
    });
  }

  return (
    <div>
      <Card>
        <form>
          <label htmlFor="message">Send Message: </label>
          <Input
            type="text"
            name="message"
            value={message}
            onChange={handleMessageChange}
            autoComplete="off"
          />
          <button onClick={handleSendMessage}>Send</button>
        </form>
      </Card>
      <Card>
        <h3>Messages:</h3>
        <ul>
          {chat.map(msg => <li key={msg.id}>{msg.username}: {msg.message}</li>)}
        </ul>
      </Card>
      {
        opponentLeft
          ? (
            <>
              <h2>Your opponent has left</h2>
              <button onClick={handleReturnToLobby}>Return to Lobby</button>
            </>
          )
          : (<GameRender yourTurn={yourTurn} user={user} gameState={gameState} choiceMade={choiceMade} judgementMade={judgementMade} card={card} question={questionText} answer={answer} correct={correct}
            handleTurnChoice={handleTurnChoice} lastTurnResult={lastTurnResult} handleReturnToLobby={handleReturnToLobby} handleJudgement={handleJudgement}
            handleCardAck={handleCardAck}
          />)
      }
    </div>
  );
}

export default Game;
