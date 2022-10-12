"use strict";
(() => {
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
  function addBackTicks(str) {
    return `\`${str}\``;
  }

  // src/parser/Parser.ts
  var CODE_STATUS = class {
    static notCode() {
      return new CODE_STATUS(CODE_LANGUAGE.NONE);
    }
    constructor(language, prevLineIsComment = false) {
      this.language = language;
      this.nextLineIsCloze = prevLineIsComment;
    }
    getCommentHeaders() {
      switch (this.language) {
        case CODE_LANGUAGE.NONE:
        default:
          return ["#", "//"];
        case CODE_LANGUAGE.PYTHON:
          return ["#"];
        case CODE_LANGUAGE.CPP:
        case CODE_LANGUAGE.JAVA:
        case CODE_LANGUAGE.JAVASCRIPT:
          return ["//"];
        case CODE_LANGUAGE.SQL:
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
        case "js":
          return CODE_LANGUAGE.JAVASCRIPT;
        case "":
          return CODE_LANGUAGE.NONE;
        default:
          throw new Error("Unknown language: " + alias);
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
    CODE_LANGUAGE2[CODE_LANGUAGE2["JAVASCRIPT"] = 6] = "JAVASCRIPT";
    return CODE_LANGUAGE2;
  })(CODE_LANGUAGE || {});

  // src/parser/CodeParser.ts
  function parseMultiLineCode(line, nextLine, clozeNumber, codeStatus) {
    line = line.replaceAll("	", "  ");
    if (line.startsWith("```")) {
      return endMultilineCode(line, nextLine, clozeNumber, codeStatus);
    }
    if (isComment(line, codeStatus)) {
      return parseCodeComment(line, nextLine, clozeNumber, codeStatus);
    }
    if (isEmpty(line)) {
      return parseEmptyLine(line, nextLine, clozeNumber, codeStatus);
    }
    if (codeStatus.nextLineIsCloze) {
      return parseClozifyCode(line, nextLine, clozeNumber, codeStatus);
    }
    return parseNonClozifyCode(line, nextLine, clozeNumber, codeStatus);
  }
  function endMultilineCode(line, nextLine, clozeNumber, codeStatus) {
    codeStatus.nextLineIsCloze = false;
    return {
      result: "",
      clozeNumber,
      state: 0 /* TEXT */,
      codeStatus: CODE_STATUS.notCode()
    };
  }
  function parseCodeComment(line, nextLine, clozeNumber, codeStatus) {
    codeStatus.nextLineIsCloze = true;
    return {
      result: addBackTicks(line),
      clozeNumber,
      state: 4 /* MULTI_LINE_CODE */,
      codeStatus
    };
  }
  function parseEmptyLine(line, nextLine, clozeNumber, codeStatus) {
    codeStatus.nextLineIsCloze = false;
    return {
      result: addBackTicks(line),
      clozeNumber,
      state: 4 /* MULTI_LINE_CODE */,
      codeStatus
    };
  }
  function parseClozifyCode(line, nextLine, clozeNumber, codeStatus) {
    const indent = /^\s*/.test(line) ? line.match(/^\s*/)[0] : "";
    const lineWithoutIndent = line.trimStart();
    if (isComment(nextLine, codeStatus) || isEmpty(nextLine)) {
      codeStatus.nextLineIsCloze = false;
      return {
        result: addBackTicks(`${indent}c${clozeNumber}::{{ ${lineWithoutIndent} }}`),
        clozeNumber: clozeNumber + 1,
        state: 4 /* MULTI_LINE_CODE */,
        codeStatus
      };
    } else {
      codeStatus.nextLineIsCloze = true;
      return {
        result: addBackTicks(`${indent}c${clozeNumber}::{{ ${lineWithoutIndent} }}`),
        clozeNumber,
        state: 4 /* MULTI_LINE_CODE */,
        codeStatus
      };
    }
  }
  function parseNonClozifyCode(line, nextLine, clozeNumber, codeStatus) {
    return {
      result: addBackTicks(line),
      clozeNumber,
      state: 4 /* MULTI_LINE_CODE */,
      codeStatus
    };
  }
  function isComment(line, codeStatus) {
    let isComment2 = false;
    codeStatus.getCommentHeaders().forEach((header) => {
      if (line.trimStart().startsWith(header)) {
        isComment2 = true;
      }
    });
    return isComment2;
  }
  function isEmpty(line) {
    return line.trim().length === 0;
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
    if (line.startsWith("```")) {
      return startCodeBlock(line, clozeNumber);
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
  function startCodeBlock(line, clozeNumber) {
    return {
      result: "",
      clozeNumber,
      state: 4 /* MULTI_LINE_CODE */,
      codeStatus: new CODE_STATUS(CODE_STATUS.getLanguageFromAlias(line.substring(3)))
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
    let codeStatus = CODE_STATUS.notCode();
    let nextLine;
    let resultLines = [];
    while (text.length > 0) {
      ({ left: nextLine, right: text } = partition(text, "\n"));
      let parsedObject;
      if (currentState === 0 /* TEXT */) {
        parsedObject = parseText(nextLine, clozeNumber);
      } else if (currentState === 4 /* MULTI_LINE_CODE */) {
        parsedObject = parseMultiLineCode(nextLine, partition(text, "\n").left, clozeNumber, codeStatus);
      } else if (currentState === 3 /* MULTI_LINE_LATEX */) {
        parsedObject = parseText(nextLine, clozeNumber);
      } else {
        throw new Error("Invalid State: " + currentState);
      }
      resultLines.push(parsedObject.result);
      ({ clozeNumber, state: currentState, codeStatus } = parsedObject);
    }
    return resultLines.join("\n");
  }
  module.exports = parse;
})();
