import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import Logo from "../Logo";

import "./Nav.css";

const Nav = ({ user, logout }) => {
  let greeting;
  const location = useLocation();

  if (user === null) {
    greeting = <p>Hello guest</p>
  } else if (user.username) {
    greeting = (
      <Fragment>
        <strong>{user.username} </strong>
      </Fragment>
    )
  }
  function navRender () {
    if (location.pathname === "/") {
      return <Link to="/profile"> Profile </Link>
    }
    else if (location.pathname === "/profile") {
      return <Link to="/"> Home </Link>
    }
  }

  return (
    <nav className="grid grid-cols-3 bg-red-desertSand text-red-blackBean p-3" role="navigation">
      <div className="w-12">
        <Link to="/"><Logo className="h-auto w-12" /></Link>
      </div>
      <div className="navbar-brand text-center p-1">The Web Dev Game!</div>
      <div className="bg-red-desertSand text-red-blackBean text-right p-1">
        <Link to="/profile">{greeting} </Link>| {navRender()} | <Link to="#" className="logout" onClick={logout}>Log Out</Link>
      </div>
    </nav >
  )
};

export default Nav;
