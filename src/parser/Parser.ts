export interface LineParser {
    parseLine(line: string, clozeNumber: number): ParseOutput;
}

export enum STATE {
    TEXT,
    INLINE_LATEX,
    INLINE_CODE,
    MULTI_LINE_LATEX,
    MULTI_LINE_CODE
}

export interface ParseOutput {
    result: string,
    clozeNumber: number,
    state: STATE,
    codeStatus: CODE_STATUS;
}

export class CODE_STATUS {
    language: CODE_LANGUAGE;
    prevLineIsComment: boolean;

    public static notCode() {
        return new CODE_STATUS(CODE_LANGUAGE.NONE);
    }

    public constructor(language: CODE_LANGUAGE, prevLineIsComment: boolean = false) {
        this.language = language;
        this.prevLineIsComment = prevLineIsComment;
    }

    getCommentHeaderRegex(): string[] {
        switch (this.language) {
            case CODE_LANGUAGE.NONE:
            default:
                return ["#", "//"]
            case CODE_LANGUAGE.PYTHON:
                return ["#"]
            case CODE_LANGUAGE.CPP:
                return ["//"]
            case CODE_LANGUAGE.JAVA:
                return ["//"]
            case CODE_LANGUAGE.SQL:
                return ["--"];
            case CODE_LANGUAGE.PLSQL:
                return ["--"];
        }
    }

    static getLanguageFromAlias(alias: string): CODE_LANGUAGE {
        switch (alias) {
            case 'sql':
                return CODE_LANGUAGE.SQL;
            case 'plsql':
                return CODE_LANGUAGE.PLSQL;
            case 'python':
                return CODE_LANGUAGE.PYTHON;
            case 'cpp':
                return CODE_LANGUAGE.CPP;
            case 'java':
                return CODE_LANGUAGE.JAVA;
            default:
                return CODE_LANGUAGE.NONE;
        }
    }
}

/**
 * Enumeration representing programming languages
 * of a multi-line code block.
 */
enum CODE_LANGUAGE {
    NONE,
    PYTHON,
    CPP,
    JAVA,
    SQL,
    PLSQL
}

