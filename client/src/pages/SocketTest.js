import { useState, useEffect } from "react";
import io from "socket.io-client";
import AUTH from "../utils/AUTH";
import { Card } from '../components/Card';
import { Input, FormBtn } from '../components/Form';

const ENDPOINT = "http://localhost:3001";
const USER_INFO_EVENT = "user info";

function SocketTest () {
  const [socket, setSocket] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [reason, setReason] = useState(undefined);
  const [userObject, setUserObject] = useState({
    username: '',
    password: ''
  });

  const login = (username, password) => {
    AUTH.login(username, password).then(response => {
      console.log(response.data);
      if (response.status === 200) {
        connectUser(response.data.user);
        setUserInfo(response.data.user);
      }
    });
  };

  const logout = () => {
    AUTH.logout().then(response => {
      console.log(response.data);
      if (response.status === 200) {
        disconnectUser();
        setUserInfo(null);
      }
    });
  };

  const handleChange = (event) => {
    setUserObject({
      ...userObject,
      [event.target.name]: event.target.value
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    login(userObject.username, userObject.password);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };

  const connectUser = (info) => {
    if (!info) {
      console.log('No user to connect!');
      return;
    }

    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(ENDPOINT);

    newSocket.on('connect', () => {
      newSocket.emit(USER_INFO_EVENT, {
        userId: info._id
      });

      console.log(`Connecting on socket ${newSocket.id} as user ${info._id}`);

      /* Store socket in state */
      setSocket(newSocket);

      newSocket.on('disconnect', reason => {
        setReason(reason);
        if (reason === 'io server disconnect') {
          logout();
          setSocket(null);
        }
      });
    });
  }

  const disconnectUser = () => {
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
      {userInfo ? <h2>User logged in as {userInfo._id}</h2> : <h2>No user logged in</h2>}
      {reason ? <h2>Last disconnect due to {reason}</h2> : ""}
      <Card title="Socket Login Test">
        <form style={{ marginTop: 10 }}>
          <label htmlFor="username">Username: </label>
          <Input
            type="text"
            name="username"
            value={userObject.username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password: </label>
          <Input
            type="password"
            name="password"
            value={userObject.password}
            onChange={handleChange}
          />
          <FormBtn onClick={handleLogin}>Login</FormBtn>
          <br />
          <FormBtn onClick={handleLogout}>Disconnect</FormBtn>
          <br />
        </form>
      </Card>
    </div>
  );
}

export default SocketTest;
