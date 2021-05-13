import React from 'react';
import multiavatar from '@multiavatar/multiavatar'
import './avatar.css'


function Avatar (props) {
    const user = props.user;
    let seed = ""
    if (user.avatar) {
        seed = user.avatar
    }
    else {
        seed = user.username
    }
    let svgCode = multiavatar(seed)
    return (
        <div className={props.className} dangerouslySetInnerHTML={{ __html: svgCode }} />
    )
}

export default Avatar