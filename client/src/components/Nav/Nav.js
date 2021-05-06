import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import { Col } from '../Grid';
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-success bg-red-desertSand text-red-blackBean">
      <Col size="md-6 sm-6">
        <Link to="/" className="navbar-brand">The Web Dev Game!</Link>

      </Col>

      <div className="float-right bg-red-desertSand text-red-blackBean">
        {greeting} - <Link to="#" className="logout" onClick={logout}>Logout</Link>
      </div>

    </nav>
  )
};

export default Nav;
