import { useState, useEffect } from "react";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3001";
const USER_INFO_EVENT = "user info";

function SocketTest () {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState("");
  const [reason, setReason] = useState(undefined);

  const updateUser = e => {
    setUser(e.target.value);
  }

  const connectUser = e => {
    e.preventDefault();

    if (user.length === 0) {
      return;
    }

    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(ENDPOINT);

    newSocket.on('connect', () => {
      newSocket.emit(USER_INFO_EVENT, {
        userId: user
      });

      console.log(`Connecting on socket ${newSocket.id}`);

      /* Store socket in state */
      setSocket(newSocket);

      newSocket.on('disconnect', reason => {
        setReason(reason);
        if (reason === 'io server disconnect') {
          setSocket(null);
        }
      });
    });
  }

  const disconnectUser = e => {
    e.preventDefault();

    if (socket) {
      console.log(`Disconnecting socket ${socket.id}`);
      socket.disconnect();
      setSocket(null);
    }
  }

  useEffect(() => {
    /* Return socket cleanup function */
    return () => {
      if (socket && socket.connected) {
        console.log(`Cleaning up socket ${socket.id}`);
        socket.disconnect();
      }
    }
  }, [socket]);

  return (
    <div>
      {socket && socket.connected ? <h1>Socket opened as {socket.id}</h1> : <h1>Socket not connected</h1>}
      {reason ? <h2>Last disconnect due to {reason}</h2> : ""}
      <form onSubmit={connectUser}>
        Input User ID:
        <input type="text" placeholder="User ID" onChange={updateUser} value={user} className="form-input ml-2 mb-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring" />
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Connect
        </button>
        <button
          type="button"
          onClick={disconnectUser}
          className="ml-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Disconnect
        </button>
      </form>
    </div>
  );
}

export default SocketTest;
