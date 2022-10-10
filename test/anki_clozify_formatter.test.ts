import {parseLine as parseTextLine} from "../src/parser/TextParser";
import { STATE } from "../src/parser/Parser";

test("- <a> - <b> becomes - c1::::{{<a>}} - c1::{{<b>}} ", () => {
    expect(parseTextLine("- hello world - hello", 1)).toEqual({
        result: '- c1::::{{hello world}} - c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    - hello world - hello", 1)).toEqual({
        result: '- c1::::{{hello world}} - c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    })

    expect(parseTextLine("- asdf-sd", 1)).toEqual(
        { result: '- asdf-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("      - asdf-sd", 1)).toEqual(
        { result: '      - asdf-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );
});

test("- <a> = <b> becomes - c1::::{{<a>}} = c1::{{<b>}} ", () => {
    expect(parseTextLine("- hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    - hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    })

    expect(parseTextLine("- asd=sd", 1)).toEqual(
        { result: '- asd=sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("      - asdf=sd", 1)).toEqual(
        { result: '      - asdf=sd\n', clozeNumber: 1, state: STATE.TEXT }
    );
});

test("1. <a> - <b> becomes 1. c1::::{{<a>}} - c1::{{<b>}} ", () => {
    expect(parseTextLine("1. hello world - hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} - c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });
    
    expect(parseTextLine("102. hello world - hello", 1)).toEqual({
        result: '102. c1::::{{hello world}} - c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    1. hello world - hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} - c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    124. hello world - hello", 1)).toEqual({
        result: '124. c1::::{{hello world}} - c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("1. asd-sd", 1)).toEqual(
        { result: '1. asd-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("152. asd-sd", 1)).toEqual(
        { result: '152. asd-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("      1. asdf-sd", 1)).toEqual(
        { result: '      1. asdf-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("      194. asdf-sd", 1)).toEqual(
        { result: '      194. asdf-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );
});

test("1. <a> = <b> becomes 1. c1::::{{<a>}} = c1::{{<b>}} ", () => {
    expect(parseTextLine("1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });
    
    expect(parseTextLine("102. hello world = hello", 1)).toEqual({
        result: '102. c1::::{{hello world}} = c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    124. hello world = hello", 1)).toEqual({
        result: '124. c1::::{{hello world}} = c1::{{hello}}\n',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("1. asd-sd", 1)).toEqual(
        { result: '1. asd-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("152. asd-sd", 1)).toEqual(
        { result: '152. asd-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("      1. asdf-sd", 1)).toEqual(
        { result: '      1. asdf-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(parseTextLine("      194. asdf-sd", 1)).toEqual(
        { result: '      194. asdf-sd\n', clozeNumber: 1, state: STATE.TEXT }
    );
});
