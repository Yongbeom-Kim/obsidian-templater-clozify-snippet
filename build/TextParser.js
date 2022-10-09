"use strict";
/**
 * An enum representing the state of text of the current character
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
class PlainTextParser {
    constructor() { }
    static get() {
        return PlainTextParser.instance;
    }
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
    parseLine(line, clozeNumber) {
        // Line cannot contain newline
        if (/\n/.test(line)) {
            throw new Error("Line cannot contain \\n. Line is " + line);
        }
        // Cloze number cannot be less than 1
        if (clozeNumber < 1) {
            throw new Error("Cloze number cannot be less than 1");
        }
        const matchedGroups = line.match(PlainTextParser.BULLET_SEPARATOR_REGEX)?.groups ?? null;
        if (matchedGroups === null) {
            return {
                result: line,
                clozeNumber: clozeNumber,
                state: Parser_1.STATE.TEXT
            };
        }
        const { bullet, front, separator, back } = matchedGroups;
        return {
            result: `${bullet} c${clozeNumber}::::\{\{${front}\}\} ${separator} c${clozeNumber}::\{\{${back}\}\}`,
            clozeNumber: clozeNumber + 1,
            state: Parser_1.STATE.TEXT
        };
    }
}
exports.default = PlainTextParser;
PlainTextParser.instance = new PlainTextParser();
PlainTextParser.ALLOWED_BULLETS = ["\\d*\\.", "-"];
PlainTextParser.ALLOWED_SEPARATORS = ["-", "="];
PlainTextParser.PARSED_BULLET_REGEX = PlainTextParser.ALLOWED_BULLETS.join("|"); // Concatenate possible bullets with |
PlainTextParser.PARSED_SEPARATOR_REGEX = PlainTextParser.ALLOWED_SEPARATORS.join("|"); // Concatenate possible bullets with |
PlainTextParser.BULLET_SEPARATOR_REGEX = new RegExp("(?<=^\\s*)"
    + "(?<bullet>" + PlainTextParser.PARSED_BULLET_REGEX + ")"
    + "\\s+"
    + "(?<front>(?:(?!( = | - )).)*)"
    + "\\s+"
    + "(?<separator>" + PlainTextParser.PARSED_SEPARATOR_REGEX + ")"
    + "\\s+"
    + "(?<back>.*)");
function main() {
}
main();
