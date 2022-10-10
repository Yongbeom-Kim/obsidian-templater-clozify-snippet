import { ParseOutput, STATE } from "./Parser";
import { parseLine as parseTextLine } from "./TextParser";

export default function parse(text: string): string {
    let clozeNumber = 1;
    let currentState: STATE = STATE.TEXT;

    let resultLines = []

    while (text.length > 0) {
        // Get next line
        // TODO: Null safety here
        const nextLine: string = text.slice(0, (/$/m).exec(text)!.index).trim();
        text = text.slice((/$/m).exec(text)!.index).trim();

        let parsedObject;
        if (currentState === STATE.TEXT) {
            parsedObject = parseTextLine(nextLine, clozeNumber);
        } else if (currentState === STATE.MULTI_LINE_CODE) {
            // TODO: parse multi line code
            parsedObject = parseTextLine(nextLine, clozeNumber);
        } else if (currentState === STATE.MULTI_LINE_LATEX) {
            // TODO: parse multi line latex
            parsedObject = parseTextLine(nextLine, clozeNumber);
        } else {
            throw new Error("Invalid State: " + currentState);
        }

        resultLines.push(parsedObject.result);
        ({clozeNumber, state: currentState} = parsedObject);
    }

    return resultLines.join("");
}

module.exports = parse;