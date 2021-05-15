import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginForm from "./pages/login";
import SignupForm from "./pages/register";
import Nav from "./components/Nav";
import AUTH from "./utils/AUTH";
import { useState, useEffect } from "react";
import GameMaster from "./pages/GameMaster";
import Profile from "./pages/profile";
import Splash from "./pages/splash";
import NoMatch from "./pages/NoMatch";

function App () {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    AUTH.getUser().then((response) => {
      console.log(response.data.user)
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
    AUTH.logout().then((response) => {
      if (response.status === 200) {
        setLoggedIn(false);
        return setUser(null);
      }
    });
  };

  const login = (username, password) => {
    AUTH.login(username, password).then((response) => {
      if (response.status === 200) {
        // update the state
        setLoggedIn(true);
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
              <Switch>
                <Route exact path="/">
                  <GameMaster user={user} logout={logout} />
                </Route>
                <Route path="/profile">
                  <Profile user={user} setUser={setUser} />
                </Route>
                <Route path="/*" component={NoMatch}></Route>
              </Switch>
            </div>
          </div>
        )}
        {!loggedIn && (
          <div className="auth-wrapper">
            <Switch>
              <Route exact path="/" component={() => <Splash />} />
              <Route exact path="/profile" component={() => <Splash />} />
              <Route path="/signup">
                <SignupForm />
              </Route>
              <Route path="/login">
                <LoginForm login={login} />
              </Route>
              <Route path="/*" component={NoMatch}></Route>
            </Switch>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;
