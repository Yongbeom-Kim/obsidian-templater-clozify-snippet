import PlainTextParser from "./TextParser";

const plainTextParser = PlainTextParser.get();

export default function parse(text: string): string {
    let clozeNumber = 1;
    let resultLines = [""]

    while (text.length > 0) {
        // TODO: Null safety here
        const nextLine: string = text.slice(0, (/$/m).exec(text)!.index).trim();
        text = text.slice((/$/m).exec(text)!.index).trim();

        const parsedObject = plainTextParser.parseLine(nextLine, clozeNumber);
        resultLines.push(parsedObject.result);
        clozeNumber = parsedObject.clozeNumber;
    }

    return resultLines.join("\n");
}

module.exports = parse;