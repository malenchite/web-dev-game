import React, { useState } from "react";
import Logo from "../components/Logo";
<<<<<<< HEAD
import Alert from "../components/Alert"
import { useHistory } from "react-router-dom"
import AUTH from "../utils/AUTH";

function LoginForm({ error, handleSetError, handleSetUser }) {
  const history = useHistory()

=======
import { Helmet } from "react-helmet";

function LoginForm({ login }) {
>>>>>>> a2a11853e17b2c6c217c7974528538b799ba7135
  // Login code
  const [userObject, setUserObject] = useState({
    username: "",
    password: "",
  });



  const handleChange = (event) => {
    setUserObject({
      ...userObject,
      [event.target.name]: event.target.value,
    });
  };

  const handleError = (event) => {
    event.preventDefault()
    handleSetError(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    return AUTH.login(userObject.username, userObject.password).then((response) => {
      if (response.status === 200) {
        // update the state
        handleSetUser(response.data.user);
        history.push('/game')
      }
    })
      .catch(error => {
        handleSetError("Incorrect Username or Password!")
      });
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-desertSand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 text-red-blackBean">Sign in to the Web Dev Game</h2>
        </div>
        {
          error && <Alert title="Error " message={error} handleAlert={handleError} />
        }
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
                placeholder="User Name"
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
=======
  if (redirectTo) {
    return <Redirect to={{ pathname: redirectTo }} />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-desertSand py-12 px-4 sm:px-6 lg:px-8">
        <Helmet>
          <title>The Web Dev Game | Login</title>
        </Helmet>
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo className="mx-auto h-12 w-auto" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 text-red-blackBean">
              Sign in to the Web Dev Game
            </h2>
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
                  placeholder="User Name"
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
>>>>>>> a2a11853e17b2c6c217c7974528538b799ba7135
            </div>
          </div>

<<<<<<< HEAD
          <div>
            <button
              type="submit"
              className="my-1 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
            >
              Log in
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
  );
=======
            <div>
              <button
                type="submit"
                className="my-1 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSubmit}
              >
                Log in
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
    );
  }
>>>>>>> a2a11853e17b2c6c217c7974528538b799ba7135
}

// }

export default LoginForm;
