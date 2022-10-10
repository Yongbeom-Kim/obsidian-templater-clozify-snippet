"use strict";
(() => {
  // src/TextParser.ts
  var ALLOWED_BULLETS = ["\\d*\\.", "-"];
  var ALLOWED_SEPARATORS = ["-", "="];
  var PARSED_BULLET_REGEX = ALLOWED_BULLETS.join("|");
  var PARSED_SEPARATOR_REGEX = ALLOWED_SEPARATORS.join("|");
  var BULLET_SEPARATOR_REGEX = new RegExp(
    "(?<=^\\s*)(?<bullet>" + PARSED_BULLET_REGEX + ")\\s+(?<front>(?:(?!( = | - )).)*)\\s+(?<separator>" + PARSED_SEPARATOR_REGEX + ")\\s+(?<back>.*)"
  );
  function parseLine(line, clozeNumber) {
    if (/\n/.test(line)) {
      throw new Error("Line cannot contain \\n. Line is " + line);
    }
    if (clozeNumber < 1) {
      throw new Error("Cloze number cannot be less than 1");
    }
    const matchedGroups = line.match(BULLET_SEPARATOR_REGEX)?.groups ?? null;
    if (matchedGroups === null) {
      return {
        result: line + "\n",
        clozeNumber,
        state: 0 /* TEXT */
      };
    }
    const { bullet, front, separator, back } = matchedGroups;
    return {
      result: `${bullet} c${clozeNumber}::::{{${front}}} ${separator} c${clozeNumber}::{{${back}}}
`,
      clozeNumber: clozeNumber + 1,
      state: 0 /* TEXT */
    };
  }
  function main() {
  }
  main();

  // src/anki_clozify_formatter.ts
  function parse(text) {
    let clozeNumber = 1;
    let currentState = 0 /* TEXT */;
    let resultLines = [];
    while (text.length > 0) {
      const nextLine = text.slice(0, /$/m.exec(text).index).trim();
      text = text.slice(/$/m.exec(text).index).trim();
      let parsedObject;
      if (currentState === 0 /* TEXT */) {
        parsedObject = parseLine(nextLine, clozeNumber);
      } else if (currentState === 2 /* MULTI_LINE_CODE */) {
        parsedObject = parseLine(nextLine, clozeNumber);
      } else if (currentState === 1 /* MULTI_LINE_LATEX */) {
        parsedObject = parseLine(nextLine, clozeNumber);
      } else {
        throw new Error("Invalid State: " + currentState);
      }
      resultLines.push(parsedObject.result);
      ({ clozeNumber, state: currentState } = parsedObject);
    }
    return resultLines.join("");
  }
  module.exports = parse;
})();
