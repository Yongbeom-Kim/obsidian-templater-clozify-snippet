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

test("- <a> = <b> becomes - c1::::{{<a>}} = c1::{{<b>}} ", () => {
    expect(parseTextLine("- hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    - hello world = hello", 1)).toEqual({
        result: '- c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    })

    expect(parseTextLine("- asd=sd", 1)).toEqual(
        { result: '- asd=sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("      - asdf=sd", 1)).toEqual(
        { result: '      - asdf=sd', clozeNumber: 1, state: 0 }
    );
});

test("1. <a> - <b> becomes 1. c1::::{{<a>}} - c1::{{<b>}} ", () => {
    expect(parseTextLine("1. hello world - hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });
    
    expect(parseTextLine("102. hello world - hello", 1)).toEqual({
        result: '102. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    1. hello world - hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    });

    expect(parseTextLine("    124. hello world - hello", 1)).toEqual({
        result: '124. c1::::{{hello world}} - c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    });

    expect(parseTextLine("1. asd-sd", 1)).toEqual(
        { result: '1. asd-sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("152. asd-sd", 1)).toEqual(
        { result: '152. asd-sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("      1. asdf-sd", 1)).toEqual(
        { result: '      1. asdf-sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("      194. asdf-sd", 1)).toEqual(
        { result: '      194. asdf-sd', clozeNumber: 1, state: 0 }
    );
});

test("1. <a> = <b> becomes 1. c1::::{{<a>}} = c1::{{<b>}} ", () => {
    expect(parseTextLine("1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });
    
    expect(parseTextLine("102. hello world = hello", 1)).toEqual({
        result: '102. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: STATE.TEXT
    });

    expect(parseTextLine("    1. hello world = hello", 1)).toEqual({
        result: '1. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    });

    expect(parseTextLine("    124. hello world = hello", 1)).toEqual({
        result: '124. c1::::{{hello world}} = c1::{{hello}}',
        clozeNumber: 2,
        state: 0
    });

    expect(parseTextLine("1. asd-sd", 1)).toEqual(
        { result: '1. asd-sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("152. asd-sd", 1)).toEqual(
        { result: '152. asd-sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("      1. asdf-sd", 1)).toEqual(
        { result: '      1. asdf-sd', clozeNumber: 1, state: 0 }
    );

    expect(parseTextLine("      194. asdf-sd", 1)).toEqual(
        { result: '      194. asdf-sd', clozeNumber: 1, state: 0 }
    );
});
