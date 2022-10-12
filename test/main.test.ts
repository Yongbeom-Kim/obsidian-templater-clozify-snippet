import parse from "../src/anki_clozify_formatter";


describe('parse code block', () => {
    it('parse 1 line js code', () => {
        expect(parse(
            "\`\`\`js" + "\n" +
            "// Import required library" + "\n" +
            "const path = require('path');" + "\n" +
            "\`\`\`")).toBe(
                "\n" +
                "`// Import required library`" + "\n" +
                "`c1::{{ const path = require('path'); }}`" + "\n"
            )

    })

    it('parse 2 line js code', () => {
        console.log(parse(
            "" + "\n" +
            "`// Import required library`" + "\n" +
            "`const path = require('path');`" + "\n" +
            "`const path = require('path');`" + "\n" +
            ""))

    })

    it('parse 1 + 1 line js code', () => {
        expect(parse(
            "\`\`\`js" + "\n" +
            "// Import required library" + "\n" +
            "const path = require('path');" + "\n" + "\n" +
            "const path = require('path');" + "\n" +
            "\`\`\`")).toBe(
                "" + "\n" +
                "`// Import required library`" + "\n" +
                "`c1::{{ const path = require('path'); }}`" + "\n" +
                "``" + "\n" +
                "`const path = require('path');`" + "\n"
            )

    })

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

describe('test notes', () => {
    it('Example 1', () => {
        expect(parse("### Basic Setup[^1]" + "\n" +
            "- To use webpack, npm packages are - `webpack and webpack-cli`" + "\n" +
            "- To run webpack, do - `npx webpack`." + "\n" +
            "- The webpack configuration file is (+ directory?) - `webpack.config.js` in the base directory" + "\n" +
            "- If `webpack.config.js` is present, webpack automatically - picks it up to use as a config." + "\n" +
            "- Basic `webpack.config.js` file:" + "\n" +
            "```js" + "\n" +
            "// Import required library" + "\n" +
            "const path = require('path');" + "\n" +
            "" + "\n" +
            "// First line of config" + "\n" +
            "module.exports = {" + "\n" +
            "// Specify which file to compile" + "\n" +
            "entry: './src/index.js'," + "\n" +
            "// Specify which file to spit out" + "\n" +
            "output: {" + "\n" +
            "filename: 'main.js'," + "\n" +
            "path: path.resolve(__dirname, 'dist')," + "\n" +
            "}," + "\n" +
            "	" + "\n" +
            "};" + "\n" +
            "```")).toBe("### Basic Setup[^1]" + "\n" +
                "- c1::::{{ To use webpack, npm packages are }} - c1::{{ `webpack and webpack-cli` }}" + "\n" +
                "- c2::::{{ To run webpack, do }} - c2::{{ `npx webpack`. }}" + "\n" +
                "- c3::::{{ The webpack configuration file is (+ directory?) }} - c3::{{ `webpack.config.js` in the base directory }}" + "\n" +
                "- c4::::{{ If `webpack.config.js` is present, webpack automatically }} - c4::{{ picks it up to use as a config. }}" + "\n" +
                "- Basic `webpack.config.js` file:" + "\n" + 
                "" + "\n" +
                "`// Import required library`" + "\n" +
                "`c5::{{ const path = require('path'); }}`" + "\n" +
                "``" + "\n" +
                "`// First line of config`" + "\n" +
                "`c6::{{ module.exports = { }}`" + "\n" +
                "`// Specify which file to compile`" + "\n" +
                "`c7::{{ entry: './src/index.js', }}`" + "\n" +
                "`// Specify which file to spit out`" + "\n" +
                "`c8::{{ output: { }}`" + "\n" +
                "`c8::{{ filename: 'main.js', }}`" + "\n" +
                "`c8::{{ path: path.resolve(__dirname, 'dist'), }}`" + "\n" +
                "`c8::{{ }, }}`" + "\n" +
                "`	`" + "\n" +
                "`};`" + "\n"
            );
    })
})