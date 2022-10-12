import parse from "../src/anki_clozify_formatter";


describe('parse code block', () => {
    // it('parse 1 line js code', () => {
    //     expect(parse(
    //         "\`\`\`js" + "\n" +
    //         "// Import required library" + "\n" +
    //         "const path = require('path');" + "\n" +
    //         "\`\`\`")).toBe(
    //             "```js" + "\n" +
    //             "// Import required library" + "\n" +
    //             "c1::{{ const path = require('path'); }}" + "\n" +
    //             "```"
    //         )

    // })

    // it('parse 2 line js code', () => {
    //     console.log(parse(
    //         "\`\`\`js" + "\n" +
    //         "// Import required library" + "\n" +
    //         "const path = require('path');" + "\n" +
    //         "const path = require('path');" + "\n" +
    //         "\`\`\`"))

    // })

    // it('parse 1 + 1 line js code', () => {
    //     expect(parse(
    //         "\`\`\`js" + "\n" +
    //         "// Import required library" + "\n" +
    //         "const path = require('path');" + "\n" + "\n" +
    //         "const path = require('path');" + "\n" +
    //         "\`\`\`")).toBe(
    //             "```js" + "\n" +
    //             "// Import required library" + "\n" +
    //             "c1::{{ const path = require('path'); }}" + "\n" +
    //             "\n" +
    //             "const path = require('path');" + "\n" +
    //             "```"
    //         )

    // })

    it('parse 1 + 1 line js code', () => {
        console.log(parse(
            "\`\`\`js" + "\n" +
            "// Import required library" + "\n" +
            "const path = require('path');" + "\n" +
            "// Import required library" + "\n" +
            "const path = require('path');" + "\n" +
            "\`\`\`"))
        })
})