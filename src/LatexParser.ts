import { ParseOutput, STATE } from "./Parser";
import { parseLine as parseTextLine } from "./TextParser";
export function parseLine(line: string, clozeNumber: number): ParseOutput {
    // Means there is an end of the latex equation here
    if ((line).match(/\$\$/)) {
        // Parse rest of line with text
        // We can use !. here cause we tested for match already
        const lineAfterLatex: string = line.substring(/\$\$/.exec(line)!.index + 2);
        const afterParsed = parseTextLine(lineAfterLatex, clozeNumber);
        
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