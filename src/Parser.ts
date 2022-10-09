export interface LineParser {
    parseLine(line: string, clozeNumber: number): ParseOutput;
}


export enum STATE {
    TEXT,
    INLINE_LATEX,
    MULTI_LINE_LATEX,
    INLINE_CODE,
    MULTI_LINE_CODE
}

export interface ParseOutput {
    result: string,
    clozeNumber: number,
    state: STATE
}