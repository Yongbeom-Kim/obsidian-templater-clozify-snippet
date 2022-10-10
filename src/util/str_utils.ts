/**
 * Partitions a given string by a delimiter by its first occurrence
 * @param str string to partition
 * @param delimiter
 * @returns {left: string, right: string} object, right string is empty if no delimiter found
 */
export function partition(str: string, delimiter: string): {left: string, right: string} {
    const splitString: string[] = str.split(delimiter);

    return {
        left: splitString[0] ?? "", 
        right: splitString?.slice(1)?.join(delimiter) ?? ""
    };
}

/**
 * Partitions a given string by a delimiter by its first occurrence
 * @param str string to partition
 * @param delimiter
 * @returns {left: string, right: string} object, left string is empty if no delimiter found
 */
export function lastPartition(str: string, delimiter: string): {left: string, right: string} {
    const splitString = str.split(delimiter);

    return {
        left: splitString?.slice(0, -1)?.join(delimiter) ?? "",
        right: splitString[splitString.length - 1] ?? ""
    };
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