import PlainTextParser from "../TextParser";
import { STATE } from "../Parser";

test("- <a> - <b> becomes - c1::::{{<a>}} - c1::{{<b>}} ", () => {
    expect(PlainTextParser.get().parseLine("- hello world - hello", 1)).toEqual({
        result: '- c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("    - hello world - hello", 1)).toEqual({
        result: '- c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    })

    expect(PlainTextParser.get().parseLine("- asdf-sd", 1)).toEqual(
        { result: '- asdf-sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("      - asdf-sd", 1)).toEqual(
        { result: '      - asdf-sd', clozeNumber: 1, state: STATE.TEXT }
    );
});

test("- <a> = <b> becomes - c1::::{{<a>}} = c1::{{<b>}} ", () => {
    expect(PlainTextParser.get().parseLine("- hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("    - hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    })

    expect(PlainTextParser.get().parseLine("- asd=sd", 1)).toEqual(
        { result: '- asd=sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("      - asdf=sd", 1)).toEqual(
        { result: '      - asdf=sd', clozeNumber: 1, state: STATE.TEXT }
    );
});

test("1. <a> - <b> becomes 1. c1::::{{<a>}} - c1::{{<b>}} ", () => {
    expect(PlainTextParser.get().parseLine("1. hello world - hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });
    
    expect(PlainTextParser.get().parseLine("102. hello world - hello", 1)).toEqual({
        result: '102. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("    1. hello world - hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("    124. hello world - hello", 1)).toEqual({
        result: '124. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("1. asd-sd", 1)).toEqual(
        { result: '1. asd-sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("152. asd-sd", 1)).toEqual(
        { result: '152. asd-sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("      1. asdf-sd", 1)).toEqual(
        { result: '      1. asdf-sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("      194. asdf-sd", 1)).toEqual(
        { result: '      194. asdf-sd', clozeNumber: 1, state: STATE.TEXT }
    );
});

test("1. <a> = <b> becomes 1. c1::::{{<a>}} = c1::{{<b>}} ", () => {
    expect(PlainTextParser.get().parseLine("1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });
    
    expect(PlainTextParser.get().parseLine("102. hello world = hello", 1)).toEqual({
        result: '102. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("    1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("    124. hello world = hello", 1)).toEqual({
        result: '124. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(PlainTextParser.get().parseLine("1. asd-sd", 1)).toEqual(
        { result: '1. asd-sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("152. asd-sd", 1)).toEqual(
        { result: '152. asd-sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("      1. asdf-sd", 1)).toEqual(
        { result: '      1. asdf-sd', clozeNumber: 1, state: STATE.TEXT }
    );

    expect(PlainTextParser.get().parseLine("      194. asdf-sd", 1)).toEqual(
        { result: '      194. asdf-sd', clozeNumber: 1, state: STATE.TEXT }
    );
});
