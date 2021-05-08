import React, { useState } from 'react';
import multiavatar from '@multiavatar/multiavatar'

import Avatar from "../components/Avatar"

function Profile({ user }) {
    let svgCode = multiavatar('Binx Bond')
    console.log(svgCode)

    return (
        <div>
            <Avatar user={user} />
            <h1 className="text-left">Welcome: {user.username}</h1>
            <h2 className="text-left">Your Email: {user.email}</h2>
        </div>


    )
}

export default Profile