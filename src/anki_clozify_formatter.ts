/**
 * An enum representing the state of text of the current character
 */

export enum STATE {
    TEXT,
    INLINE_LATEX,
    MULTI_LINE_LATEX,
    INLINE_CODE,
    MULTI_LINE_CODE
}

export function parseTextLine(lineLeft: string, clozeNumber: number): { result: string, clozeNumber: number, state: STATE } {
    // Line cannot contain newline
    if (/\n/.test(lineLeft)) {
        throw new Error("Line cannot contain \\n")
    }

    // Cloze number cannot be less than 1
    if (clozeNumber < 1) {
        throw new Error("Cloze number cannot be less than 1")
    }

    // Parsing: Remove indents:
    // - one - two => - {{c1::::one }} - {{c1::two }}
    // - one - two => - {{c1::::one }} = {{c1::two }}
    // 1. one - two => 1. {{c1::::one }} - {{c1::two }}
    // 1. one - two => 1. {{c1::::one }} = {{c1::two }}
    const ALLOWED_BULLETS = ["\\d*\\.", "-"];
    const ALLOWED_SEPARATORS = ["-", "="]; 
    const PARSED_BULLET_REGEX = ALLOWED_BULLETS.join("|"); // Concatenate possible bullets with |
    const PARSED_SEPARATOR_REGEX = ALLOWED_SEPARATORS.join("|"); // Concatenate possible bullets with |
    // const plainText_regex = /(?<=^\s*)(?<bullet>\d*\.|-)\s+(?<front>(?:(?!( = | - )).)*)\s+(?<separator>-|=)\s+(?<back>.*)/
    const BULLET_SEPARATOR_REGEX = new RegExp("(?<=^\\s*)(?<bullet>"
        + PARSED_BULLET_REGEX
        + ")\\s+(?<front>(?:(?!( = | - )).)*)\\s+(?<separator>"
        + PARSED_SEPARATOR_REGEX
        + ")\\s+(?<back>.*)")

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

function main() {
    console.log(parseTextLine("- asdf-sd", 1));
}

main();

// module.exports = parseTextLine