import React, { useState } from 'react';
import multiavatar from '@multiavatar/multiavatar'
import './avatar.css'


function Avatar({ user }) {
    let svgCode = multiavatar(user.username)
    return (
        <div dangerouslySetInnerHTML={{ __html: svgCode }} />
    )
}

export default Avatar