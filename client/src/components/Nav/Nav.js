import React, { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../Logo";
import "./Nav.css";
import AUTH from "../../utils/AUTH";

const Nav = ({ user, handleSetUser }) => {
  const history = useHistory()
  let greeting;

  if (user === null) {
    greeting = <p>Hello guest</p>
  } else if (user.username) {
    greeting = (
      <Fragment>
        Welcome back, <strong>{user.username} </strong>
      </Fragment>
    )
  }

  const logout = (event) => {
    return AUTH.logout().then((response) => {
      if (response.status === 200) {
        handleSetUser(null);
        history.push('/')
      }
    });
  };

  return (
    <nav className="grid grid-cols-3 bg-red-desertSand text-red-blackBean p-3">
      <div className="w-12">
        <Link to="/"><Logo className="h-auto w-12" /></Link>
      </div>
      <div className="navbar-brand text-center p-1">The Web Dev Game!</div>
      <div className="bg-red-desertSand text-red-blackBean text-right p-1">
        <Link to="/profile">{greeting} </Link>| <Link to="#" className="logout" onClick={logout}>Log Out</Link>
      </div>
    </nav >
  )
};

export default Nav;
