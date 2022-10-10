/**
 * Get the substring after the first match of a regular expression.
 * Note: Check that the regular expression matches the string before using this method.
 * @param str string to parse
 * @param regExp regular expression
 * @returns substring after if regex exists, null otherwise.
 */
export function getSubStringAfter(str: string, regExp: RegExp) {
    if (!regExp.test(str)) {
        return null;
    }
    const regMatchInfo = regExp.exec(str)
    // We can put all the ! here cause string is already tested
    return str.substring(regMatchInfo!.index + regMatchInfo![0]!.length);
}

/**
 * Get the substring before the first match of a regular expression.
 * Note: Check that the regular expression matches the string before using this method.
 * @param str string to parse
 * @param regExp regular expression
 * @returns substring after if regex exists, str otherwise.
 */
export function getSubStringBefore(str: string, regExp: RegExp) {
    if (!regExp.test(str)) {
        return str;
    }
    const regMatchInfo = regExp.exec(str)
    // We can put all the ! here cause string is already tested
    return str.substring(0, regMatchInfo!.index);
}


