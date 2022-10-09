"use strict";
/**
 * An enum representing the state of text of the current character
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTextLine = exports.STATE = void 0;
var STATE;
(function (STATE) {
    STATE[STATE["TEXT"] = 0] = "TEXT";
    STATE[STATE["INLINE_LATEX"] = 1] = "INLINE_LATEX";
    STATE[STATE["MULTI_LINE_LATEX"] = 2] = "MULTI_LINE_LATEX";
    STATE[STATE["INLINE_CODE"] = 3] = "INLINE_CODE";
    STATE[STATE["MULTI_LINE_CODE"] = 4] = "MULTI_LINE_CODE";
})(STATE = exports.STATE || (exports.STATE = {}));
function parseTextLine(lineLeft, clozeNumber) {
    // Line cannot contain newline
    if (/\n/.test(lineLeft)) {
        throw new Error("Line cannot contain \\n");
    }
    // Cloze number cannot be less than 1
    if (clozeNumber < 1) {
        throw new Error("Cloze number cannot be less than 1");
    }
    // Parsing: Remove indents:
    // - one - two => - {{c1::::one }} - {{c1::two }}
    // - one - two => - {{c1::::one }} = {{c1::two }}
    // 1. one - two => 1. {{c1::::one }} - {{c1::two }}
    // 1. one - two => 1. {{c1::::one }} = {{c1::two }}
    const ALLOWED_BULLETS = ["\\d*\\.", "-"];
    const ALLOWED_SEPARATORS = ["-", "="];
    const PARSED_BULLET_REGEX = ALLOWED_BULLETS.reduce((a, b) => a + "|" + b, "").substring(1); // Concatenate possible bullets with |
    const PARSED_SEPARATOR_REGEX = ALLOWED_SEPARATORS.reduce((a, b) => a + "|" + b, "").substring(1); // Concatenate possible bullets with |
    // const plainText_regex = /(?<=^\s*)(?<bullet>\d*\.|-)\s+(?<front>(?:(?!( = | - )).)*)\s+(?<separator>-|=)\s+(?<back>.*)/
    const BULLET_SEPARATOR_REGEX = new RegExp("(?<=^\\s*)(?<bullet>"
        + PARSED_BULLET_REGEX
        + ")\\s+(?<front>(?:(?!( = | - )).)*)\\s+(?<separator>"
        + PARSED_SEPARATOR_REGEX
        + ")\\s+(?<back>.*)");
    const matchedGroups = lineLeft.match(BULLET_SEPARATOR_REGEX)?.groups ?? null;
    if (matchedGroups === null) {
        return {
            result: lineLeft,
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
exports.parseTextLine = parseTextLine;
function main() {
    console.log(parseTextLine("- asdf-sd", 1));
}
main();
// module.exports = parseTextLine
