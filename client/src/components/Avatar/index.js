import multiavatar from '@multiavatar/multiavatar';

function Avatar ({ user, className, size }) {
    let svgCode = multiavatar(user.avatar ? user.avatar : user.username);

    /* Adds a height attribute to the svg tag to change its size */
    if (size) {
        svgCode = svgCode.replace(/<svg/g, `<svg height="${size}"`);
    }

    return (
        <div className={className} dangerouslySetInnerHTML={{ __html: svgCode }} />
    )
}

export default Avatar;