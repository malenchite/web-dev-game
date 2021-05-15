import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import LoginForm from "./pages/login";
import SignupForm from "./pages/register";
import GameMaster from "./pages/GameMaster";
import Profile from "./pages/profile";
import Splash from "./pages/splash";
import NoMatch from "./pages/NoMatch";
import Nav from "./components/Nav";
import AUTH from "./utils/AUTH";

import "./App.css";

function App () {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    AUTH.getUser().then((response) => {
      if (!!response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      setUser(null);
    };
  }, []);

  const handleSetError = (err) => {
    setError(err);
  }

  const handleSetUser = (data) => {
    setUser(data);
  }

  const logout = (event) => {
    if (event) {
      event.preventDefault();
    }
    AUTH.logout().then((response) => {
      if (response.status === 200) {
        handleSetUser(null);
        setRedirectTo("/");
      }
    });
  };

  return (
    <div className="App">
      <Router>
        {redirectTo && <Redirect to={redirectTo} />}
        {user ? (
          <div>
            <Nav user={user} logout={logout} />
            <div className="main">
              <Switch>
                <Route exact path="/">
                  <GameMaster user={user} logout={logout} />
                </Route>
                <Route path="/profile">
                  <Profile user={user} handleSetUser={handleSetUser} />
                </Route>
                <Route path="/*" component={NoMatch} />
              </Switch>
            </div>
          </div>
        ) : (
          <div className="auth-wrapper">
            <Switch>
              <Route exact path="/" component={Splash} />
              <Route path="/signup">
                <SignupForm />
              </Route>
              <Route path="/login">
                <LoginForm error={error} handleSetError={handleSetError} handleSetUser={handleSetUser} />
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
