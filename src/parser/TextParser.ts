/**
 * An enum representing the state of text of the current character
 */

import { countDistinctSubstring, getSubStringAfter, getSubStringBefore } from "../util/str_utils";
import { ParseOutput, STATE } from "./Parser";


const ALLOWED_BULLETS = ["\\d*\\.", "-"];
const ALLOWED_SEPARATORS = ["-", "="];
const PARSED_BULLET_REGEX = ALLOWED_BULLETS.join("|"); // Concatenate possible bullets with |
const PARSED_SEPARATOR_REGEX = ALLOWED_SEPARATORS.join("|"); // Concatenate possible bullets with |

const BULLET_SEPARATOR_REGEX = new RegExp(
    "(?<=^\\s*)"
    + "(?<bullet>" + PARSED_BULLET_REGEX + ")"
    + "\\s+"
    + "(?<front>(?:(?!( = | - )).)*)"
    + "\\s+"
    + "(?<separator>" + PARSED_SEPARATOR_REGEX + ")"
    + "\\s+"
    + "(?<back>.*)")
// console.log({ BULLET_SEPARATOR_REGEX })
/**
 * When given a line of plain text to parse (not code or LaTeX), parses line into appropriate anki cloze format.
 * 
 * Does:
    * - one - two => - {{c1::::one }} - {{c1::two }}
    * - one - two => - {{c1::::one }} = {{c1::two }}
    * 1. one - two => 1. {{c1::::one }} - {{c1::two }}
    * 1. one - two => 1. {{c1::::one }} = {{c1::two }}
* 
 * @param line line to parse
 * @param clozeNumber current Cloze number
 * @returns 
 */
export function parseText(line: string, clozeNumber: number): ParseOutput {
    // Line cannot contain newline
    if (/\n/.test(line)) {
        throw new Error("Line cannot contain \\n. Line is " + line)
    }
    // Cloze number cannot be less than 1
    if (clozeNumber < 1) {
        throw new Error("Cloze number cannot be less than 1")
    }
    // console.log(line + "\n");

    const matchedGroups = line.match(BULLET_SEPARATOR_REGEX)?.groups ?? null;

    if (matchedGroups === null) {
        return {
            result: line,
            clozeNumber: clozeNumber,
            state: STATE.TEXT
        };
    }

    let { bullet, front, separator, back } = matchedGroups;

    if (countDistinctSubstring(front ?? "", "$$") % 2 === 1) {
        ({ front, separator, back }
            = shiftSeparatorToNextDelimiter(
                front ?? "",
                separator ?? "",
                back ?? "", "$$",
                ALLOWED_SEPARATORS));
    }
    return {
        result: `${bullet} c${clozeNumber}::::\{\{${front}\}\} ${separator} c${clozeNumber}::\{\{${back}\}\}`,
        clozeNumber: clozeNumber + 1,
        state: STATE.TEXT
    };
}

function shiftSeparatorToNextDelimiter(
    front: string,
    current_separator: string,
    back: string,
    delimiter: string,
    possible_separators: string[]
): { front: string, separator: string, back: string } {

    console.log({ front, back })
    // Shift string until delimiter to the front
    front += " " + current_separator + " " + getSubStringBefore(back, delimiter) + delimiter;
    back = getSubStringAfter(back, new RegExp(delimiter));

    // Shift string until nearest possible separator to the front
    // Iterate over all possible separators, and pick the closes
    let substring_to_transfer: string;
    let new_separator: string;

    possible_separators.forEach(sep => {
        const substring = getSubStringBefore(back, new RegExp(delimiter));
        if (substring_to_transfer === undefined || substring_to_transfer.length > substring.length) {
            substring_to_transfer = substring;
            new_separator = sep;
        }
    });

    // @ts-ignore we're literally checking if it is undefined here
    if (substring_to_transfer === undefined || new_separator === undefined) {
        throw new Error("Delimiter could not be found");
    }

    front += substring_to_transfer;
    back = getSubStringAfter(back, new RegExp(new_separator));

    return {
        front,
        separator: new_separator,
        back
    };
}