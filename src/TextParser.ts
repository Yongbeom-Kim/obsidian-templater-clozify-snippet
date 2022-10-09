/**
 * An enum representing the state of text of the current character
 */

import { LineParser, ParseOutput, STATE } from "./Parser";

export default class PlainTextParser implements LineParser {

    private constructor() {}
    private static instance = new PlainTextParser();
    
    static get(): PlainTextParser{
        return PlainTextParser.instance;
    }

    static readonly ALLOWED_BULLETS = ["\\d*\\.", "-"];
    static readonly ALLOWED_SEPARATORS = ["-", "="];
    static readonly PARSED_BULLET_REGEX = PlainTextParser.ALLOWED_BULLETS.join("|"); // Concatenate possible bullets with |
    static readonly PARSED_SEPARATOR_REGEX = PlainTextParser.ALLOWED_SEPARATORS.join("|"); // Concatenate possible bullets with |

    static readonly BULLET_SEPARATOR_REGEX = new RegExp(
        "(?<=^\\s*)"
        + "(?<bullet>" + PlainTextParser.PARSED_BULLET_REGEX + ")"
        + "\\s+"
        + "(?<front>(?:(?!( = | - )).)*)"
        + "\\s+"
        + "(?<separator>" + PlainTextParser.PARSED_SEPARATOR_REGEX + ")"
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
    parseLine(line: string, clozeNumber: number): ParseOutput {
        // Line cannot contain newline
        if (/\n/.test(line)) {
            throw new Error("Line cannot contain \\n. Line is " + line)
        }

        // Cloze number cannot be less than 1
        if (clozeNumber < 1) {
            throw new Error("Cloze number cannot be less than 1")
        }

        const matchedGroups = line.match(PlainTextParser.BULLET_SEPARATOR_REGEX)?.groups ?? null;

        if (matchedGroups === null) {
            return {
                result: line,
                clozeNumber: clozeNumber,
                state: STATE.TEXT
            };
        }

        const { bullet, front, separator, back } = matchedGroups;

        return {
            result: `${bullet} c${clozeNumber}::::\{\{${front}\}\} ${separator} c${clozeNumber}::\{\{${back}\}\}`,
            clozeNumber: clozeNumber + 1,
            state: STATE.TEXT
        };
    }

}

function main() {

}

main();