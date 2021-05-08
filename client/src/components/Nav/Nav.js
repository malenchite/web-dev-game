import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
// import { Col } from '../Grid';
// import './Nav.css';

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

    <nav className="grid grid-cols-3 bg-red-desertSand text-red-blackBean p-3">
      {/* <Col size="md-4 sm-6"> */}
      <div></div>
      <Link to="/" className="navbar-brand text-center p-1">The Web Dev Game!</Link>

      {/* </Col> */}

      <div className="bg-red-desertSand text-red-blackBean text-right p-1">
        <Link to="/profile">{greeting} </Link>| <Link to="#" className="logout" onClick={logout}>Logout</Link>
      </div>

    </nav>
  )
};

export default Nav;
