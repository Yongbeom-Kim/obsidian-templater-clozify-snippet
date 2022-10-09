"use strict";
/**
 * An enum representing the state of text of the current character
 */
var textState;
(function (textState) {
    textState[textState["text"] = 0] = "text";
    textState[textState["inlineLatex"] = 1] = "inlineLatex";
    textState[textState["multilineLatex"] = 2] = "multilineLatex";
    textState[textState["inlineCode"] = 3] = "inlineCode";
    textState[textState["multiLineCode"] = 4] = "multiLineCode";
})(textState || (textState = {}));
// function parse(text: string): string {
// }
function parsePlainTextLine(lineLeft) {
    // Line cannot contain newline
    if (/\n/.test(lineLeft)) {
        throw new Error("Line cannot contain \\n");
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
    // console.log(BULLET_SEPARATOR_REGEX.test(lineLeft));
    return "";
}
function main() {
    parsePlainTextLine("- hello world - hello");
    parsePlainTextLine("    - hello world - hello");
    parsePlainTextLine("1. hello world - hello");
    parsePlainTextLine("    1. hello world - hello");
    parsePlainTextLine("- hello world = hello");
    parsePlainTextLine("    - hello world = hello");
    parsePlainTextLine("1. hello world = hello");
    parsePlainTextLine("    1. hello world = hello");
}
main();
