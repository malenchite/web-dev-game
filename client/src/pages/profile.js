import React, { useState } from 'react';


function Profile({ user }) {

    return (
        <div>
            <h1>Welcome {user.username}</h1>
            <h2>Your Email: {user.email}</h2>
        </div>


    )
}

export default Profile