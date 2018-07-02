export default function addCookie(username, imgURL) {
    return {
        type: 'COOKIE',
        username: username,
        imgURL: imgURL
    };
};
