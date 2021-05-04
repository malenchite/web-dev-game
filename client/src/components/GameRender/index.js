const GameRender = ({ yourTurn, gameState, updateGame }) => {
  return (
    <div>
      {console.log(gameState)}
      <>
        {yourTurn ? <h2>It's your turn</h2> : <h2>Waiting on opponent</h2>}
        {gameState && (
          <div>
            Players:
            {gameState.playerStates.map(state => (
              <div key={state.username} style={{ backgroundColor: "tan", marginBottom: 10 }}>
                <b>{state.username}</b><br />
                    Funding: {state.funding}<br />
                    Front-End: {state.fep}<br />
                    Back-End: {state.bep}<br />
                    Bugs: {state.bugs}
              </div>
            ))}
          </div>
        )}
      </>

    </div>
  )
}

export default GameRender;