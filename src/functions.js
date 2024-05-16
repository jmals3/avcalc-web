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