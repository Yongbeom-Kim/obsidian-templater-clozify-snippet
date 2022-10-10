/**
 * An enum representing the state of text of the current character
 */

import { LineParser, ParseOutput, STATE } from "./Parser";


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
export function parseLine(line: string, clozeNumber: number): ParseOutput {
    // Line cannot contain newline
    if (/\n/.test(line)) {
        throw new Error("Line cannot contain \\n. Line is " + line)
    }
    // Cloze number cannot be less than 1
    if (clozeNumber < 1) {
        throw new Error("Cloze number cannot be less than 1")
    }

    const matchedGroups = line.match(BULLET_SEPARATOR_REGEX)?.groups ?? null;

    if (matchedGroups === null) {
        return {
            result: line + "\n",
            clozeNumber: clozeNumber,
            state: STATE.TEXT
        };
    }

    const { bullet, front, separator, back } = matchedGroups;

    return {
        result: `${bullet} c${clozeNumber}::::\{\{${front}\}\} ${separator} c${clozeNumber}::\{\{${back}\}\}\n`,
        clozeNumber: clozeNumber + 1,
        state: STATE.TEXT
    };
}

function main() {

}

main();