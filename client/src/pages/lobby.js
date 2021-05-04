import React, { useEffect, useState } from 'react';
// import { Redirect, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Form';

const CHALLENGE_EVENT = 'challenge';
const CHALLENGE_RSP_EVENT = 'challenge response';
const CHAT_MESSAGE_EVENT = 'chat message';
const LOBBY_INFO_EVENT = 'lobby info';

function Lobby({ socket, user }) {
    const [lobbyUsers, setLobbyUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [challenger, setChallenger] = useState(null);
    const [challengeRsp, setChallengeRsp] = useState(null);
    const [chat, setChat] = useState([]);


    useEffect(() => {
        if (socket) {
            socket.on(LOBBY_INFO_EVENT, lobbyInfo => {
                console.log("Updating lobby info");
                setLobbyUsers(lobbyInfo.users);
            });

            /* Update chat messages */
            socket.on(CHAT_MESSAGE_EVENT, msg => {
                setChat(prevChat => [...prevChat, msg]);
            });


            /* Receive challenge message */
            socket.on(CHALLENGE_EVENT, msg => {
                console.log("Challenge received", msg);
                setChallenger(msg.username);
            });

            /* Receive challenge response */
            socket.on(CHALLENGE_RSP_EVENT, rsp => {
                console.log("Challenge response received", rsp);
                setChallengeRsp(rsp);
            });
            return () => socket.off(CHAT_MESSAGE_EVENT);

        }
    }, [socket])

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (message.length > 0 && socket) {
            console.log(`Sending message: ${message}`);
            socket.emit(CHAT_MESSAGE_EVENT, { message });
        }
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

    return (
        <div>
            {socket && socket.connected ? <h1>Socket opened as {socket.id}</h1> : <h1>Socket not connected</h1>}
            {user ? <h2>User logged in as {user.username} ({user._id})</h2> : <h2>No user logged in</h2>}
            <Card title="User List">
                <h3>Users in current lobby:</h3>
                <ul>
                    {lobbyUsers.map(user => <li key={user}>{user} <button value={user} onClick={handleChallenge}>Challenge</button></li>)}
                </ul>
            </Card>
            <Card>
                <form>
                    <label htmlFor="message">Send Message: </label>
                    <Input
                        type="text"
                        name="message"
                        value={message}
                        onChange={handleMessageChange}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </form>
            </Card>
            <Card>
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
                            <span>Your recent challenge has been {challengeRsp.accepted === "true" ? "accepted" : "rejected"}.</span>
                            <br />
                            {challengeRsp.message && <span>The rejection message said: "{challengeRsp.message}"</span>}
                        </div>
                    )
                }
            </Card>
            <h3>Messages:</h3>
            <ul>
                {chat.map(msg => <li key={msg.id}>{msg.username}: {msg.message}</li>)}
            </ul>
        </div>
    )


}

export default Lobby
