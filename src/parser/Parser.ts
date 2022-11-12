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
    nextLineIsCloze: boolean;

    public static notCode() {
        return new CODE_STATUS(CODE_LANGUAGE.NONE);
    }

    public constructor(language: CODE_LANGUAGE, prevLineIsComment: boolean = false) {
        this.language = language;
        this.nextLineIsCloze = prevLineIsComment;
    }

    getCommentHeaders(): string[] {
        switch (this.language) {
            case CODE_LANGUAGE.NONE:
            default:
                return ["#", "//"]
            case CODE_LANGUAGE.PYTHON:
            case CODE_LANGUAGE.SHELL:
            case CODE_LANGUAGE.DOCKERFILE:
            case CODE_LANGUAGE.TOML:
                return ["#"]
            case CODE_LANGUAGE.CPP:
            case CODE_LANGUAGE.JAVA:
            case CODE_LANGUAGE.JAVASCRIPT:
            case CODE_LANGUAGE.RUST:
                return ["//"]
            case CODE_LANGUAGE.SQL:
            case CODE_LANGUAGE.PLSQL:
                return ["--"];
            case CODE_LANGUAGE.CSS:
                return ["/*"];
        }
    }

    static getLanguageFromAlias(alias: string): CODE_LANGUAGE {
        switch (alias.toLowerCase()) {
            case 'sql':
                return CODE_LANGUAGE.SQL;
            case 'plsql':
                return CODE_LANGUAGE.PLSQL;
            case 'python':
                return CODE_LANGUAGE.PYTHON;
            case 'cpp':
            case 'c++':
                return CODE_LANGUAGE.CPP;
            case 'java':
                return CODE_LANGUAGE.JAVA;
            case 'js':
            case 'jsx':
                return CODE_LANGUAGE.JAVASCRIPT;
            case '':
                return CODE_LANGUAGE.NONE;
            case 'shell':
            case 'sh':
                return CODE_LANGUAGE.SHELL;
            case 'css':
                return CODE_LANGUAGE.CSS;
            case 'dockerfile':
                return CODE_LANGUAGE.DOCKERFILE;
            case 'rust':
                return CODE_LANGUAGE.RUST;
            case 'toml':
                return CODE_LANGUAGE.TOML;
            default:
                throw new Error("Unknown language: " + alias);
        }
    }
}

/**
 * Enumeration representing programming languages
 * of a multi-line code block.
 */

export enum CODE_LANGUAGE {
    NONE,
    PYTHON,
    CPP,
    JAVA,
    SQL,
    PLSQL,
    JAVASCRIPT,
    SHELL,
    CSS,
    DOCKERFILE,
    RUST,
    TOML
}

