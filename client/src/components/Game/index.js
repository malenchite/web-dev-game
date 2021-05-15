import { useEffect, useState, useRef } from 'react';
import Chat from "../Chat";
import GameRender from '../GameRender';
import API from '../../utils/API';

/* Events emitted from server */
const GAME_OVER_EVENT = 'game over';
const OPPONENT_LEFT_EVENT = 'opponent left';
const NEXT_TURN_EVENT = 'next turn';
const CARD_INFO_EVENT = 'card info';
const TURN_RESULT_EVENT = 'turn result';

/* Events sent by players (also possibly relayed by server) */
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
  CARD_RSP_EVENT
];

function Game ({ socket, user, updateGameId, updateOpenGame }) {
  const category = useRef(null);
  const currentPlayer = useRef(null);
  const stats = useRef({
    frontEndCorrect: 0,
    backEndCorrect: 0,
    frontEndTotal: 0,
    backEndTotal: 0
  });

  const [gameState, setGameState] = useState(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [lastTurnResult, setLastTurnResult] = useState(null);
  const [card, setCard] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [choiceMade, setChoiceMade] = useState(false);
  const [judgementMade, setJudgementMade] = useState(false);

  const [questionInfo, setQuestionInfo] = useState({
    text: null,
    answer: null,
    id: null
  });

  /* Subscribe to server events and unsubscribe when user leaves */
  useEffect(() => {
    if (socket) {
      socket.emit(PLAYER_JOINED_EVENT);

      socket.on(OPPONENT_LEFT_EVENT, processOpponentLeft);

      socket.on(NEXT_TURN_EVENT, gameState => processNextTurn(gameState));

      socket.on(TURN_RESULT_EVENT, turnResult => processTurnResult(turnResult));

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

  /* Update gameover listener if user changes (required as user does not exist on initial load) */
  useEffect(() => {
    if (socket && user) {
      socket.removeAllListeners(GAME_OVER_EVENT);
      socket.on(GAME_OVER_EVENT, gameOver => processGameOver(gameOver));
    }
  }, [socket, user]);

  /* UI handling */

  /* Handles user clicking "Quit Game" or "Return to Lobby" button */
  const handleReturnToLobby = (event) => {
    event.preventDefault();
    updateGameId(null);
    updateOpenGame(false);
  }

  /* Handles user clicking one of the turn option buttons */
  const handleTurnChoice = (event) => {
    event.preventDefault();
    setChoiceMade(true);
    if (socket) {
      const contents = { choice: event.target.value };
      socket.emit(PLAYER_TURN_EVENT, contents);
    }
  }

  /* Handles user clicking "Correct" or "Incorrect" buttons */
  const handleJudgement = (event) => {
    event.preventDefault();
    setJudgementMade(true);
    socket.emit(CARD_RSP_EVENT, { correct: event.target.value === 'true' });
  }

  /* Handles user clicking the "Done" button after reading the correct answer */
  const handleCardAck = (event) => {
    event.preventDefault();
    socket.emit(CARD_ACK_EVENT);
  }

  /* Game flow processing  */

  /* Process the Opponent Left event from the server */
  const processOpponentLeft = () => {
    setOpponentLeft(true);
    setGameState(null);
  }

  /* Processes the Next Turn event with updated game state from the server */
  const processNextTurn = turnInfo => {
    currentPlayer.current = turnInfo.currentPlayer;
    setGameState(turnInfo.gameState);
    setChoiceMade(false);
    setCard(null);
    setQuestionInfo(info => { return { ...info, text: null, answer: null } });
    setCorrect(null);
  }

  /* Processes the Turn Result event with prior turn's effects */
  const processTurnResult = turnResult => {
    setLastTurnResult(turnResult);
  }

  /* Processes the Game Over event by displaying result and saving game data */
  const processGameOver = gameOver => {
    const gameData = {
      result: "loss",
      frontEndCorrect: stats.current.frontEndCorrect,
      frontEndTotal: stats.current.frontEndTotal,
      backEndCorrect: stats.current.backEndCorrect,
      backEndTotal: stats.current.backEndTotal,
      timestamp: new Date()
    };

    setGameState(gameOver.gameState);

    if (!gameOver.gameState.winner) {
      gameData.result = "tie";
    } else if (gameOver.gameState.winner === user.username) {
      gameData.result = "win";
    }

    API.saveGameData(user._id, gameData)
      .catch(err => console.log("Error saving game results"));
  }

  /* Processes the Card Info event by retrieving required data from the card and question APIs */
  const processCardInfo = cardInfo => {
    /* Pull card information from database */
    API.getCard(cardInfo.cardId)
      .then(res => {
        category.current = res.data.category;
        setCard(res.data);

        /* If your turn, update stats and retrieve question. Otherwise, just retrieve question & answer */
        if (currentPlayer.current === user.username) {
          switch (category.current) {
            case "frontend":
              stats.current.frontEndTotal++;
              break;
            case "backend":
              stats.current.backEndTotal++;
              break;
            default: console.log("Unknown card category");
          }

          API.getQuestion(cardInfo.questionId)
            .then(res => {
              setCorrect(null);
              setQuestionInfo(info => { return { ...info, id: cardInfo.questionId, text: res.data, answer: null } });
            })
            .catch(err => console.log("Error retrieving question information"));
        } else {
          API.getQuestionComplete(cardInfo.questionId)
            .then(res => {
              setQuestionInfo(info => { return { ...info, id: cardInfo.questionId, text: res.data.text, answer: res.data.answer } });
              setJudgementMade(false);
            })
            .catch(err => console.log("Error retrieving question information"));
        }
      })
      .catch(err => console.log("Error retrieving card information"));
  }

  /* Process the correct/incorrect judgment response */
  const processCardResponse = (cardRsp) => {
    setCorrect(cardRsp.correct);
    if (cardRsp.correct) {
      switch (category.current) {
        case "frontend":
          stats.current.frontEndCorrect++;
          break;
        case "backend":
          stats.current.backEndCorrect++;
          break;
        default: console.log("Unknown card category");
      }
    }

    setQuestionInfo(oldInfo => {
      API.getQuestionComplete(oldInfo.id)
        .then(res => {
          setQuestionInfo(info => {
            return { ...info, answer: res.data.answer };
          });
        })
        .catch(err => console.log("Error retrieving question information"));
      return oldInfo;
    });
  };

  return (
    <section className="grid grid-cols-3 gap-4">
      <div className="col-span-1 shadow-xl bg-red-desertSand rounded-lg pb-4">
        <Chat socket={socket} title="Game Chat" />
      </div>
      <div className="col-span-2">
        <GameRender currentPlayer={currentPlayer} user={user} gameState={gameState} choiceMade={choiceMade} judgementMade={judgementMade} card={card} questionInfo={questionInfo} correct={correct} opponentLeft={opponentLeft}
          handleTurnChoice={handleTurnChoice} lastTurnResult={lastTurnResult} handleReturnToLobby={handleReturnToLobby} handleJudgement={handleJudgement}
          handleCardAck={handleCardAck}
        />
      </div>
    </section>
  );
}

export default Game;
