import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
// import { Container, Row, Col } from '../components/Grid';
// import { Card } from '../components/Card';
// import { Input, FormBtn } from '../components/Form';
import AUTH from '../utils/AUTH';
import Alert from "../components/Alert"

function SignupForm() {
    const [userObject, setUserObject] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        redirectTo: null
    });
    const [redirectTo, setRedirectTo] = useState(null);
    const [registered, setRegistered] = useState(false)

    const handleChange = (event) => {
        setUserObject({
            ...userObject,
            [event.target.name]: event.target.value
        });
    };

    const handleAlert = (event) => {
        event.preventDefault();

        setRedirectTo('/login');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO - validate!
        AUTH.signup({
            username: userObject.username,
            email: userObject.email,
            password: userObject.password
        }).then(response => {
            // console.log(response);
            if (!response.data.errmsg) {
                // <Alert title="Success!" message="Account created!" />
                // alert('account successfully created')
                setRegistered(true)

                // setRedirectTo('/login');
            } else {
                alert('duplicate');
            }
        });
    };

    if (redirectTo) {
        return <Redirect to={{ pathname: redirectTo }} />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-desertSand py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-md w-full space-y-8">
                <div>
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register for the Web Dev Game</h2>
                    {
                        registered &&
                        <Alert title="Success! " message="Account created!" handleAlert={handleAlert} />
                    }
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
                            <label htmlFor="email" className="sr-only">
                                Email:
              </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-red-eggplant bg-red-linen rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                value={userObject.email}
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
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
              </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-red-eggplant bg-red-linen rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={userObject.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="my-1 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSubmit}
                        >
                            Register
            </button>
                        <a href="/login">

                            <button
                                type="button"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Log In
            </button>
                        </a>
                    </div>
                </form>
            </div>

        </div>

        // <Container>
        //     <Row>
        //         <Col size="md-3"></Col>
        //         <Col size="md-6">
        //             <Card title="Register for The Web Dev Game">
        //                 <form style={{ marginTop: 10 }}>
        //                     <label htmlFor="username">Username: </label>
        //                     <Input
        //                         type="text"
        //                         name="username"
        //                         value={userObject.username}
        //                         onChange={handleChange}
        //                     />
        //                     <label htmlFor="email">Email: </label>
        //                     <Input
        //                         type="text"
        //                         name="email"
        //                         value={userObject.email}
        //                         onChange={handleChange}
        //                     />
        //                     <label htmlFor="password">Password: </label>
        //                     <Input
        //                         type="password"
        //                         name="password"
        //                         value={userObject.password}
        //                         onChange={handleChange}
        //                     />
        //                     <label htmlFor="confirmPassword">Confirm Password: </label>
        //                     <Input
        //                         type="password"
        //                         name="confirmPassword"
        //                         value={userObject.confirmPassword}
        //                         onChange={handleChange}
        //                     />
        //                     <Link to="/">Login</Link>
        //                     <FormBtn onClick={handleSubmit}>Register</FormBtn>
        //                 </form>
        //             </Card>
        //         </Col>
        //         <Col size="md-3"></Col>
        //     </Row>
        // </Container>
    )
}

export default SignupForm;
