import { parseTextLine, STATE } from "../anki_clozify_formatter";

test("- <a> - <b> becomes - c1::::{{<a>}} - c1::{{<b>}} ", () => {
    expect(parseTextLine("- hello world - hello", 1)).toEqual({
        result: '- c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    - hello world - hello", 1)).toEqual({
        result: '- c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    })

    expect(parseTextLine("- asdf-sd", 1)).toEqual(
        { result: '- asdf-sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("      - asdf-sd", 1)).toEqual(
        { result: '      - asdf-sd', clozeNumber: 1, state: 0 }
    );
});

test("indented 1. a - b", () => {
    expect(parseTextLine("    1. hello world - hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    })
});
test("", () => {
    expect(parseTextLine("- hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    })
});
test("", () => {
    expect(parseTextLine("    - hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    })
});
test("", () => {
    expect(parseTextLine("1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    })
});
test("", () => {
    expect(parseTextLine("    1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    })
});
