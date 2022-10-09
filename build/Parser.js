"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE = void 0;
var STATE;
(function (STATE) {
    STATE[STATE["TEXT"] = 0] = "TEXT";
    STATE[STATE["INLINE_LATEX"] = 1] = "INLINE_LATEX";
    STATE[STATE["MULTI_LINE_LATEX"] = 2] = "MULTI_LINE_LATEX";
    STATE[STATE["INLINE_CODE"] = 3] = "INLINE_CODE";
    STATE[STATE["MULTI_LINE_CODE"] = 4] = "MULTI_LINE_CODE";
})(STATE = exports.STATE || (exports.STATE = {}));
