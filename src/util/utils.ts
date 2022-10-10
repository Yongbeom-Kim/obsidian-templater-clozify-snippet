export function getSubStringAfter(str: string, regExp: RegExp) {
    if (!regExp.test(str)) {
        return null;
    }
    const regMatchInfo = regExp.exec(str)
    // We can put all the ! here cause string is already tested
    return str.substring(regMatchInfo!.index + regMatchInfo![0]!.length);
}

export function getSubStringBefore(str: string, regExp: RegExp) {
    if (!regExp.test(str)) {
        return str;
    }
    const regMatchInfo = regExp.exec(str)
    // We can put all the ! here cause string is already tested
    return str.substring(0, regMatchInfo!.index);
}


