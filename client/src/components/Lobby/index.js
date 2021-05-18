import React, { useEffect, useState } from "react";

import Chat from "../Chat";
import Challenge from "../Challenge";

const CHALLENGE_EVENT = "challenge";
const WITHDRAW_EVENT = "withdraw challenge";
const CHALLENGE_RSP_EVENT = "challenge response";
const LOBBY_INFO_EVENT = "lobby info";
const ENTER_GAME_EVENT = "enter game";

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

    /* Subscribe to server messages and unsubscribe when user leaves */
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
                setChallenger(null);
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

    /* Handles the user pressing the "Challenge" button  */
    const handleChallenge = (event) => {
        event.preventDefault();
        setChallengeRsp(null);
        setPendingChallenge(event.target.value);
        if (socket) {
            socket.emit(CHALLENGE_EVENT, { username: event.target.value });
        }
    }

    /* Handles the user pressing the "Withdraw" button */
    const handleChallengeWithdraw = (event) => {
        event.preventDefault();
        clearChallenge();
        if (socket) {
            socket.emit(WITHDRAW_EVENT);
        }
    }


    /* Handles the user pressing "Accept" or "Reject" button */
    const handleChallengeResponse = (event) => {
        event.preventDefault();
        setChallenger(null);
        if (socket) {
            socket.emit(CHALLENGE_RSP_EVENT, { accepted: event.target.value });
        }
        if (event.target.value === false) {
            clearChallenge();
        }
    }

    /* Process Enter Game event from server */
    const processEnterGame = gameInfo => {
        updateGameId(gameInfo.gameId);
    }

    /* Handle user pressing "Enter Game" button */
    const handleEnterGameButton = () => {
        updateOpenGame(true);
    }

    /* Utility function to clear all challenge and game-related data */
    const clearChallenge = () => {
        setChallenger(null);
        setPendingChallenge(null);
        setChallengeRsp(null);
        updateGameId(null);
    }

    const renderLobbyList = () => {
        return (<>
            {lobbyUsers.map(player => (
                <li key={player} className="text-left">
                    <span className="font-bold select-none">{player}</span>
                    {<button className={`${(!pendingChallenge && player !== user.username && !gameId && !challenger) ? "" : "invisible"} flex items-center justify-center p-1 py-0 ml-3 m-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 space-x-4 sm:inline-grid sm:grid-cols-1 sm:gap-5`} value={player} onClick={handleChallenge}>Challenge</button>}
                </li>
            ))}
        </>);
    }

    return (
        <section className="grid grid-cols-3 gap-x-4">
            <div title="Players in Lobby" className="shadow-xl bg-red-desertSand rounded-lg">
                <h3 className="text-red-blackBean font-bold mt-1">Players in Lobby</h3>
                <ul className="bg-red-linen mx-5 my-3 px-2 h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-red-eggplant scrollbar-track-red-linen">
                    {renderLobbyList()}
                </ul>
                <Challenge challenger={challenger} pendingChallenge={pendingChallenge} challengeRsp={challengeRsp} gameId={gameId}
                    handleChallengeResponse={handleChallengeResponse} handleChallengeWithdraw={handleChallengeWithdraw} handleEnterGameButton={handleEnterGameButton} handleClose={clearChallenge} />
            </div>
            <div className="col-span-2 col-start-2 row-start-1 row-end-3 shadow-xl bg-red-desertSand rounded-lg">
                <Chat socket={socket} title="Lobby" />
            </div>
        </section>
    )
}
export default Lobby