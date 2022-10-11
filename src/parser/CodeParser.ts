import { CODE_STATUS, ParseOutput, STATE } from "./Parser";

function parseMultiLineCodeComment(line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {
    codeStatus.nextLineIsCloze = true;
        
    // console.log({codeStatus})
    return {
        result: line,
        clozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus
    };
}

export function parseMultiLineCode(
    line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {

    if (line.startsWith("```")) {
        codeStatus.nextLineIsCloze = false;
        return {
            result: line,
            clozeNumber,
            state: STATE.TEXT,
            codeStatus: CODE_STATUS.notCode()
        };
    }

    console.log({line, isComment: isComment(line, codeStatus), empty: isEmpty(line)});
    // Check if line is comment
    if (isComment(line, codeStatus)) {
        return parseMultiLineCodeComment(line, nextLine, clozeNumber, codeStatus);
    }

    // If prev line is comment and this is empty, just continue
    if (codeStatus.nextLineIsCloze && isEmpty(line)) {
        codeStatus.nextLineIsCloze = false;

        return {
            result: line,
            clozeNumber,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }

    // If prev line is comment and this is empty, just continue
    if (codeStatus.nextLineIsCloze && isEmpty(line)) {
        codeStatus.nextLineIsCloze = false;

        return {
            result: line,
            clozeNumber,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }

    // If prev line is comment and this is not comment or not empty
    // , then make this a cloze
    if (codeStatus.nextLineIsCloze) {
        codeStatus.nextLineIsCloze = false;

        // @ts-ignore note that line.match can't be null cause checked already
        const indent = /^\s*/.test(line) ? line.match(/^\s*/)[0] : "";
        const lineWithoutIndent = line.trimStart();

        // If next line is a comment or empty, 
        // then end increment cloze
        console.log({nextLine, isComment: isComment(nextLine, codeStatus), isEmpty: isEmpty(nextLine)});
        if ((isComment(nextLine, codeStatus) || isEmpty(nextLine))) {
            codeStatus.nextLineIsCloze = false;
            
            return {
                result: `${indent}c${clozeNumber}::{{ ${lineWithoutIndent} }}`,
                clozeNumber: clozeNumber + 1,
                state: STATE.MULTI_LINE_CODE,
                codeStatus
            };
        }

        // If next line is an actual line, then make it anki
        else {
            codeStatus.nextLineIsCloze = true;
            return {
                result: `${indent}c${clozeNumber}::{{ ${lineWithoutIndent} }}`,
                clozeNumber: clozeNumber,
                state: STATE.MULTI_LINE_CODE,
                codeStatus
            };
        }
    }

    return {
        result: line,
        clozeNumber,
        state: STATE.MULTI_LINE_CODE,
        codeStatus
    };

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