import './App.css';
import { HashRouter, Switch, Route } from "react-router-dom";
import SocketTest from './pages/SocketTest';

function App () {
  return (
    <HashRouter>
      <Switch>
        {process.env.REACT_APP_DEPLOYED ? "" : <Route path="/socket" component={SocketTest} />}
      </Switch>
    </HashRouter>
  );
}

export default App;
