import React, { useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
import { Redirect, Link } from "react-router-dom";
// import { Container, Row, Col } from "../components/Grid";
// import { Card } from "../components/Card";
// import { Input, FormBtn } from "../components/Form";

function LoginForm({ login }) {


  // Login code
  const [userObject, setUserObject] = useState({
    username: "",
    password: "",
  });
  const [redirectTo, setRedirectTo] = useState(null);

  const handleChange = (event) => {
    setUserObject({
      ...userObject,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(userObject.username, userObject.password);
    setRedirectTo("/");
  };

  if (redirectTo) {
    return <Redirect to={{ pathname: redirectTo }} />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-desertSand py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 text-red-blackBean">Sign in to the Web Dev Game</h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username:
              </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-red-eggplant bg-red-linen rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="UserName"
                  value={userObject.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
              </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-red-eggplant bg-red-linen rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={userObject.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSubmit}
              >
                Sign in
            </button>
              <a href="/signup">

                <button
                  type="button"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
            </button>
              </a>
            </div>
          </form>
        </div>
      </div>



      // <Container>
      //   <Row>
      //     <Col size="md-3"></Col>
      //     <Col size="md-6">
      //       <Card title="Login to The Web Dev Game">
      //         <form style={{ marginTop: 10 }}>
      //           <label htmlFor="username">Username: </label>
      //           <Input
      //             type="text"
      //             name="username"
      //             value={userObject.username}
      //             onChange={handleChange}
      //           />
      //           <label htmlFor="password">Password: </label>
      //           <Input
      //             type="password"
      //             name="password"
      //             value={userObject.password}
      //             onChange={handleChange}
      //           />
      //           <Link to="/signup">Register</Link>
      //           <FormBtn onClick={handleSubmit}>Login</FormBtn>
      //         </form>
      //       </Card>
      //     </Col>
      //     <Col size="md-3"></Col>
      //   </Row>
      // </Container>

    );
  }

}

export default LoginForm;
