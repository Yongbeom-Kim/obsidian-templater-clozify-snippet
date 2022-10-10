import { CODE_STATUS, ParseOutput, STATE } from "./Parser";

export function parseMultiLineCode(
    line: string,
    nextLine: string,
    clozeNumber: number,
    codeStatus: CODE_STATUS
): ParseOutput {

    function lineIsComment(): boolean {
        return (new RegExp("^\s*(" + codeStatus.getCommentHeaderRegex().join("|") + ")")).test(line);
    }

    if (line.startsWith("```")) {
        return {
            result: "",
            clozeNumber,
            state: STATE.TEXT,
            codeStatus: CODE_STATUS.notCode()
        };
    }

    // Check if line is comment
    if (lineIsComment()) {
        codeStatus.prevLineIsComment = true;

        return {
            result: line,
            clozeNumber,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }

    // If prev line is comment and this is empty, just continue
    if (codeStatus.prevLineIsComment && line.trim().length === 0) {
        codeStatus.prevLineIsComment = false;

        return {
            result: line,
            clozeNumber,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }

    // If prev line is comment and this is empty, just continue
    if (codeStatus.prevLineIsComment && line.trim().length === 0) {
        codeStatus.prevLineIsComment = false;

        return {
            result: line,
            clozeNumber,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }

    // If prev line is comment, then make this a cloze
    if (codeStatus.prevLineIsComment) {
        codeStatus.prevLineIsComment = false;

        return {
            result: line,
            clozeNumber,
            state: STATE.MULTI_LINE_CODE,
            codeStatus
        };
    }
}