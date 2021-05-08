import React, { useState } from 'react';
import multiavatar from '@multiavatar/multiavatar'

import Avatar from "../components/Avatar"

function Profile({ user }) {
    let svgCode = multiavatar('Binx Bond')
    console.log(svgCode)

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="shadow-xl bg-white rounded-lg h-18 p-2">
                <Avatar user={user} />
                <h1 className="text-left text-red-blackBean">Welcome: {user.username}</h1>
                <h2 className="text-left text-red-blackBean">Your Email: {user.email}</h2>
            </div>
        </div>


    )
}

export default Profile