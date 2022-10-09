/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Parser.ts":
/*!***********************!*\
  !*** ./src/Parser.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STATE = void 0;
var STATE;
(function (STATE) {
    STATE[STATE["TEXT"] = 0] = "TEXT";
    STATE[STATE["INLINE_LATEX"] = 1] = "INLINE_LATEX";
    STATE[STATE["MULTI_LINE_LATEX"] = 2] = "MULTI_LINE_LATEX";
    STATE[STATE["INLINE_CODE"] = 3] = "INLINE_CODE";
    STATE[STATE["MULTI_LINE_CODE"] = 4] = "MULTI_LINE_CODE";
})(STATE = exports.STATE || (exports.STATE = {}));


/***/ }),

/***/ "./src/TextParser.ts":
/*!***************************!*\
  !*** ./src/TextParser.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * An enum representing the state of text of the current character
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Parser_1 = __webpack_require__(/*! ./Parser */ "./src/Parser.ts");
class PlainTextParser {
    constructor() { }
    static get() {
        return PlainTextParser.instance;
    }
    /**
     * When given a line of plain text to parse (not code or LaTeX), parses line into appropriate anki cloze format.
     *
     * Does:
        * - one - two => - {{c1::::one }} - {{c1::two }}
        * - one - two => - {{c1::::one }} = {{c1::two }}
        * 1. one - two => 1. {{c1::::one }} - {{c1::two }}
        * 1. one - two => 1. {{c1::::one }} = {{c1::two }}
    *
     * @param line line to parse
     * @param clozeNumber current Cloze number
     * @returns
     */
    parseLine(line, clozeNumber) {
        // Line cannot contain newline
        if (/\n/.test(line)) {
            throw new Error("Line cannot contain \\n. Line is " + line);
        }
        // Cloze number cannot be less than 1
        if (clozeNumber < 1) {
            throw new Error("Cloze number cannot be less than 1");
        }
        const matchedGroups = line.match(PlainTextParser.BULLET_SEPARATOR_REGEX)?.groups ?? null;
        if (matchedGroups === null) {
            return {
                result: line,
                clozeNumber: clozeNumber,
                state: Parser_1.STATE.TEXT
            };
        }
        const { bullet, front, separator, back } = matchedGroups;
        return {
            result: `${bullet} c${clozeNumber}::::\{\{${front}\}\} ${separator} c${clozeNumber}::\{\{${back}\}\}`,
            clozeNumber: clozeNumber + 1,
            state: Parser_1.STATE.TEXT
        };
    }
}
exports["default"] = PlainTextParser;
PlainTextParser.instance = new PlainTextParser();
PlainTextParser.ALLOWED_BULLETS = ["\\d*\\.", "-"];
PlainTextParser.ALLOWED_SEPARATORS = ["-", "="];
PlainTextParser.PARSED_BULLET_REGEX = PlainTextParser.ALLOWED_BULLETS.join("|"); // Concatenate possible bullets with |
PlainTextParser.PARSED_SEPARATOR_REGEX = PlainTextParser.ALLOWED_SEPARATORS.join("|"); // Concatenate possible bullets with |
PlainTextParser.BULLET_SEPARATOR_REGEX = new RegExp("(?<=^\\s*)"
    + "(?<bullet>" + PlainTextParser.PARSED_BULLET_REGEX + ")"
    + "\\s+"
    + "(?<front>(?:(?!( = | - )).)*)"
    + "\\s+"
    + "(?<separator>" + PlainTextParser.PARSED_SEPARATOR_REGEX + ")"
    + "\\s+"
    + "(?<back>.*)");
function main() {
}
main();


/***/ }),

/***/ "./src/anki_clozify_formatter.ts":
/*!***************************************!*\
  !*** ./src/anki_clozify_formatter.ts ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const TextParser_1 = __importDefault(__webpack_require__(/*! ./TextParser */ "./src/TextParser.ts"));
const plainTextParser = TextParser_1.default.get();
function parse(text) {
    let clozeNumber = 1;
    let resultLines = [""];
    while (text.length > 0) {
        // TODO: Null safety here
        const nextLine = text.slice(0, (/$/m).exec(text).index).trim();
        text = text.slice((/$/m).exec(text).index).trim();
        const parsedObject = plainTextParser.parseLine(nextLine, clozeNumber);
        resultLines.push(parsedObject.result);
        clozeNumber = parsedObject.clozeNumber;
    }
    return resultLines.join("\n");
}
console.log(parse(`
- Hello i had a good day - sdffsd
1. sdfsdfsdf - sdfsdfsdf
    - sdfsdfdfs - sdfsdffsd
`));
module.exports = parse;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/anki_clozify_formatter.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5raV9jbG96aWZ5X2Zvcm1hdHRlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyw0QkFBNEIsYUFBYSxLQUFLOzs7Ozs7Ozs7OztBQ1ZsQztBQUNiO0FBQ0E7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQkFBaUIsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsYUFBYSxJQUFJO0FBQzlDLDZCQUE2QixhQUFhLElBQUk7QUFDOUMsK0JBQStCLGFBQWEsSUFBSTtBQUNoRCwrQkFBK0IsYUFBYSxJQUFJO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlDQUFpQztBQUNqRDtBQUNBLHVCQUF1QixRQUFRLEdBQUcsWUFBWSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFdBQVcsR0FBRyxZQUFZLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ2hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRjtBQUNqRix1RkFBdUY7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNqRWE7QUFDYjtBQUNBLDZDQUE2QztBQUM3QztBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxxQ0FBcUMsbUJBQU8sQ0FBQyx5Q0FBYztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDekJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vYnNpZGlhbi1sYXRleC1zbmlwcGV0cy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vb2JzaWRpYW4tbGF0ZXgtc25pcHBldHMvLi9zcmMvVGV4dFBhcnNlci50cyIsIndlYnBhY2s6Ly9vYnNpZGlhbi1sYXRleC1zbmlwcGV0cy8uL3NyYy9hbmtpX2Nsb3ppZnlfZm9ybWF0dGVyLnRzIiwid2VicGFjazovL29ic2lkaWFuLWxhdGV4LXNuaXBwZXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29ic2lkaWFuLWxhdGV4LXNuaXBwZXRzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vb2JzaWRpYW4tbGF0ZXgtc25pcHBldHMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL29ic2lkaWFuLWxhdGV4LXNuaXBwZXRzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlNUQVRFID0gdm9pZCAwO1xyXG52YXIgU1RBVEU7XHJcbihmdW5jdGlvbiAoU1RBVEUpIHtcclxuICAgIFNUQVRFW1NUQVRFW1wiVEVYVFwiXSA9IDBdID0gXCJURVhUXCI7XHJcbiAgICBTVEFURVtTVEFURVtcIklOTElORV9MQVRFWFwiXSA9IDFdID0gXCJJTkxJTkVfTEFURVhcIjtcclxuICAgIFNUQVRFW1NUQVRFW1wiTVVMVElfTElORV9MQVRFWFwiXSA9IDJdID0gXCJNVUxUSV9MSU5FX0xBVEVYXCI7XHJcbiAgICBTVEFURVtTVEFURVtcIklOTElORV9DT0RFXCJdID0gM10gPSBcIklOTElORV9DT0RFXCI7XHJcbiAgICBTVEFURVtTVEFURVtcIk1VTFRJX0xJTkVfQ09ERVwiXSA9IDRdID0gXCJNVUxUSV9MSU5FX0NPREVcIjtcclxufSkoU1RBVEUgPSBleHBvcnRzLlNUQVRFIHx8IChleHBvcnRzLlNUQVRFID0ge30pKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qKlxyXG4gKiBBbiBlbnVtIHJlcHJlc2VudGluZyB0aGUgc3RhdGUgb2YgdGV4dCBvZiB0aGUgY3VycmVudCBjaGFyYWN0ZXJcclxuICovXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgUGFyc2VyXzEgPSByZXF1aXJlKFwiLi9QYXJzZXJcIik7XHJcbmNsYXNzIFBsYWluVGV4dFBhcnNlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgc3RhdGljIGdldCgpIHtcclxuICAgICAgICByZXR1cm4gUGxhaW5UZXh0UGFyc2VyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIGdpdmVuIGEgbGluZSBvZiBwbGFpbiB0ZXh0IHRvIHBhcnNlIChub3QgY29kZSBvciBMYVRlWCksIHBhcnNlcyBsaW5lIGludG8gYXBwcm9wcmlhdGUgYW5raSBjbG96ZSBmb3JtYXQuXHJcbiAgICAgKlxyXG4gICAgICogRG9lczpcclxuICAgICAgICAqIC0gb25lIC0gdHdvID0+IC0ge3tjMTo6OjpvbmUgfX0gLSB7e2MxOjp0d28gfX1cclxuICAgICAgICAqIC0gb25lIC0gdHdvID0+IC0ge3tjMTo6OjpvbmUgfX0gPSB7e2MxOjp0d28gfX1cclxuICAgICAgICAqIDEuIG9uZSAtIHR3byA9PiAxLiB7e2MxOjo6Om9uZSB9fSAtIHt7YzE6OnR3byB9fVxyXG4gICAgICAgICogMS4gb25lIC0gdHdvID0+IDEuIHt7YzE6Ojo6b25lIH19ID0ge3tjMTo6dHdvIH19XHJcbiAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGluZSBsaW5lIHRvIHBhcnNlXHJcbiAgICAgKiBAcGFyYW0gY2xvemVOdW1iZXIgY3VycmVudCBDbG96ZSBudW1iZXJcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHBhcnNlTGluZShsaW5lLCBjbG96ZU51bWJlcikge1xyXG4gICAgICAgIC8vIExpbmUgY2Fubm90IGNvbnRhaW4gbmV3bGluZVxyXG4gICAgICAgIGlmICgvXFxuLy50ZXN0KGxpbmUpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpbmUgY2Fubm90IGNvbnRhaW4gXFxcXG4uIExpbmUgaXMgXCIgKyBsaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ2xvemUgbnVtYmVyIGNhbm5vdCBiZSBsZXNzIHRoYW4gMVxyXG4gICAgICAgIGlmIChjbG96ZU51bWJlciA8IDEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2xvemUgbnVtYmVyIGNhbm5vdCBiZSBsZXNzIHRoYW4gMVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWF0Y2hlZEdyb3VwcyA9IGxpbmUubWF0Y2goUGxhaW5UZXh0UGFyc2VyLkJVTExFVF9TRVBBUkFUT1JfUkVHRVgpPy5ncm91cHMgPz8gbnVsbDtcclxuICAgICAgICBpZiAobWF0Y2hlZEdyb3VwcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiBsaW5lLFxyXG4gICAgICAgICAgICAgICAgY2xvemVOdW1iZXI6IGNsb3plTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgc3RhdGU6IFBhcnNlcl8xLlNUQVRFLlRFWFRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBidWxsZXQsIGZyb250LCBzZXBhcmF0b3IsIGJhY2sgfSA9IG1hdGNoZWRHcm91cHM7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdWx0OiBgJHtidWxsZXR9IGMke2Nsb3plTnVtYmVyfTo6OjpcXHtcXHske2Zyb250fVxcfVxcfSAke3NlcGFyYXRvcn0gYyR7Y2xvemVOdW1iZXJ9OjpcXHtcXHske2JhY2t9XFx9XFx9YCxcclxuICAgICAgICAgICAgY2xvemVOdW1iZXI6IGNsb3plTnVtYmVyICsgMSxcclxuICAgICAgICAgICAgc3RhdGU6IFBhcnNlcl8xLlNUQVRFLlRFWFRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFBsYWluVGV4dFBhcnNlcjtcclxuUGxhaW5UZXh0UGFyc2VyLmluc3RhbmNlID0gbmV3IFBsYWluVGV4dFBhcnNlcigpO1xyXG5QbGFpblRleHRQYXJzZXIuQUxMT1dFRF9CVUxMRVRTID0gW1wiXFxcXGQqXFxcXC5cIiwgXCItXCJdO1xyXG5QbGFpblRleHRQYXJzZXIuQUxMT1dFRF9TRVBBUkFUT1JTID0gW1wiLVwiLCBcIj1cIl07XHJcblBsYWluVGV4dFBhcnNlci5QQVJTRURfQlVMTEVUX1JFR0VYID0gUGxhaW5UZXh0UGFyc2VyLkFMTE9XRURfQlVMTEVUUy5qb2luKFwifFwiKTsgLy8gQ29uY2F0ZW5hdGUgcG9zc2libGUgYnVsbGV0cyB3aXRoIHxcclxuUGxhaW5UZXh0UGFyc2VyLlBBUlNFRF9TRVBBUkFUT1JfUkVHRVggPSBQbGFpblRleHRQYXJzZXIuQUxMT1dFRF9TRVBBUkFUT1JTLmpvaW4oXCJ8XCIpOyAvLyBDb25jYXRlbmF0ZSBwb3NzaWJsZSBidWxsZXRzIHdpdGggfFxyXG5QbGFpblRleHRQYXJzZXIuQlVMTEVUX1NFUEFSQVRPUl9SRUdFWCA9IG5ldyBSZWdFeHAoXCIoPzw9XlxcXFxzKilcIlxyXG4gICAgKyBcIig/PGJ1bGxldD5cIiArIFBsYWluVGV4dFBhcnNlci5QQVJTRURfQlVMTEVUX1JFR0VYICsgXCIpXCJcclxuICAgICsgXCJcXFxccytcIlxyXG4gICAgKyBcIig/PGZyb250Pig/Oig/ISggPSB8IC0gKSkuKSopXCJcclxuICAgICsgXCJcXFxccytcIlxyXG4gICAgKyBcIig/PHNlcGFyYXRvcj5cIiArIFBsYWluVGV4dFBhcnNlci5QQVJTRURfU0VQQVJBVE9SX1JFR0VYICsgXCIpXCJcclxuICAgICsgXCJcXFxccytcIlxyXG4gICAgKyBcIig/PGJhY2s+LiopXCIpO1xyXG5mdW5jdGlvbiBtYWluKCkge1xyXG59XHJcbm1haW4oKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgVGV4dFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1RleHRQYXJzZXJcIikpO1xyXG5jb25zdCBwbGFpblRleHRQYXJzZXIgPSBUZXh0UGFyc2VyXzEuZGVmYXVsdC5nZXQoKTtcclxuZnVuY3Rpb24gcGFyc2UodGV4dCkge1xyXG4gICAgbGV0IGNsb3plTnVtYmVyID0gMTtcclxuICAgIGxldCByZXN1bHRMaW5lcyA9IFtcIlwiXTtcclxuICAgIHdoaWxlICh0ZXh0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvLyBUT0RPOiBOdWxsIHNhZmV0eSBoZXJlXHJcbiAgICAgICAgY29uc3QgbmV4dExpbmUgPSB0ZXh0LnNsaWNlKDAsICgvJC9tKS5leGVjKHRleHQpLmluZGV4KS50cmltKCk7XHJcbiAgICAgICAgdGV4dCA9IHRleHQuc2xpY2UoKC8kL20pLmV4ZWModGV4dCkuaW5kZXgpLnRyaW0oKTtcclxuICAgICAgICBjb25zdCBwYXJzZWRPYmplY3QgPSBwbGFpblRleHRQYXJzZXIucGFyc2VMaW5lKG5leHRMaW5lLCBjbG96ZU51bWJlcik7XHJcbiAgICAgICAgcmVzdWx0TGluZXMucHVzaChwYXJzZWRPYmplY3QucmVzdWx0KTtcclxuICAgICAgICBjbG96ZU51bWJlciA9IHBhcnNlZE9iamVjdC5jbG96ZU51bWJlcjtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHRMaW5lcy5qb2luKFwiXFxuXCIpO1xyXG59XHJcbmNvbnNvbGUubG9nKHBhcnNlKGBcclxuLSBIZWxsbyBpIGhhZCBhIGdvb2QgZGF5IC0gc2RmZnNkXHJcbjEuIHNkZnNkZnNkZiAtIHNkZnNkZnNkZlxyXG4gICAgLSBzZGZzZGZkZnMgLSBzZGZzZGZmc2RcclxuYCkpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYW5raV9jbG96aWZ5X2Zvcm1hdHRlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==