import React, { useState } from 'react';
// import { Redirect, Link } from 'react-router-dom';
import io from "socket.io-client";
import AUTH from "../utils/AUTH";
import { Card } from '../components/Card';
import { Input } from '../components/Form';

function Lobby() {
    const [socket, setSocket] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [reason, setReason] = useState(undefined);
    const [lobbyUsers, setLobbyUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [challenger, setChallenger] = useState(null);
    const [challengeRsp, setChallengeRsp] = useState(null);
    const [chat, setChat] = useState([]);

    // return (
    //     <div>
    //         {socket && socket.connected ? <h1>Socket opened as {socket.id}</h1> : <h1>Socket not connected</h1>}
    //         {userInfo ? <h2>User logged in as {userInfo.username} ({userInfo._id})</h2> : <h2>No user logged in</h2>}
    //         {reason ? <h2>Last disconnect due to {reason}</h2> : ""}
    //         <Card title="User List">
    //             <h3>Users in current lobby:</h3>
    //             <ul>
    //                 {lobbyUsers.map(user => <li key={user}>{user} <button value={user} onClick={handleChallenge}>Challenge</button></li>)}
    //             </ul>
    //         </Card>
    //         <Card>
    //             <form>
    //                 <label htmlFor="message">Send Message: </label>
    //                 <Input
    //                     type="text"
    //                     name="message"
    //                     value={message}
    //                     onChange={handleMessageChange}
    //                 />
    //                 <button onClick={handleSendMessage}>Send</button>
    //             </form>
    //         </Card>
    //         <Card>
    //             {
    //                 challenger && (
    //                     <form>
    //                         <label htmlFor="challenge">You have been challenged by {challenger} </label>
    //                         <br />
    //                         <button value={true} onClick={handleChallengeResponse}>Accept</button>
    //                         <br />
    //                         <button value={false} onClick={handleChallengeResponse}>Reject</button>
    //                     </form>
    //                 )
    //             }
    //             {
    //                 challengeRsp && (
    //                     <div>
    //                         <span>Your recent challenge has been {challengeRsp.accepted === "true" ? "accepted" : "rejected"}.</span>
    //                         <br />
    //                         {challengeRsp.message && <span>The rejection message said: "{challengeRsp.message}"</span>}
    //                     </div>
    //                 )
    //             }
    //         </Card>
    //         <h3>Messages:</h3>
    //         <ul>
    //             {chat.map(msg => <li key={msg.id}>{msg.username}: {msg.message}</li>)}
    //         </ul>
    //     </div>
    // )


}

export default Lobby
