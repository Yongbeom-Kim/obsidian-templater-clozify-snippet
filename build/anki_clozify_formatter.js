"use strict";
(() => {
  // src/TextParser.ts
  var _PlainTextParser = class {
    constructor() {
    }
    static get() {
      return _PlainTextParser.instance;
    }
    parseLine(line, clozeNumber) {
      if (/\n/.test(line)) {
        throw new Error("Line cannot contain \\n. Line is " + line);
      }
      if (clozeNumber < 1) {
        throw new Error("Cloze number cannot be less than 1");
      }
      const matchedGroups = line.match(_PlainTextParser.BULLET_SEPARATOR_REGEX)?.groups ?? null;
      if (matchedGroups === null) {
        return {
          result: line,
          clozeNumber,
          state: 0 /* TEXT */
        };
      }
      const { bullet, front, separator, back } = matchedGroups;
      return {
        result: `${bullet} c${clozeNumber}::::{{${front}}} ${separator} c${clozeNumber}::{{${back}}}`,
        clozeNumber: clozeNumber + 1,
        state: 0 /* TEXT */
      };
    }
  };
  var PlainTextParser = _PlainTextParser;
  PlainTextParser.instance = new _PlainTextParser();
  PlainTextParser.ALLOWED_BULLETS = ["\\d*\\.", "-"];
  PlainTextParser.ALLOWED_SEPARATORS = ["-", "="];
  PlainTextParser.PARSED_BULLET_REGEX = _PlainTextParser.ALLOWED_BULLETS.join("|");
  PlainTextParser.PARSED_SEPARATOR_REGEX = _PlainTextParser.ALLOWED_SEPARATORS.join("|");
  PlainTextParser.BULLET_SEPARATOR_REGEX = new RegExp(
    "(?<=^\\s*)(?<bullet>" + _PlainTextParser.PARSED_BULLET_REGEX + ")\\s+(?<front>(?:(?!( = | - )).)*)\\s+(?<separator>" + _PlainTextParser.PARSED_SEPARATOR_REGEX + ")\\s+(?<back>.*)"
  );
  function main() {
  }
  main();

  // src/anki_clozify_formatter.ts
  var plainTextParser = PlainTextParser.get();
  function parse(text) {
    let clozeNumber = 1;
    let resultLines = [""];
    while (text.length > 0) {
      const nextLine = text.slice(0, /$/m.exec(text).index).trim();
      text = text.slice(/$/m.exec(text).index).trim();
      const parsedObject = plainTextParser.parseLine(nextLine, clozeNumber);
      resultLines.push(parsedObject.result);
      clozeNumber = parsedObject.clozeNumber;
    }
    return resultLines.join("\n");
  }
  module.exports = parse;
})();
