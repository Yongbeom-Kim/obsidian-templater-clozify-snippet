/**
 * Replace the $ with ＄ to avoid obsidian_to_anki from treating it like latex.
 * @param text 
 */
function replace_dollar(text: string): string {
    return text.replaceAll('$', '＄');
}

module.exports = replace_dollar