/**
 * Get the substring after the first match of a regular expression.
 * Note: Check that the regular expression matches the string before using this method.
 * @param str string to parse
 * @param query regular expression
 * @returns substring after if regex exists, null otherwise.
 */
export function getSubStringAfter(str: string, query: RegExp | string): string {
    if (query instanceof RegExp) {
        if (!query.test(str)) {
            return "";
        }
        const regMatchInfo = query.exec(str)
        // We can put all the ! here cause string is already tested
        return str.substring(regMatchInfo!.index + regMatchInfo![0]!.length);
    } else if (typeof query === "string") {
        if (!str.includes(query)) {
            return str;
        }
        return str.substring(str.indexOf(query) + query.length);
    } else {
        throw new Error("Invalid query type");
    }
}

/**
 * Get the substring before the first match of a regular expression or string.
 * Note: Check that the regular expression matches the string before using this method.
 * @param str string to parse
 * @param query regular expression or string
 * @returns substring after if query in string, the string itself otherwise.
 */
 export function getSubStringBefore(str: string, query: RegExp | string) {
    // console.log({str, query});
    if (query instanceof RegExp) {
        if (!query.test(str)) {
            return str;
        }
        const regMatchInfo = query.exec(str)
        // We can put all the ! here cause string is already tested
        return str.substring(0, regMatchInfo!.index);

    } else if (typeof (query) === "string") {
        if (!str.includes(query)) {
            return str;
        }
        return str.substring(0, str.indexOf(query));
    } else {
        throw new Error("Invalid query type");
    }
}

/**
 * Returns the number of distinct occurrences (excluding overlaps)
 * of a substring in a string.
 * @param str string to be searched in
 * @param substring substring to search
 * @returns number of substrings found
 */
export function countDistinctSubstring(str: string, substring: string): number {
    return str.split(substring).length - 1
}