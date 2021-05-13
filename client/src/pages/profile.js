import React, { useEffect, useState } from "react";
import { compareAsc, format } from 'date-fns'

import Avatar from "../components/Avatar";
import API from "../utils/API";

function Profile({ user, setUser }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user) {
            API.getGameData(user._id)
                .then(res => {
                    setHistory(res.data);
                })
                .catch(err => console.log(err));
        }
    }, [user]);

    const randomGenerator = () => {
        var result = [];
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 10; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        return result.join("");
    }


    function saveAvatar() {
        let randomPicture = randomGenerator();
        API.saveAvatar(user._id, randomPicture)
            .then(() => setUser({ ...user, avatar: randomPicture }))
        // setUser(oldUser => {
        //     let randomPicture = randomGenerator();
        //     //oldUser.avatar = randomPicture;
        //     API.saveAvatar(oldUser._id, randomPicture);
        //     console.log(oldUser);
        //     return { ...oldUser, avatar: randomPicture };
        // })
    }

    return (
        <div className="grid grid-cols-5 gap-4">
            {user && (
                <>
                    <div className="shadow-xl bg-red-linen rounded-lg h-18 p-2 my-2 col-start-1 col-end-2">
                        <Avatar user={user} />
                        <button className="group relative flex justify-center my-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={saveAvatar} >Generate Random Avatar</button>
                        <h1 className="text-left text-red-blackBean text-lg">Welcome: {user.username}</h1>
                        <h2 className="text-left text-red-blackBean text-lg">Your Email: {user.email}</h2>
                    </div>
                    <div className="shadow-xl bg-red-linen rounded-lg h-18 p-2 my-2 col-start-2 col-end-4 px-2 h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-red-eggplant scrollbar-track-red-linen">
                        <h1 className="text-left text-red-blackBean text-xl" ><strong>Game History:</strong></h1>
                        <br />
                        {history.slice(0).reverse().map(({ result, frontEndCorrect, frontEndTotal, backEndCorrect, backEndTotal, timestamp }) => {
                            return (
                                <div key={timestamp} className="text-left text-red-blackBean text-lg bg-red-desertSand mb-4 mr-6">
                                    <strong>Game Result:</strong> {result}<br />
                                    <strong>Front End Points:</strong> {frontEndCorrect} correct out of {frontEndTotal} possible<br />
                                    <strong>Back End Points:</strong> {backEndCorrect} correct out of {backEndTotal} possible<br />
                                    <strong>Date Completed:</strong> {format(new Date(timestamp), 'MM/dd/yyyy')}<br />

                                </div>
                            )
                        })}
                    </div>
                </>)
            }
        </div>
    )
}

export default Profile