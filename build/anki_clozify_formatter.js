"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextParser_1 = __importDefault(require("./TextParser"));
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
