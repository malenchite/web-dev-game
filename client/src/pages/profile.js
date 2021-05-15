import React, { useEffect, useState } from "react";
import { format } from "date-fns";

import Avatar from "../components/Avatar";
import API from "../utils/API";

function Profile ({ user, setUser }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user && history.length === 0) {
            API.getGameData(user._id)
                .then(res => {
                    setHistory(res.data);
                })
                .catch(err => console.log(err));
        }
    }, [user, history]);

    const randomGenerator = () => {
        var result = [];
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 10; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        return result.join("");
    }

    function saveAvatar () {
        let randomPicture = randomGenerator();
        API.saveAvatar(user._id, randomPicture)
            .then(() => setUser({ ...user, avatar: randomPicture }));
    }

    return (
        <div className="grid grid-cols-5 gap-4 mt-3">
            {user && (
                <>
                    <div className="shadow-xl bg-red-desertSand rounded-lg p-4 col-start-2 col-end-3 grid grid-rows-8 gap-0">
                        <Avatar user={user} size={200} className="mx-auto row-span-4" />
                        <div className="place-content-center">
                            <button className="group relative my-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-40" onClick={saveAvatar}>Randomize Avatar</button>
                        </div>
                        <div>
                            <h2 className="text-red-blackBean text-lg font-bold">{user.username}</h2>
                            <h3 className="text-red-blackBean text-lg">{user.email}</h3>
                        </div>
                    </div>
                    <div className="shadow-xl bg-red-desertSand rounded-lg p-2 col-start-3 col-end-5 px-3 h-96">
                        <h1 className="text-left text-red-blackBean text-xl" ><strong>Game History</strong></h1>
                        <br />
                        <div className="h-72 overflow-y-scroll scrollbar-thin scrollbar-thumb-red-eggplant scrollbar-track-red-linen">
                            {history.slice(0).reverse().map(({ result, frontEndCorrect, frontEndTotal, backEndCorrect, backEndTotal, timestamp }) => {
                                return (
                                    <div key={timestamp} className="text-left text-red-blackBean bg-opacity-70 text-lg bg-red-linen mb-4 mr-6 px-3">
                                        <strong>Game Result:</strong> {result.charAt(0).toUpperCase() + result.slice(1)}<br />
                                        <strong>Front-End Questions:</strong> {frontEndCorrect} correct out of {frontEndTotal} possible<br />
                                        <strong>Back-End Questions:</strong> {backEndCorrect} correct out of {backEndTotal} possible<br />
                                        <strong>Date:</strong> {format(new Date(timestamp), 'MM/dd/yyyy')}<br />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>)
            }
        </div>
    )
}

export default Profile