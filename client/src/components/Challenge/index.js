function Challenge ({ challenger, pendingChallenge, challengeRsp, gameId, handleChallengeResponse, handleChallengeWithdraw, handleEnterGameButton, handleClose }) {

  const open = challenger || pendingChallenge || challengeRsp || gameId;
  return (
    <div className={`${open ? "" : "invisible"} mx-5 my-3`}>
      <div
        className="bg-red-linen rounded-lg px-3 py-3 h-32 flex justify-center items-center"
      >
        {
          challenger && (
            <form>
              <label className="text-red-blackBean" htmlFor="challenge">You have been challenged by <span className="font-bold">{challenger}</span>.</label>
              <br />
              <div className="space-x-3">
                <button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={true} onClick={handleChallengeResponse}>Accept</button>
                <button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={false} onClick={handleChallengeResponse}>Reject</button>
              </div>
            </form>
          )
        }
        {
          pendingChallenge && (
            <div>
              <span className="text-red-blackBean">You have challenged <span className="font-bold">{pendingChallenge}</span>.</span>
              <br />
              <button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleChallengeWithdraw}>Withdraw</button>
            </div>
          )
        }
        <div>
          {
            challengeRsp && (
              <>
                {!challengeRsp.message && <span className="text-red-blackBean">Your challenge has been {challengeRsp.accepted ? "accepted" : "rejected"}.</span>}
                {challengeRsp.message && <span className="text-red-blackBean">{challengeRsp.message}</span>}
                {!challengeRsp.accepted && <><br /><button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleClose}>Close</button></>}
              </>
            )
          }
          {
            (gameId && !(challengeRsp && challengeRsp.message)) && (
              <>
                {challengeRsp && challengeRsp.accepted && <br />}
                <span className="text-red-blackBean">Your game is ready to enter!</span>
                <br />
                <button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleEnterGameButton}>Enter Game</button>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Challenge;