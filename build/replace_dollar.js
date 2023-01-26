"use strict";

// src/replace_dollar.ts
function replace_dollar(text) {
  return text.replaceAll("$", "\uFF04");
}
module.exports = replace_dollar;
