import React from 'react';
import multiavatar from '@multiavatar/multiavatar'
import './avatar.css'


function Avatar({ user }) {
    let seed = ""
    if (user.avatar) {
        seed = user.avatar
    }
    else {
        seed = user.username
    }
    let svgCode = multiavatar(seed)
    return (
        <div dangerouslySetInnerHTML={{ __html: svgCode }} />
    )
}

export default Avatar