import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
// import { Col } from '../Grid';
import './Nav.css';
import Slideover from '../Slideover';
import { Popover, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/solid'

const Nav = ({ user, logout }) => {
  let greeting;

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

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
        <Link to="/profile">{greeting} </Link>| <Link to="#" className="logout" onClick={logout}>Log Out</Link>
      </div>

            {/* Slideover Code */}
            <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-gray-900' : 'text-gray-500',
              'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            )}
          >
            <MenuIcon
              className={classNames(open ? 'text-gray-600' : 'text-gray-400', 'ml-2 h-5 w-5 group-hover:text-gray-500')}
              aria-hidden="true" 
            />
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0"
            >
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                  <Slideover />
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
      </Popover>

    </nav>
  )
};

export default Nav;
