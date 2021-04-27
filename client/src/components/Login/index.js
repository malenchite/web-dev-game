import React from 'react';
import './index.css';

function Login() {
  return (
    <section
      className="invisible fixed z-10 inset-0 overflow-y-auto"
      id="login-modal"
    >
      <section className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay, show/hide based on modal state. */}
        <section
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
        >
          <section className="absolute inset-0 bg-gray-500 opacity-75"></section>
        </section>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>

        {/* Modal panel, show/hide based on modal state. */}
        <section
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          id="login-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <section className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 md:p-12 md:pb-8 lg:p-24 lg:pb-16">
            <section className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-gray text-sm z-50">
              <svg
                className="fill-current text-gray"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                id="login-close"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </section>
            <section className="flex justify-center sm:flex sm:items-start">
              <form action="#" method="POST">
                <section className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  {/* block sets input label to display:block so it displays above the input box */}
                  <label className="block mb-2 text-indigo-500" for="email">
                    Email
                  </label>
                  {/* p-2 sets padding at 0.5rem */}
                  <input
                    className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300 rounded"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                  />
                </section>
                <section className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <label className="block mb-2 text-indigo-500" for="password">
                    Password
                  </label>
                  <input
                    className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300 rounded"
                    type="password"
                    name="password"
                    id="user_password"
                    placeholder="Password"
                  />
                </section>
                <section className="bg-white-50 px-4 py-3 sm:px-12 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    id="login"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit
                  </button>
                </section>
              </form>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Login;
