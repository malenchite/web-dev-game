import React, { useEffect, useState } from 'react';

import Chat from "../Chat";

const CHALLENGE_EVENT = 'challenge';
const CHALLENGE_RSP_EVENT = 'challenge response';
const LOBBY_INFO_EVENT = 'lobby info';
const ENTER_GAME_EVENT = 'enter game';

/* Events to unsubscribe from when leaving */
const UNSUBSCRIBE_EVENTS = [
    CHALLENGE_EVENT,
    CHALLENGE_RSP_EVENT,
    LOBBY_INFO_EVENT,
    ENTER_GAME_EVENT
];

function Lobby ({ socket, user, gameId, updateGameId, updateOpenGame }) {
    const [lobbyUsers, setLobbyUsers] = useState([]);

    const [pendingChallenge, setPendingChallenge] = useState(null);
    const [challenger, setChallenger] = useState(null);
    const [challengeRsp, setChallengeRsp] = useState(null);

    useEffect(() => {
        if (socket) {
            socket.on(LOBBY_INFO_EVENT, lobbyInfo => {
                setLobbyUsers(lobbyInfo.users);
            });

            /* Receive challenge message */
            socket.on(CHALLENGE_EVENT, msg => {
                setChallengeRsp(null);
                setChallenger(msg.username);
            });

            /* Receive challenge response */
            socket.on(CHALLENGE_RSP_EVENT, rsp => {
                setPendingChallenge(null);
                setChallengeRsp(rsp);
            });

            /* Receive enter game */
            socket.on(ENTER_GAME_EVENT, gameInfo => {
                processEnterGame(gameInfo);
            });

            return () => {
                if (socket) {
                    UNSUBSCRIBE_EVENTS.forEach(event => {
                        socket.removeAllListeners(event);
                    });
                }
            }
        }
    }, [socket]);

    const handleChallenge = (event) => {
        event.preventDefault();
        setChallengeRsp(null);
        setPendingChallenge(event.target.value);
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

    const processEnterGame = gameInfo => {
        updateGameId(gameInfo.gameId);
    }

    const handleEnterGameButton = () => {
        updateOpenGame(true);
    }

    const renderLobbyList = () => {
        return (<>
            {lobbyUsers.map(player => (
                <strong><li key={player}>
                    {player}
                    {(!pendingChallenge && player !== user.username && !gameId && !challenger) && <button className="flex items-center justify-center p-2 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 space-x-4 sm:inline-grid sm:grid-cols-1 sm:gap-5" value={player} onClick={handleChallenge}>Challenge</button>}
                </li></strong>
            ))}
        </>);
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            <div title="User List" className="shadow-xl bg-red-desertSand rounded-lg h-18">
                <h3 className="text-red-blackBean"><strong>Users in Lobby:</strong></h3>
                <ul>
                    {renderLobbyList()}
                </ul>
            </div>
            <div className="col-span-2 col-start-2 row-start-1 row-end-3 shadow-xl bg-red-desertSand rounded-lg h-18">
                <Chat socket={socket} />
            </div>

            <div className="shadow-xl bg-red-desertSand rounded-lg h-18" >
                {
                    challenger && (
                        <form>
                            <label className="text-red-blackBean" htmlFor="challenge"><strong> You have been challenged by {challenger} </strong> </label>
                            <br />
                            <button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={true} onClick={handleChallengeResponse}>Accept</button>
                            <br />
                            <button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" value={false} onClick={handleChallengeResponse}>Reject</button>
                        </form>
                    )
                }
                {
                    pendingChallenge && (
                        <div>
                            <span className="text-red-blackBean">You have challenged <strong>{pendingChallenge}</strong>. Awaiting response...</span>
                        </div>
                    )
                }
                {
                    challengeRsp && (
                        <div>
                            <span className="text-red-blackBean">Your challenge has been {challengeRsp.accepted ? "accepted" : "rejected"}.</span>
                            <br />
                            {challengeRsp.message && <span className=" text-red-blackBean">{challengeRsp.message}</span>}
                        </div>
                    )
                }
                {
                    gameId && (
                        <div>
                            <span>Your game is ready to enter!</span>
                            <br />
                            <button className="flex items-center justify-center px-4 py-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleEnterGameButton}>Enter Game</button>
                        </div>
                    )
                }
            </div>

        </div>
    )
}
export default Lobby