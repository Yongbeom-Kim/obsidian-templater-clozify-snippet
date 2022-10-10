import { ParseOutput, STATE } from "./Parser";
import { parseLine as parseTextLine } from "./TextParser";
import { getSubStringAfter } from "../util/utils"
export function parseLine(line: string, clozeNumber: number): ParseOutput {
    // Means there is an end of the latex equation here
    if ((line).match(/\$\$/)) {
        // Parse rest of line with text
        // Note that getSubStringAfter cannot be null here
        const afterParsed = parseTextLine(getSubStringAfter(line, /\$\$/), clozeNumber);
        
        return {
            result: line + afterParsed.result,
            clozeNumber: afterParsed.clozeNumber,
            state: afterParsed.clozeNumber
        }
    }
    return {
        result: line + "\n",
        clozeNumber: clozeNumber,
        state: STATE.MULTI_LINE_LATEX
    }
}