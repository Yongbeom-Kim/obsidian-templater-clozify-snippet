import { addBackTicks, makeCloze, processCodeCharacters } from "../util/str_utils";
import { CODE_STATUS, ParseOutput, STATE } from "./Parser";


export function parseMultiLineCode(
    line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {

    let returnObject;

    if (isTripleBacktick(line)) {
        returnObject = endMultilineCode(line, nextLine, clozeNumber, codeStatus);
    } else if (isComment(line, codeStatus)) {
        returnObject = parseCodeComment(line, nextLine, clozeNumber, codeStatus);
    } else if (isEmpty(line)) {
        returnObject = parseEmptyLine(line, nextLine, clozeNumber, codeStatus);
    } else if (codeStatus.nextLineIsCloze) {
        returnObject = parseClozifyCode(line, nextLine, clozeNumber, codeStatus);
    } else {
        returnObject = parseNonClozifyCode(line, nextLine, clozeNumber, codeStatus);
    }

    returnObject.result = processCodeCharacters(returnObject.result);
    return returnObject;
}

/**
 * Parse the end of a multi-line code block (```)
 */
function endMultilineCode(
    line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
) {
    codeStatus.nextLineIsCloze = false;

    return {
        result: "",
        clozeNumber,
        state: STATE.TEXT,
        codeStatus: CODE_STATUS.notCode()
    };
}
/**
 * Parse a code comment
 */
function parseCodeComment(line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {
    codeStatus.nextLineIsCloze = true;

    return {
        result: addBackTicks(processIndent(partitionByIndent(line).indent) + partitionByIndent(line).line),
        clozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus
    };
}

/**
 *  Parse an empty line
 */
function parseEmptyLine(line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {
    codeStatus.nextLineIsCloze = false;

    return {
        result: addBackTicks(line),
        clozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus
    };
}

/**
 * Parse a line of code, when it is meant to be clozified.
 */
function parseClozifyCode(line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {

    const {indent, line: lineWithoutIndent} = partitionByIndent(line);
    let nextClozeNumber = clozeNumber;

    // If next line is a comment or empty, 
    // then end increment cloze
    if ((isComment(nextLine, codeStatus) || isEmpty(nextLine) || isTripleBacktick(nextLine))) {
        codeStatus.nextLineIsCloze = false;
        nextClozeNumber ++;
    }
    // If next line is an actual line, then make it anki
    else {
        codeStatus.nextLineIsCloze = true;
    }

    return {
        result: addBackTicks(processIndent(indent) + makeCloze(lineWithoutIndent, clozeNumber)),
        clozeNumber: nextClozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus
    };
}

/**
 * Parse a line of code, when it is not clozified
 */
function parseNonClozifyCode(line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {
    const {indent, line: lineWithoutIndent} = partitionByIndent(line);
    return {
        result: addBackTicks(processIndent(indent) + lineWithoutIndent),
        clozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus
    }
}


/*
    UTILS
*/

function processIndent(indent: string): string {
    return indent.replaceAll(" ", " ‍")
                .replaceAll("\t", " ‍ ‍")
}
/**
 * Partition a line of code into indent and the part after indent.
 * @param line line to parse
 * @returns a {indent: string, line: string} object.
 */
function partitionByIndent(line: string): {indent: string, line: string} {
    // Also, the ?? "" helps to eliminate the possibility of undefined in the ts compiler.
    // @ts-ignore note that line.match can't be null cause checked already
    const indent = (/^\s*/.test(line) ? line.match(/^\s*/)[0] : "") ?? "";
    const lineWithoutIndent = line.trimStart();

    return {indent: indent, line: lineWithoutIndent};
}

function isComment(line: string, codeStatus: CODE_STATUS): boolean {
    let isComment = false;
    codeStatus.getCommentHeaders().forEach(header => {
        if (line.trimStart().startsWith(header)) {
            isComment = true;
        }
    });

    return isComment;
}

function isEmpty(line: string): boolean {
    return line.trim().length === 0;
}

function isTripleBacktick(line: string): boolean {
    return line.startsWith("```");   
}