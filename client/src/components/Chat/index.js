import { useState, useEffect, useRef } from "react";
import { Input } from "../Form";

const CHAT_MESSAGE_EVENT = "chat message";

function Chat ({ socket, title }) {
  const chatEndRef = useRef(null);

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

  /* Make chat scroll to bottom on new messages */
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  /* Keeps message state up to date with user input */
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  /* Handle user clicking "Send Message" button by sending message to server */
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.length > 0 && socket) {
      socket.emit(CHAT_MESSAGE_EVENT, { message });
    }
    setMessage("");
  }

  /* Scrolls chat to bottom */
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <h3 className="text-red-blackBean mt-1 mb-3 font-bold">{title}</h3>
      <ul className="px-2 py-1 mx-5 h-96 bg-red-linen overflow-y-scroll scrollbar-thin scrollbar-thumb-red-eggplant scrollbar-track-red-linen">
        {chat.map(msg => <li key={msg.id} className="text-left"><span className="font-bold">{msg.username}:</span> {msg.message}</li>)}
        <div ref={chatEndRef} />
      </ul>
      <br />
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
    </>);
}

export default Chat;