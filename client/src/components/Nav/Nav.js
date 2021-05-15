import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";

import Logo from "../Logo";

import "./Nav.css";

const Nav = ({ user, logout }) => {

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

  return (
    <nav className="grid grid-cols-3 bg-red-desertSand text-red-blackBean p-3" role="navigation">
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
