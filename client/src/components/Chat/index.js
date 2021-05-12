import { useState, useEffect } from "react";
import { Input } from "../Form";

const CHAT_MESSAGE_EVENT = "chat message";

function Chat ({ socket }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (socket) {
      /* Update chat messages */
      socket.on(CHAT_MESSAGE_EVENT, msg => {
        setChat(prevChat => [...prevChat, msg]);
      });

      return () => {
        if (socket) {
          socket.removeAllListeners(CHAT_MESSAGE_EVENT);
        }
      };
    }
  }, [socket]);


  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.length > 0 && socket) {
      socket.emit(CHAT_MESSAGE_EVENT, { message });
    }
    setMessage("");
  }

  return (
    <>
      <h3 className="text-red-blackBean"><strong>Messages:</strong></h3>
      <br />
      <ul>
        {chat.map(msg => <li key={msg.id}>{msg.username}: {msg.message}</li>)}
      </ul>
      <br />
      <div className="h-75 overflow-y-scroll scrollbar-thin scrollbar-thumb-red-eggplant scrollbar-track-red-linen">
        <form className="relative">
          <label className="text-gray-700 block" htmlFor="message"> </label>
          <Input
            className="form-textarea p-2 mt-1 block w-half w-3/4 flex items-center justify-center rounded-md border border-gray-300 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5"
            placeholder="Send Message"
            type="text"
            name="message"
            value={message}
            onChange={handleMessageChange}
            autoComplete="off"
          />
          <button className="flex items-center justify-center px-4 py-3 m-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8 space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5" onClick={handleSendMessage}>Send</button>
        </form>
      </div>
    </>);
}

export default Chat;