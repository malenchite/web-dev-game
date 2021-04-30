import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import SocketTest from './pages/SocketTest';
import LoginForm from "./pages/login"
import SignupForm from "./pages/register"
import AUTH from "./utils/AUTH";
import { useState, useEffect } from "react";

function App () {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    AUTH.getUser().then(response => {
      // console.log(response.data);
      if (!!response.data.user) {
        setLoggedIn(true);
        setUser(response.data.user);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    });

    return () => {
      setLoggedIn(false);
      setUser(null);
    };
  }, []);

  const logout = (event) => {
    event.preventDefault();

    AUTH.logout().then(response => {
      // console.log(response.data);
      if (response.status === 200) {
        setLoggedIn(false);
        setUser(null);
      }
    });
  };

  const login = (username, password) => {
    AUTH.login(username, password).then(response => {
      console.log(response.data);
      if (response.status === 200) {
        // update the state
        setLoggedIn(true);
        setUser(response.data.user);
      }
    });
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/signup">
          <SignupForm />
        </Route>
        {process.env.REACT_APP_DEPLOYED ? "" : <Route path="/socket" component={SocketTest} />}
      </Switch>
    </Router>
  );
}

export default App;
