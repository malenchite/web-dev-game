import { useEffect, useState, Fragment } from 'react';

import GamePopup from "../GamePopup";
import Avatar from "../Avatar";
import e from 'cors';

const GameRender = ({ currentPlayer, user, gameState, choiceMade, judgementMade, card, questionInfo, correct, opponentLeft, handleTurnChoice, lastTurnResult, handleReturnToLobby, handleJudgement, handleCardAck }) => {
  const [yourTurn, setYourTurn] = useState(false);
  const [yourPlayerState, setYourPlayerState] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    if (gameState) {
      setYourPlayerState(gameState.playerStates.find(player => player.username === user.username));
    }
  }, [gameState]);

  useEffect(() => {
    if (card) {
      setOpenPopup(true);
    } else {
      setOpenPopup(false);
    }
  }, [card]);

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
              <Avatar user={{ username: state.username, avatar: state.avatar }} size={100} className={`${state.username !== currentPlayer.current ? "border-opacity-0" : ""} border-4 border-red-eggplant border-double mr-6 rounded-full h-1/2`} />
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
      changeText = <><span>They gained {pointChange} {label}</span>.<br /></>
    } else if (pointChange < 0) {
      changeText = <><span>They lost {-1 * pointChange} {label}</span>.<br /></>
    }
    return changeText;
  }

  const renderChoiceSelection = () => {
    if (yourPlayerState && !choiceMade) {
      return (
        <form className="bg-red-linen mt-2 mx-3 h-60">
          <div className="grid grid-col-2 justify-evenly gap-0" style={{ gridTemplateColumns: "12rem auto" }}>
            <div className="col-span-1 flex justify-center items-center h-60">
              <button value="card" className="w-28 h-40 bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-80 font-bold py-2 px-4 border border-b-4 hover:border-red-cottonCandy border-red-blackBean rounded" onClick={handleTurnChoice}>Draw Card</button><br />
            </div>
            <div className="col-span-1 p-3 h-60">
              <button className="flex items-center justify-center px-1 py-1 m-1 border hover:border-red-cottonCandy border-red-blackBean text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-80 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 w-44" value="fund" onClick={handleTurnChoice}>Seek Funding</button><br />
              {yourPlayerState.funding > 0 && (
                <>
                  <button className="flex items-center justify-center px-1 py-1 m-1 border hover:border-red-cottonCandy border-red-blackBean text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-80 sm:px-2 space-y-2 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-0 w-44" value="frontend" onClick={handleTurnChoice}>Work on Front End<span className="text-xs pointer-events-none">(costs 1 funding)</span></button> <br />
                </>)}
              {yourPlayerState.funding > 0 && (
                <>
                  <button className="flex items-center justify-center px-1 py-1 m-1 border hover:border-red-cottonCandy border-red-blackBean text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-80 sm:px-2 space-y-2 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-0 w-44" value="backend" onClick={handleTurnChoice}>Work on Back End<span className="text-xs pointer-events-none">(costs 1 funding)</span></button> <br />
                </>)}
              {(yourPlayerState.bugs > 0 && yourPlayerState.funding > 0) && (
                <>
                  <button className="flex items-center justify-center px-1 py-1 m-1 border hover:border-red-cottonCandy border-red-blackBean text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-80 sm:px-2 space-y-2 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-0 w-44" value="bugfix" onClick={handleTurnChoice}>Fix Bugs<span className="text-xs pointer-events-none">(costs 1 funding)</span></button> <br />
                </>)}
            </div>
          </div>
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
      <div className="h-40 bg-red-linen mx-3 mb-3 p-1">
        <span>Last turn, <span className="font-bold">{lastTurnResult.username}</span> chose to {choiceText}.</span><br />
        {lastTurnResult.success !== undefined && <><span>They {lastTurnResult.success ? 'succeeded at' : 'failed'} the challenge.</span><br /></>}
        {(result.funding || result.fep || result.bep || result.bugs)
          ? (<>
            {renderPointChange(lastTurnResult.result.funding, 'Funding')}
            {renderPointChange(lastTurnResult.result.fep, 'Front-End')}
            {renderPointChange(lastTurnResult.result.bep, 'Back-End')}
            {renderPointChange(lastTurnResult.result.bugs, 'Bugs')}
          </>)
          : (<><span>This had no effect.</span></>)
        }
      </div>
    );
  }

  const renderGameOver = () => {
    return (
      <>
        <h3 className="text-red-blackBean mt-1 mb-3 font-bold">The game has ended.</h3>
        <div className="bg-red-linen p-1 mx-3">
          <div className="mb-2 text-xl">{gameState.winner ? <>The winner is <span className="font-bold">{gameState.winner}</span>!</> : <>It was a tie!</>}</div>
          <>{gameState.playerStates.map(player => (
            <span key={player.username}><span className="font-bold">{player.username}:</span> {player.score}<br /></span>
          ))}</>
          <button className="flex items-center justify-center px-4 py-3 m-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={false} onClick={handleReturnToLobby}>Return to Lobby</button>
        </div>
      </>
    )
  }

  const renderCard = () => {
    if (!card) {
      return null;
    }

    return (
      <div className="bg-red-linen mb-3 mx-3 px-2">
        <span className="font-bold">{card.title}</span>
        <p className="mt-1 leading-snug">{card.text}</p>
      </div>
    )
  }

  const renderQuestion = () => {
    if (!card) {
      return null;
    }
    return (<div className="mb-2">
      <span className="text-sm">A <span className="font-bold">{card.category === "frontend" ? "front-end" : "back-end"}</span> question has been posed:</span>
      <p className="bg-red-desertSand bg-opacity-70 px-2 mx-3 leading-snug">{questionInfo.text}</p>
    </div>);
  }

  const renderAnswer = () => {
    return (<div>
      <span className="text-sm">The answer is:</span>
      <p className="bg-red-desertSand bg-opacity-70  mx-3 px-2 leading-snug">{questionInfo.answer}</p>
    </div>);
  }

  const renderJudgementButtons = () => {
    return (
      <div className="mt-3 space-x-3 text-sm">
        Wait for the opponent to respond in chat, then judge their answer:<br />
        <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={true} onClick={handleJudgement}>Correct</button>
        <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={false} onClick={handleJudgement}>Incorrect</button>
      </div>);
  }

  return (
    <div className="grid grid-cols-3 gap-x-4 h-full">
      {
        (<>
          <div className="col-span-2 shadow-xl bg-red-desertSand rounded-lg relative">
            <GamePopup show={openPopup} >
              {yourTurn
                ? (
                  <div>
                    {renderCard()}
                    {(questionInfo && questionInfo.text) && renderQuestion()}
                    {(card && correct === null) && <span className="text-sm">Enter your response into the game chat.</span>}
                    {correct !== null && <p>Your answer was judged <span className="font-bold">{correct ? "correct" : "incorrect"}</span>.</p>}
                    {(questionInfo && questionInfo.answer) && (<>
                      {renderAnswer()}
                      <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleCardAck}>Done</button>
                    </>)}
                  </div>)
                : <div>
                  {renderCard()}
                  <div>
                    {(card && questionInfo.text) && renderQuestion()}
                    {questionInfo.answer && renderAnswer()}
                    {(questionInfo.text && !judgementMade) && renderJudgementButtons()}
                  </div>
                </div>}
            </GamePopup>
            <div className="grid grid-rows-6 h-full">
              <div className="row-span-4">
                {!gameState && (
                  <>
                    {opponentLeft
                      ? (
                        <>
                          <h3 className="text-red-blackBean mt-1 mb-3 font-bold">Your opponent has left.</h3>
                          <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleReturnToLobby}>Return to Lobby</button>
                        </>
                      )
                      : <h3 className="text-red-blackBean mt-1 mb-3 font-bold">Waiting for players to join...</h3>
                    }
                  </>)
                }
                {(gameState && gameState.gameOver) && renderGameOver()}
                {(gameState && !gameState.gameOver) && (
                  <>
                    <h3 className="text-red-blackBean mt-1 mb-3 font-bold">Turn {gameState.turn}</h3>
                    {!yourTurn
                      ? (<>
                        {card
                          ? <h4>Your opponent has drawn a card.</h4>
                          : <h4>Waiting on opponent...</h4>
                        }</>)
                      : (<>
                        <h4>It's your turn!</h4>
                        {renderChoiceSelection()}
                      </>)}
                  </>)
                }
              </div>
              <div className="w-full items-center row-span-2 mt-5">
                {lastTurnResult && renderLastTurnResult()}
              </div>
            </div>
          </div>
          <div className="col-span-1 shadow-xl bg-red-desertSand rounded-lg relative">
            {gameState && renderPlayerStates()}
            <div className="absolute bottom-4 w-full">
              <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleReturnToLobby}>Quit Game</button>
            </div>
          </div>
        </>)
      }

    </div >
  )
}

export default GameRender;