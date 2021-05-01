import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SocketTest from "./pages/SocketTest";
import LoginForm from "./pages/login";
import SignupForm from "./pages/register";
import Nav from "./components/Nav";
import AUTH from "./utils/AUTH";
import { useState, useEffect } from "react";
import Lobby from "./pages/lobby";
import Profile from "./pages/profile";
import GamePage from "./pages/gamePage";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    AUTH.getUser().then((response) => {
      // console.log(response.data);
      if (!!response.data.user) {
        setLoggedIn(true);
        return setUser(response.data.user);
      } else {
        setLoggedIn(false);
        return setUser(null);
      }
    });

    return () => {
      setLoggedIn(false);
      setUser(null);
    };
  }, []);

  const logout = (event) => {
    event.preventDefault();

    AUTH.logout().then((response) => {
      // console.log(response.data);
      if (response.status === 200) {
        // disconnectUser();
        // setUserInfo(null);
        // setChallenger(null);
        // setChallengeRsp(null)
        // setLobbyUsers([]);
        // setChat([])
        setLoggedIn(false);
        return setUser(null);
      }
    });
  };

  const login = (username, password) => {
    AUTH.login(username, password).then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        // update the state
        setLoggedIn(true);
        // connectUser(response.data.user)
        return setUser(response.data.user);
      }
    });
  };

  return (
    <div className="App">
      <Router>
        {loggedIn && (
          <div>
            <Nav user={user} logout={logout} />
            <div className="main">
              <Route exact path="/">
                <Lobby />
              </Route>
              <Route path="/game">
                <GamePage />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              {process.env.REACT_APP_DEPLOYED ? (
                ""
              ) : (
                <Route path="/socket" component={SocketTest} />
              )}
            </div>
          </div>
        )}
        {!loggedIn && (
          <div className="auth-wrapper">
            <Route exact path="/" component={() => <LoginForm login={login} />} />
            <Route
              exact
              path="/game"
              component={() => <LoginForm login={login} />}
            />
            <Route
              exact
              path="/profile"
              component={() => <LoginForm login={login} />}
            />
            <Route path="/signup">
              <SignupForm />
            </Route>
            {process.env.REACT_APP_DEPLOYED ? (
              ""
            ) : (
              <Route path="/socket" component={SocketTest} />
            )}
          </div>

        )}
        {/* {!loggedIn && (
          <div className="auth-wrapper">
            <Router>
              <Route exact path="/" component={() => <LoginForm login={login} />} />
              <Route
                exact
                path="/game"
                component={() => <LoginForm login={login} />}
              />
              <Route
                exact
                path="/profile"
                component={() => <LoginForm login={login} />}
              />
              <Route path="/signup">
                <SignupForm />
              </Route>
              {process.env.REACT_APP_DEPLOYED ? (
                ""
              ) : (
                <Route path="/socket" component={SocketTest} />
              )}
            </Router>
          </div>
        )} */}
        <Router>
          <Switch>
            <Route path="/login">
              <LoginForm />
            </Route>
          </Switch>
        </Router>
      </Router>
    </div>
  );
}

export default App;
