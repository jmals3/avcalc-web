export function getComplementaryColor(hexColor) {
    let r = 255 - parseInt(hexColor.slice(1, 3), 16);
    let g = 255 - parseInt(hexColor.slice(3, 5), 16);
    let b = 255 - parseInt(hexColor.slice(5, 7), 16);

    r = r.toString(16).padStart(2, '0');
    g = g.toString(16).padStart(2, '0');
    b = b.toString(16).padStart(2, '0');

    return '#' + r + g + b;
}

export function isJsonObject(obj) {
    return typeof obj === 'object' && obj !== null;
}

export function hyphenStrs(...strList) {
    strList = strList.map(str => str.toLowerCase());
    strList = strList.map(str => str.replace(/\s/g, '-'));
    return strList.join('-');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function extractUserFromToken() {
    const token = getCookie('token');
    if (!token) {
        console.error('Token not found in cookies');
        return null;
    }

    const jwtPayload = parseJwt(token);
    const username = jwtPayload.username;
    const guid = jwtPayload.userGUID;

    if (username && guid) {
        return {
            username: username,
            guid: guid,
        };
    }

    return null;
}
