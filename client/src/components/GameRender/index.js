import { useEffect, useState } from 'react';
import { Card } from '../Card';

const GameRender = ({ yourTurn, user, gameState, choiceMade, judgementMade, card, questionInfo, correct, handleTurnChoice, lastTurnResult, handleReturnToLobby, handleJudgement, handleCardAck }) => {

  const [yourPlayerState, setYourPlayerState] = useState(null);

  useEffect(() => {
    if (gameState) {
      setYourPlayerState(gameState.playerStates.find(player => player.username === user.username));
    }
  }, [gameState])

  /* Rendering functions */
  const renderPlayerStates = () => {
    return (
      <Card>
        Players:
        {gameState.playerStates.map(state => (
          <div key={state.username} style={{ backgroundColor: 'tan', marginBottom: 10 }}>
            <b>{state.username}</b><br />
            Funding: {state.funding}<br />
            Front-End: {state.fep}<br />
            Back-End: {state.bep}<br />
            Bugs: {state.bugs}
          </div>
        ))}
      </Card>)
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
      <Card>
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
      </Card>
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
    return (<Card>
      The card reads: <br />
      <b>{card.title}</b><br />
      <p>{card.text}</p>
    </Card>
    )
  }

  const renderQuestion = () => {
    return (<>
      <h3>A {card.category} question has been posed:</h3>
      <p>{questionInfo.text}</p>
    </>);
  }

  const renderAnswer = () => {
    return (<>
      <h3>The answer is:</h3>
      <p style={{ backgroundColor: "lightgray" }}>{questionInfo.answer}</p>
    </>);
  }

  const renderJudgementButtons = () => {
    return (<>
      Wait for the opponent to respond in chat, then judge their answer:<br />
      <button className="mr-5" value={true} onClick={handleJudgement}>Correct</button>
      <button value={false} onClick={handleJudgement}>Incorrect</button>
    </>);
  }

  return (
    <Card>
      {(gameState && !gameState.gameOver) &&
        (<>
          <h3>It's now turn {gameState.turn}</h3>
          {!yourTurn.current
            ? (<>
              {card
                ? (<>
                  <h2>Your opponent has drawn a card!</h2>
                  {renderCard()}
                  <Card>
                    {(card && questionInfo.text) && renderQuestion()}
                    {questionInfo.answer && renderAnswer()}
                    {(questionInfo.text && !judgementMade) && renderJudgementButtons()}
                  </Card>
                </>)
                : <h2>Waiting on opponent</h2>
              }</>)
            : (<>
              <h2>It's your turn!</h2>
              {renderChoiceSelection()}
              {card && renderCard()}
              <Card>
                {(card && questionInfo && questionInfo.text) && renderQuestion()}
                {correct !== null && <p>Your answer was judged {correct ? "correct" : "incorrect"}</p>}
                {questionInfo && questionInfo.answer && renderAnswer()}
                {questionInfo && questionInfo.answer && <button onClick={handleCardAck}>Done Reading</button>}
              </Card>
            </>)
          }
          {lastTurnResult && <>{renderLastTurnResult()}</>}
          {renderPlayerStates()}
          <button onClick={handleReturnToLobby}>Quit Game</button>
        </>)}
      {(gameState && gameState.gameOver) && (<>
        <h3>The game has ended!</h3>
        {renderGameOver(Card)}
      </>)}
    </Card>
  )
}

export default GameRender;