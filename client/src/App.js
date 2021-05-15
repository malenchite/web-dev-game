import "./App.css";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import LoginForm from "./pages/login";
import SignupForm from "./pages/register";
import Nav from "./components/Nav";
import AUTH from "./utils/AUTH";
import { useState, useEffect } from "react";
import GameMaster from "./pages/GameMaster";
import Profile from "./pages/profile";
import Splash from "./pages/splash";
import NoMatch from "./pages/NoMatch";
import { set } from "mongoose";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
    setError(err)
  }


  const handleSetUser = (data) => {
    setUser(data)

  }

  return (
    <div className="App">
      <Router>
        {user ? (
          <div>
            <Nav user={user} handleSetUser={handleSetUser} />
            <div className="main">
              <Switch>
                <Route exact path="/game">
                  <GameMaster user={user} handleSetUser={handleSetUser} />
                </Route>
                <Route path="/profile">
                  <Profile user={user} setUser={setUser} />
                </Route>
                <Route path="/*" component={NoMatch}></Route>
              </Switch>
            </div>
          </div>
        ) : (
          <div className="auth-wrapper">
            <Switch>
              <Route exact path="/" component={() => <Splash />} />
              <Route exact path="/profile" component={() => <Splash />} />
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
