/**
 * An enum representing the state of text of the current character
 */

import { countDistinctSubstring, lastPartition, makeCloze, makePreCloze, partition } from "../util/str_utils";
import { CODE_STATUS, ParseOutput, STATE } from "./Parser";


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

// Separators within these blocks are ignored
const BLOCK_IGNORE_SEPARATOR = [
    { start: "$$", end: "$$" },
    { start: "$", end: "$" },
    { start: "\`", end: "\`" },
];


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

    if (line.startsWith("```")) {
        return startCodeBlock(line, clozeNumber);
    }

    const matchedGroups = line.match(BULLET_SEPARATOR_REGEX)?.groups ?? null;

    if (matchedGroups === null) {
        return {
            result: line,
            clozeNumber: clozeNumber,
            state: STATE.TEXT,
            codeStatus: CODE_STATUS.notCode()
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

    if (back?.trim()?.length === 0) {
        return {
            result: line,
            clozeNumber: clozeNumber,
            state: STATE.TEXT,
            codeStatus: CODE_STATUS.notCode()
        }
    }
    return {
        result: `${bullet} ${makePreCloze(front, clozeNumber)} ${separator} ${makeCloze(back, clozeNumber)}`,
        clozeNumber: clozeNumber + 1,
        state: STATE.TEXT,
        codeStatus: CODE_STATUS.notCode()
    };
}

function startCodeBlock(line: string, clozeNumber: number): ParseOutput {
    return {
        result: "",
        clozeNumber: clozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus: new CODE_STATUS(CODE_STATUS.getLanguageFromAlias(line.substring(3)))
    }
}


/*
UTILS
*/
function shiftSeparatorToNextDelimiter(
    front: string,
    current_separator: string,
    back: string,
    delimiter: string,
    possible_separators: string[]
): { front: string, separator: string, back: string } {

    // Shift string until delimiter to the front
    front += " " + current_separator + " " + lastPartition(back, delimiter).left + delimiter;
    back = lastPartition(back, delimiter).right;

    // Shift string until nearest possible separator to the front
    // Iterate over all possible separators, and pick the closes
    let substring_to_transfer: string;
    let new_separator: string;

    possible_separators.forEach(sep => {
        const substring = partition(back, sep).left
        if (substring_to_transfer === undefined || substring_to_transfer.length > substring.length) {
            substring_to_transfer = substring;
            new_separator = sep;
        }

    });

    // @ts-ignore we're literally checking if it is undefined here
    if (substring_to_transfer === undefined || new_separator === undefined) {
        throw new Error("Delimiter could not be found");
    }

    front += partition(back, new_separator).left;
    back = partition(back, new_separator).right;

    return {
        front,
        separator: new_separator,
        back
    };
}