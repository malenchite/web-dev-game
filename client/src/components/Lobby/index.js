import React, { useEffect, useState } from 'react';
import { Card } from '../Card';
import { Input } from '../Form';
const CHALLENGE_EVENT = 'challenge';
const CHALLENGE_RSP_EVENT = 'challenge response';
const CHAT_MESSAGE_EVENT = 'chat message';
const LOBBY_INFO_EVENT = 'lobby info';
const ENTER_GAME_EVENT = 'enter game';
/* Events to unsubscribe from when leaving */
const UNSUBSCRIBE_EVENTS = [
    CHALLENGE_EVENT,
    CHALLENGE_RSP_EVENT,
    CHAT_MESSAGE_EVENT,
    LOBBY_INFO_EVENT,
    ENTER_GAME_EVENT
];
function Lobby({ socket, user, gameId, updateGameId, updateOpenGame }) {
    const [lobbyUsers, setLobbyUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [challenger, setChallenger] = useState(null);
    const [challengeRsp, setChallengeRsp] = useState(null);
    const [chat, setChat] = useState([]);
    useEffect(() => {
        if (socket) {
            socket.on(LOBBY_INFO_EVENT, lobbyInfo => {
                setLobbyUsers(lobbyInfo.users);
            });
            /* Update chat messages */
            socket.on(CHAT_MESSAGE_EVENT, msg => {
                setChat(prevChat => [...prevChat, msg]);
            });
            /* Receive challenge message */
            socket.on(CHALLENGE_EVENT, msg => {
                setChallenger(msg.username);
            });
            /* Receive challenge response */
            socket.on(CHALLENGE_RSP_EVENT, rsp => {
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
    }, [socket])
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };
    const handleSendMessage = (event) => {
        event.preventDefault();
        if (message.length > 0 && socket) {
            socket.emit(CHAT_MESSAGE_EVENT, { message });
        }
        setMessage("")
    }
    const handleChallenge = (event) => {
        event.preventDefault();
        setChallengeRsp(null);
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
                <li key={player}>
                    {player}
                    {(player !== user.username && !gameId && !challenger) && <button className="ml-3" value={player} onClick={handleChallenge}>Challenge</button>}
                </li>
            ))}
        </>);
    }
    return (
        <div className="grid grid-cols-3 gap-4">
            <div title="User List" className="shadow-xl bg-white rounded-lg h-18">
                <h3>Users in current lobby:</h3>
                <ul>
                    {renderLobbyList()}
                </ul>
            </div>
            <div className=" col-span-2 col-start-2 row-start-1 row-end-3 shadow-xl bg-white rounded-lg h-18">
                <h3>Messages:</h3>
                <br></br>
                <ul>
                    {chat.map(msg => <li key={msg.id}>{msg.username}: {msg.message}</li>)}
                </ul>
                <br></br>
                <div>
                    <form className="relative">
                        <label className=" text-gray-700 block" htmlFor="message"> </label>
                        <Input
                            className="form-textarea mt-1 block w-half w-3/4 flex items-center justify-center rounded-md border border-gray-300" placeholder="Enter some long form content."
                            placeholder="Send Message"
                            type="text"
                            name="message"
                            value={message}
                            onChange={handleMessageChange}
                        />
                        <button className="right- h-16 w-16 px-4 bg-yellow-400  text-gray-800 font-bold p-4 uppercase border-yellow-500 border-t border-b border-r border-l" onClick={handleSendMessage}>Send</button>
                    </form>
                </div>


            </div>


            <div>
                {
                    challenger && (
                        <form>
                            <label htmlFor="challenge">You have been challenged by {challenger} </label>
                            <br />
                            <button value={true} onClick={handleChallengeResponse}>Accept</button>
                            <br />
                            <button value={false} onClick={handleChallengeResponse}>Reject</button>
                        </form>
                    )
                }
                {
                    challengeRsp && (
                        <div>
                            <span>Your recent challenge has been {challengeRsp.accepted ? "accepted" : "rejected"}.</span>
                            <br />
                            {challengeRsp.message && <span>The rejection message said: "{challengeRsp.message}"</span>}
                        </div>
                    )
                }
            </div>

            {
                gameId && (
                    <Card>
                        <span>Your game is ready to enter!</span>
                        <br />
                        <button onClick={handleEnterGameButton}>Enter Game</button>
                    </Card>
                )
            }
        </div>
    )
}
export default Lobby