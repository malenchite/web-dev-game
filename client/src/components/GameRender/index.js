import { useEffect, useState, Fragment } from 'react';

import GamePopup from "../GamePopup";
import Avatar from "../Avatar";

const GameRender = ({ currentPlayer, user, gameState, choiceMade, judgementMade, card, questionInfo, correct, handleTurnChoice, lastTurnResult, handleReturnToLobby, handleJudgement, handleCardAck }) => {
  const [yourTurn, setYourTurn] = useState(false);
  const [yourPlayerState, setYourPlayerState] = useState(null);

  useEffect(() => {
    if (gameState) {
      setYourPlayerState(gameState.playerStates.find(player => player.username === user.username));
    }
  }, [gameState]);

  useEffect(() => {
    setYourTurn(currentPlayer.current === user.username);
  }, [currentPlayer.current]);

  /* Rendering functions */
  const renderPlayerStates = () => {
    return (
      <div className="mt-3">
        {gameState.playerStates.map(state => (
          <div key={state.username} className="bg-red-linen mx-3 my-3">
            <div className="font-bold mb-1">{state.username}</div>
            <div className="mx-4 py-3 flex justify-center">
              <Avatar user={{ username: state.username, avatar: state.avatar }} size={100} className={`${state.username !== currentPlayer.current ? "border-opacity-0" : ""} border-4 border-red-eggplant border-double mr-6 rounded-full`} />
              <div className="text-left mt-1">
                Funding: {state.funding}<br />
                Front-End: {state.fep}<br />
                Back-End: {state.bep}<br />
                Bugs: {state.bugs}
              </div>
            </div>
          </div>
        ))
        }
      </div >)
  }

  const renderPointChange = (pointChange, label) => {
    let changeText = '';

    if (pointChange > 0) {
      changeText = <><span>gaining {pointChange} {label}</span><br /></>
    } else if (pointChange < 0) {
      changeText = <><span>losing {-1 * pointChange} {label}</span><br /></>
    }
    return changeText;
  }

  const renderChoiceSelection = () => {
    if (yourPlayerState && !choiceMade) {
      return (<form>
        Make your selection:<br />
        <button value='card' className=" w-16 h-24 bg-red-mauveTaupe hover:bg-red-desertSand text-white font-bold py-2 px-4 border-b-4 border-red-cottonCandy hover:border-red-blackBean rounded" onClick={handleTurnChoice}>Draw a Card</button><br />
        <button value='fund' onClick={handleTurnChoice}>Seek Funding</button><br />
        {yourPlayerState.funding > 0 && <><button value='frontend' onClick={handleTurnChoice}>Work on Front-end</button> (costs 1 funding)<br /></>}
        {yourPlayerState.funding > 0 && <><button value='backend' onClick={handleTurnChoice}>Work on Back-end</button> (costs 1 funding)<br /></>}
        {(yourPlayerState.bugs > 0 && yourPlayerState.funding > 0) && <><button value='bugfix' onClick={handleTurnChoice}>Fix Bugs</button> (costs 1 funding)<br /></>}
      </form>
      )
    }
  }

  const renderLastTurnResult = () => {
    let choiceText;
    const result = lastTurnResult.result;

    switch (lastTurnResult.choice) {
      case 'card': choiceText = 'draw a card'; break;
      case 'fund': choiceText = 'seek funding'; break;
      case 'frontend': choiceText = 'develop their front-end'; break;
      case 'backend': choiceText = 'develop their back-end'; break;
      case 'bugfix': choiceText = 'fix some bugs'; break;
      default: choiceText = 'do something unexpected';
    }

    return (
      <div>
        <span>Last turn, {lastTurnResult.username} chose to {choiceText}</span><br />
        {lastTurnResult.success !== undefined && <><span>They {lastTurnResult.success ? 'succeeded' : 'failed'}</span><br /></>}
        {(result.funding || result.fep || result.bep || result.bugs)
          ? (<>
            {renderPointChange(lastTurnResult.result.funding, 'Funding')}
            {renderPointChange(lastTurnResult.result.fep, 'Front-End')}
            {renderPointChange(lastTurnResult.result.bep, 'Back-End')}
            {renderPointChange(lastTurnResult.result.bugs, 'Bugs')}
          </>)
          : (<><span>This had no effect</span></>)
        }
      </div>
    );
  }

  const renderGameOver = () => {
    return (
      <div>
        {gameState.winner ? <>The winner is <b>{gameState.winner}!</b></> : <>It was a tie!</>}<br />
        Final scores were:<br />
        <>{gameState.playerStates.map(player => (
          <span key={player.username}>{player.username}: {player.score}<br /></span>
        ))}</>
        <button onClick={handleReturnToLobby}>Return to Lobby</button>
      </div>
    )
  }

  const renderCard = () => {
    return (
      <div className="bg-red-linen mb-5 mx-3 px-2">
        <b>{card.title}</b><br />
        <p>{card.text}</p>
      </div>
    )
  }

  const renderQuestion = () => {
    return (<>
      <h3>A <span className="font-bold">{card.category}</span> question has been posed:</h3>
      <p className="bg-red-linen px-2 mx-3">{questionInfo.text}</p>
    </>);
  }

  const renderAnswer = () => {
    return (<>
      <h3>The answer is:</h3>
      <p className="bg-red-linen mx-3 px-2 text-left">{questionInfo.answer}</p>
    </>);
  }

  const renderJudgementButtons = () => {
    return (
      <div className="mt-3 space-x-3">
        Wait for the opponent to respond in chat, then judge their answer:<br />
        <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleJudgement}>Correct</button>
        <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={false} onClick={handleJudgement}>Incorrect</button>
      </div>);
  }

  return (
    <div class="grid grid-cols-3 gap-x-4 h-full">
      {(gameState && !gameState.gameOver) &&
        (<>
          <div className="col-span-2 shadow-xl bg-red-desertSand rounded-lg relative">
            <h3>Turn {gameState.turn}</h3>
            {!yourTurn
              ? (<>
                {card
                  ? (<>
                    <h2>Your opponent has drawn a card!</h2>
                    <GamePopup>
                      <div>
                        {renderCard()}
                        <div>
                          {(card && questionInfo.text) && renderQuestion()}
                          {questionInfo.answer && renderAnswer()}
                          {(questionInfo.text && !judgementMade) && renderJudgementButtons()}
                        </div>
                      </div>
                    </GamePopup></>)
                  : <h2>Waiting on opponent</h2>
                }</>)
              : (<>
                <h2>It's your turn!</h2>
                {renderChoiceSelection()}

                {card && (
                  <GamePopup>
                    <div>
                      {card && renderCard()}
                      {(card && questionInfo && questionInfo.text) && renderQuestion()}
                      {correct !== null && <p>Your answer was judged {correct ? "correct" : "incorrect"}</p>}
                      {questionInfo && questionInfo.answer && renderAnswer()}

                      {questionInfo && questionInfo.answer && <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleCardAck}>Done</button>}
                    </div>
                  </GamePopup>
                )
                }
              </>)
            }
            {lastTurnResult && <>{renderLastTurnResult()}</>}
          </div>
          <div className="col-span-1 shadow-xl bg-red-desertSand rounded-lg">
            {renderPlayerStates()}
            <div className="mt-32">
              <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleReturnToLobby}>Quit Game</button>
            </div>
          </div>
        </>)
      }
      {(gameState && gameState.gameOver)
        && (<>
          <h3>The game has ended!</h3>
          {renderGameOver()}
        </>)}
    </div>
  )
}

export default GameRender;