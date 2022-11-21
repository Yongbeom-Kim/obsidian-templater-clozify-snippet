import { correctDoubleColon, partition } from "./util/str_utils";
import { parseMultiLineCode } from "./parser/CodeParser";
import { CODE_STATUS, ParseOutput, STATE } from "./parser/Parser";
import { parseText as parseTextLine } from "./parser/TextParser";

function parse(text: string, preCloze: boolean = true): string {
    let clozeNumber = 1;
    let currentState: STATE = STATE.TEXT;
    let codeStatus = CODE_STATUS.notCode();
    let nextLine;
    let resultLines = []

    while (text.length > 0) {
        // Get next line 
        // TODO: Null safety here
        ({ left: nextLine, right: text } = partition(text, "\n"));
        
        nextLine = correctDoubleColon(nextLine);
        
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

// I need this export statment for this to be treated as an ECMAScript module
export const parseWithoutPreCloze = (text: string) => parse(text, false);

const export_fn = (text: string, preCloze: boolean) => parse(text, preCloze);
module.exports = export_fn;

