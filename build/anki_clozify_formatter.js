"use strict";
(() => {
  // src/util/str_utils.ts
  function getSubStringAfter(str, query) {
    if (query instanceof RegExp) {
      if (!query.test(str)) {
        return "";
      }
      const regMatchInfo = query.exec(str);
      return str.substring(regMatchInfo.index + regMatchInfo[0].length);
    } else if (typeof query === "string") {
      if (!str.includes(query)) {
        return str;
      }
      return str.substring(str.indexOf(query) + query.length);
    } else {
      throw new Error("Invalid query type");
    }
  }
  function getSubStringBefore(str, query) {
    if (query instanceof RegExp) {
      if (!query.test(str)) {
        return str;
      }
      const regMatchInfo = query.exec(str);
      return str.substring(0, regMatchInfo.index);
    } else if (typeof query === "string") {
      if (!str.includes(query)) {
        return str;
      }
      return str.substring(0, str.indexOf(query));
    } else {
      throw new Error("Invalid query type");
    }
  }
  function countDistinctSubstring(str, substring) {
    return str.split(substring).length - 1;
  }

  // src/parser/TextParser.ts
  var ALLOWED_BULLETS = ["\\d*\\.", "-"];
  var ALLOWED_SEPARATORS = ["-", "="];
  var PARSED_BULLET_REGEX = ALLOWED_BULLETS.join("|");
  var PARSED_SEPARATOR_REGEX = ALLOWED_SEPARATORS.join("|");
  var BULLET_SEPARATOR_REGEX = new RegExp(
    "(?<=^\\s*)(?<bullet>" + PARSED_BULLET_REGEX + ")\\s+(?<front>(?:(?!( = | - )).)*)\\s+(?<separator>" + PARSED_SEPARATOR_REGEX + ")\\s+(?<back>.*)"
  );
  function parseText(line, clozeNumber) {
    if (/\n/.test(line)) {
      throw new Error("Line cannot contain \\n. Line is " + line);
    }
    if (clozeNumber < 1) {
      throw new Error("Cloze number cannot be less than 1");
    }
    const matchedGroups = line.match(BULLET_SEPARATOR_REGEX)?.groups ?? null;
    if (matchedGroups === null) {
      return {
        result: line,
        clozeNumber,
        state: 0 /* TEXT */
      };
    }
    let { bullet, front, separator, back } = matchedGroups;
    if (countDistinctSubstring(front ?? "", "$$") % 2 === 1) {
      ({ front, separator, back } = shiftSeparatorToNextDelimiter(
        front ?? "",
        separator ?? "",
        back ?? "",
        "$$",
        ALLOWED_SEPARATORS
      ));
    }
    return {
      result: `${bullet} c${clozeNumber}::::{{${front}}} ${separator} c${clozeNumber}::{{${back}}}`,
      clozeNumber: clozeNumber + 1,
      state: 0 /* TEXT */
    };
  }
  function shiftSeparatorToNextDelimiter(front, current_separator, back, delimiter, possible_separators) {
    console.log({ front, back });
    front += " " + current_separator + " " + getSubStringBefore(back, delimiter) + delimiter;
    back = getSubStringAfter(back, new RegExp(delimiter));
    let substring_to_transfer;
    let new_separator;
    possible_separators.forEach((sep) => {
      const substring = getSubStringBefore(back, new RegExp(delimiter));
      if (substring_to_transfer === void 0 || substring_to_transfer.length > substring.length) {
        substring_to_transfer = substring;
        new_separator = sep;
      }
    });
    if (substring_to_transfer === void 0 || new_separator === void 0) {
      throw new Error("Delimiter could not be found");
    }
    front += substring_to_transfer;
    back = getSubStringAfter(back, new RegExp(new_separator));
    return {
      front,
      separator: new_separator,
      back
    };
  }

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
        parsedObject = parseText(nextLine, clozeNumber);
      } else if (currentState === 4 /* MULTI_LINE_CODE */) {
        parsedObject = parseText(nextLine, clozeNumber);
      } else if (currentState === 3 /* MULTI_LINE_LATEX */) {
        parsedObject = parseText(nextLine, clozeNumber);
      } else {
        throw new Error("Invalid State: " + currentState);
      }
      resultLines.push(parsedObject.result);
      ({ clozeNumber, state: currentState } = parsedObject);
    }
    return resultLines.join("\n");
  }
  module.exports = parse;
  console.log(parse(`- sdfsdsdfsdf $$sdfdfs - dfsdfs$$ asdf - sdfsfsd`));
})();
