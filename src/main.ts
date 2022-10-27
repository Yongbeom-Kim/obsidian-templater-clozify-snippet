import { partition } from "./util/str_utils";
import { parseMultiLineCode } from "./util/parser/CodeParser";
import { CODE_STATUS, ParseOutput, STATE } from "./util/parser/Parser";
import { parseText as parseTextLine } from "./util/parser/TextParser";

function parse(text: string, preCloze: boolean): string {
    let clozeNumber = 1;
    let currentState: STATE = STATE.TEXT;
    let codeStatus = CODE_STATUS.notCode();
    let nextLine;
    let resultLines = []

    while (text.length > 0) {
        // Get next line 
        // TODO: Null safety here
        ({ left: nextLine, right: text } = partition(text, "\n"));
        
        let parsedObject: ParseOutput;
        if (currentState === STATE.TEXT) {
            parsedObject = parseTextLine(nextLine, clozeNumber, preCloze);
        } else if (currentState === STATE.MULTI_LINE_CODE) {
            // TODO: parse multi line code
            parsedObject = parseMultiLineCode(nextLine, partition(text, "\n").left, clozeNumber, codeStatus);
        } else if (currentState === STATE.MULTI_LINE_LATEX) {
            // TODO: parse multi line latex
            parsedObject = parseTextLine(nextLine, clozeNumber, preCloze);
        } else {
            throw new Error("Invalid State: " + currentState);
        }
        
        // console.log({nextLine, textLeft:text});
        // console.log(parsedObject);
        resultLines.push(parsedObject.result);
        ({clozeNumber, state: currentState, codeStatus} = parsedObject);
    }

    return resultLines.join("\n");
}

export const parseWithoutPreCloze = (text: string) => parse(text, false);
const parseWithPreCloze = (text: string) => parse(text, true);

module.exports = parseWithPreCloze;
