import {parseText as parseTextLine} from "../../src/parser/TextParser";
import { STATE } from "../../src/parser/Parser";

// Note that test cases erase whitespace cause whitespaces are not important.

describe("parse text: bullet with dash delimiter", () => {

    test("no indent", () => {
        expect(parseTextLine("- one - two", 1).result.replace(/\s/g, "")).toEqual("-c1::::{{one}}-c1::{{two}}");
    });

    test("indented", () => {
        expect(parseTextLine("  - one - two", 1).result.replace(/\s/g, "")).toEqual("-c1::::{{one}}-c1::{{two}}");
    });

    test("delimiter no space", () => {
        expect(parseTextLine("- one -two", 1).result.replace(/\s/g, "")).toEqual("-one-two");
        expect(parseTextLine("- one- two", 1).result.replace(/\s/g, "")).toEqual("-one-two");
        expect(parseTextLine("- one-two", 1).result.replace(/\s/g, "")).toEqual("-one-two");
    })
});

describe("parse text: numbered bullet with dash delimiter", () => {

    test("no indent", () => {

        expect(parseTextLine("1. one - two", 1).result.replace(/\s/g, "")).toEqual("1.c1::::{{one}}-c1::{{two}}");
        expect(parseTextLine("125. one - two", 1).result.replace(/\s/g, "")).toEqual("125.c1::::{{one}}-c1::{{two}}");
    });

    test("indented", () => {

        expect(parseTextLine("  1. one - two", 1).result.replace(/\s/g, "")).toEqual("1.c1::::{{one}}-c1::{{two}}");
        expect(parseTextLine("  125. one - two", 1).result.replace(/\s/g, "")).toEqual("125.c1::::{{one}}-c1::{{two}}");
    });

    test("delimiter no space", () => {

        expect(parseTextLine("1. one -two", 1).result.replace(/\s/g, "")).toEqual("1.one-two");
        expect(parseTextLine("125. one -two", 1).result.replace(/\s/g, "")).toEqual("125.one-two");

        expect(parseTextLine("1. one- two", 1).result.replace(/\s/g, "")).toEqual("1.one-two");
        expect(parseTextLine("125. one- two", 1).result.replace(/\s/g, "")).toEqual("125.one-two");

        expect(parseTextLine("1. one-two", 1).result.replace(/\s/g, "")).toEqual("1.one-two");
        expect(parseTextLine("125. one-two", 1).result.replace(/\s/g, "")).toEqual("125.one-two");
    })
});

describe("parse text: bullet with equal delimiter", () => {

    test("no indent", () => {
        expect(parseTextLine("- one = two", 1).result.replace(/\s/g, "")).toEqual("-c1::::{{one}}=c1::{{two}}");
    });

    test("indented", () => {
        expect(parseTextLine("  - one = two", 1).result.replace(/\s/g, "")).toEqual("-c1::::{{one}}=c1::{{two}}");
    });

    test("delimiter no space", () => {
        expect(parseTextLine("- one =two", 1).result.replace(/\s/g, "")).toEqual("-one=two");
        expect(parseTextLine("- one= two", 1).result.replace(/\s/g, "")).toEqual("-one=two");
        expect(parseTextLine("- one=two", 1).result.replace(/\s/g, "")).toEqual("-one=two");
    })
});

describe("parse text: numbered bullet with equal delimiter", () => {

    test("no indent", () => {

        expect(parseTextLine("1. one = two", 1).result.replace(/\s/g, "")).toEqual("1.c1::::{{one}}=c1::{{two}}");
        expect(parseTextLine("125. one = two", 1).result.replace(/\s/g, "")).toEqual("125.c1::::{{one}}=c1::{{two}}");
    });

    test("indented", () => {

        expect(parseTextLine("  1. one = two", 1).result.replace(/\s/g, "")).toEqual("1.c1::::{{one}}=c1::{{two}}");
        expect(parseTextLine("  125. one = two", 1).result.replace(/\s/g, "")).toEqual("125.c1::::{{one}}=c1::{{two}}");
    });

    test("delimiter no space", () => {

        expect(parseTextLine("1. one =two", 1).result.replace(/\s/g, "")).toEqual("1.one=two");
        expect(parseTextLine("125. one =two", 1).result.replace(/\s/g, "")).toEqual("125.one=two");

        expect(parseTextLine("1. one= two", 1).result.replace(/\s/g, "")).toEqual("1.one=two");
        expect(parseTextLine("125. one= two", 1).result.replace(/\s/g, "")).toEqual("125.one=two");

        expect(parseTextLine("1. one=two", 1).result.replace(/\s/g, "")).toEqual("1.one=two");
        expect(parseTextLine("125. one=two", 1).result.replace(/\s/g, "")).toEqual("125.one=two");
    })
});

