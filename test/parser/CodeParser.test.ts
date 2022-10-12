import { parseMultiLineCode } from "../../src/parser/CodeParser"
import { CODE_STATUS, CODE_LANGUAGE, STATE } from "../../src/parser/Parser"
describe("exit code", () => {
    it("triple quotes exit code", () => {
        expect(parseMultiLineCode("```", "", 2, new CODE_STATUS(CODE_LANGUAGE.NONE)).state).toBe(STATE.TEXT);
    })


})

describe("make code anki", () => {
    it("no indent", () => {
        expect(parseMultiLineCode("abcd", "", 1, new CODE_STATUS(CODE_LANGUAGE.NONE, true)))
            .toEqual({
                result: 'c1::{{ abcd }}',
                clozeNumber: 2,
                state: 4,
                codeStatus: new CODE_STATUS(CODE_LANGUAGE.NONE, false)
            })
    })

    it("indent", () => {
        expect(parseMultiLineCode("    abcd", "", 1, new CODE_STATUS(CODE_LANGUAGE.NONE, true)))
            .toEqual({
                result: '    c1::{{ abcd }}',
                clozeNumber: 2,
                state: 4,
                codeStatus: new CODE_STATUS(CODE_LANGUAGE.NONE, false)
            })
    })
})

describe("process comments", () => {
    it("javascript comment", () => {
        expect(parseMultiLineCode("// abcd", "", 1, new CODE_STATUS(CODE_LANGUAGE.JAVASCRIPT, false)))
            .toEqual({
                result: '// abcd',
                clozeNumber: 1,
                state: 4,
                codeStatus: new CODE_STATUS(CODE_LANGUAGE.JAVASCRIPT, true)
            })
    })
})