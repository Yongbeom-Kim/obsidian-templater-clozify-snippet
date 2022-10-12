import { addBackTicks } from "../util/str_utils";
import { CODE_STATUS, ParseOutput, STATE } from "./Parser";


export function parseMultiLineCode(
    line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {

    // Replace all tabs with double spaces
    line = line.replaceAll("\t", "  ");

    if (line.startsWith("```")) {
        return endMultilineCode(line, nextLine, clozeNumber, codeStatus);
    }
    if (isComment(line, codeStatus)) {
        return parseCodeComment(line, nextLine, clozeNumber, codeStatus);
    }
    if (isEmpty(line)) {
        return parseEmptyLine(line, nextLine, clozeNumber, codeStatus);
    }
    if (codeStatus.nextLineIsCloze) {
        return parseClozifyCode(line, nextLine, clozeNumber, codeStatus);
    }

    return parseNonClozifyCode(line, nextLine, clozeNumber, codeStatus);

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

    // console.log({codeStatus})
    return {
        result: addBackTicks(line),
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
    // @ts-ignore note that line.match can't be null cause checked already
    const indent = /^\s*/.test(line) ? line.match(/^\s*/)[0] : "";
    const lineWithoutIndent = line.trimStart();

    // If next line is a comment or empty, 
    // then end increment cloze
    if ((isComment(nextLine, codeStatus) || isEmpty(nextLine))) {
        codeStatus.nextLineIsCloze = false;

        return {
            result: addBackTicks(`${indent}c${clozeNumber}::{{ ${lineWithoutIndent} }}`),
            clozeNumber: clozeNumber + 1,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }

    // If next line is an actual line, then make it anki
    else {
        codeStatus.nextLineIsCloze = true;
        return {
            result: addBackTicks(`${indent}c${clozeNumber}::{{ ${lineWithoutIndent} }}`),
            clozeNumber: clozeNumber,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }
}

/**
 * Parse a line of code, when it is not clozified
 */
function parseNonClozifyCode(line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {
    return {
        result: addBackTicks(line),
        clozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus
    }
}


/*
    UTILS
*/


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