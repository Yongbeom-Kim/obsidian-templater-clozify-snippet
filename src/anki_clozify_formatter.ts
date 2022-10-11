import { partition } from "./util/str_utils";
import { parseMultiLineCode } from "./parser/CodeParser";
import { CODE_STATUS, STATE } from "./parser/Parser";
import { parseText as parseTextLine } from "./parser/TextParser";

export default function parse(text: string): string {
    let clozeNumber = 1;
    let currentState: STATE = STATE.TEXT;
    let codeStatus = CODE_STATUS.notCode();
    let nextLine;
    let resultLines = []

    while (text.length > 0) {
        // Get next line
        // TODO: Null safety here
        ({ left: nextLine, right: text } = partition(text, "\n"));
        
        let parsedObject;
        if (currentState === STATE.TEXT) {
            parsedObject = parseTextLine(nextLine, clozeNumber);
        } else if (currentState === STATE.MULTI_LINE_CODE) {
            // TODO: parse multi line code
            parsedObject = parseMultiLineCode(nextLine, partition(nextLine, "\n").left, clozeNumber, codeStatus);
        } else if (currentState === STATE.MULTI_LINE_LATEX) {
            // TODO: parse multi line latex
            parsedObject = parseTextLine(nextLine, clozeNumber);
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

module.exports = parse;

// console.log(parse(`- one = four`))
// console.log(parse(`- one $$two - three$$ = four`))
// console.log(parse(`- one $$two - three$$ asdf $$four - four$$ - five`))
// console.log(parse(`- one $$two - three$$ asdf $$four - four$$ = five`))
