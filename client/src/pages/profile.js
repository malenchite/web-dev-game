import React, { useEffect, useState } from "react";

import Avatar from "../components/Avatar";
import API from "../utils/API";

function Profile ({ user, setUser }) {
    const [history, setHistory] = useState([]);
    const [userPicture, setPicture] = useState([]);

    useEffect(() => {
        console.log(user);
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

    function saveAvatar () {
        setUser(oldUser => {
            let randomPicture = randomGenerator();
            //oldUser.avatar = randomPicture;
            API.saveAvatar(oldUser._id, randomPicture);
            console.log(oldUser);
            return { ...oldUser, avatar: randomPicture };
        })
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {user && (
                <>
                    <div className="shadow-xl bg-red-linen rounded-lg h-18 p-2 my-2">
                        <Avatar user={user} />
                        <button className="group relative flex justify-center my-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-mauveTaupe text-red-eggplant bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={saveAvatar} >Generate Random Avatar</button>
                        <h1 className="text-left text-red-blackBean">Welcome: {user.username}</h1>
                        <h2 className="text-left text-red-blackBean">Your Email: {user.email}</h2>
                    </div>
                    <div>
                        {history.map(gameData => (
                            <ul>
                                <li>{gameData.result}</li>
                                <li>{gameData.frontEndCorrect}/{gameData.frontEndTotal}</li>
                                <li>{gameData.backEndCorrect}/{gameData.backEndTotal}</li>
                                <li>{gameData.timestamp}</li>
                            </ul>
                        ))}
                    </div>
                </>)
            }
        </div>
    )
}

export default Profile