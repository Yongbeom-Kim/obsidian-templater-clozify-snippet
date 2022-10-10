"use strict";
(() => {
  // src/parser/Parser.ts
  var CODE_STATUS = class {
    static notCode() {
      return new CODE_STATUS(CODE_LANGUAGE.NONE);
    }
    constructor(language, prevLineIsComment = false) {
      this.language = language;
      this.prevLineIsComment = prevLineIsComment;
    }
    getCommentHeaderRegex() {
      switch (this.language) {
        case CODE_LANGUAGE.NONE:
        default:
          return ["#", "//"];
        case CODE_LANGUAGE.PYTHON:
          return ["#"];
        case CODE_LANGUAGE.CPP:
          return ["//"];
        case CODE_LANGUAGE.JAVA:
          return ["//"];
        case CODE_LANGUAGE.SQL:
          return ["--"];
        case CODE_LANGUAGE.PLSQL:
          return ["--"];
      }
    }
    static getLanguageFromAlias(alias) {
      switch (alias) {
        case "sql":
          return CODE_LANGUAGE.SQL;
        case "plsql":
          return CODE_LANGUAGE.PLSQL;
        case "python":
          return CODE_LANGUAGE.PYTHON;
        case "cpp":
          return CODE_LANGUAGE.CPP;
        case "java":
          return CODE_LANGUAGE.JAVA;
        default:
          return CODE_LANGUAGE.NONE;
      }
    }
  };
  var CODE_LANGUAGE = /* @__PURE__ */ ((CODE_LANGUAGE2) => {
    CODE_LANGUAGE2[CODE_LANGUAGE2["NONE"] = 0] = "NONE";
    CODE_LANGUAGE2[CODE_LANGUAGE2["PYTHON"] = 1] = "PYTHON";
    CODE_LANGUAGE2[CODE_LANGUAGE2["CPP"] = 2] = "CPP";
    CODE_LANGUAGE2[CODE_LANGUAGE2["JAVA"] = 3] = "JAVA";
    CODE_LANGUAGE2[CODE_LANGUAGE2["SQL"] = 4] = "SQL";
    CODE_LANGUAGE2[CODE_LANGUAGE2["PLSQL"] = 5] = "PLSQL";
    return CODE_LANGUAGE2;
  })(CODE_LANGUAGE || {});

  // src/util/str_utils.ts
  function partition(str, delimiter) {
    const splitString = str.split(delimiter);
    return {
      left: splitString[0] ?? "",
      right: splitString?.slice(1)?.join(delimiter) ?? ""
    };
  }
  function lastPartition(str, delimiter) {
    const splitString = str.split(delimiter);
    return {
      left: splitString?.slice(0, -1)?.join(delimiter) ?? "",
      right: splitString[splitString.length - 1] ?? ""
    };
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
        state: 0 /* TEXT */,
        codeStatus: CODE_STATUS.notCode()
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
    if (back?.trim()?.length === 0) {
      return {
        result: line,
        clozeNumber,
        state: 0 /* TEXT */,
        codeStatus: CODE_STATUS.notCode()
      };
    }
    return {
      result: `${bullet} c${clozeNumber}::::{{ ${front} }} ${separator} c${clozeNumber}::{{ ${back} }}`,
      clozeNumber: clozeNumber + 1,
      state: 0 /* TEXT */,
      codeStatus: CODE_STATUS.notCode()
    };
  }
  function shiftSeparatorToNextDelimiter(front, current_separator, back, delimiter, possible_separators) {
    front += " " + current_separator + " " + lastPartition(back, delimiter).left + delimiter;
    back = lastPartition(back, delimiter).right;
    let substring_to_transfer;
    let new_separator;
    possible_separators.forEach((sep) => {
      const substring = partition(back, sep).left;
      if (substring_to_transfer === void 0 || substring_to_transfer.length > substring.length) {
        substring_to_transfer = substring;
        new_separator = sep;
      }
    });
    if (substring_to_transfer === void 0 || new_separator === void 0) {
      throw new Error("Delimiter could not be found");
    }
    front += partition(back, new_separator).left;
    back = partition(back, new_separator).right;
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
  console.log(parse(`- one = four`));
  console.log(parse(`- one $$two - three$$ = four`));
  console.log(parse(`- one $$two - three$$ asdf $$four - four$$ - five`));
  console.log(parse(`- one $$two - three$$ asdf $$four - four$$ = five`));
})();
