import React, { useState } from 'react';


import Avatar from "../components/Avatar"

function Profile({ user, setUser }) {

    const randomGenerator = () => {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        for (var i = 0; i < 10; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * characters.length)))
        }
        return result.join('')
    }
    // console.log(randomGenerator())
    function saveAvatar() {

        setUser(oldUser => {
            return { ...oldUser, avatar: randomGenerator() }
        })
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="shadow-xl bg-white rounded-lg h-18 p-2">
                <Avatar user={user} />
                <button onClick={saveAvatar} >Button</button>
                <h1 className="text-left text-red-blackBean">Welcome: {user.username}</h1>
                <h2 className="text-left text-red-blackBean">Your Email: {user.email}</h2>
            </div>
        </div>


    )
}

export default Profile