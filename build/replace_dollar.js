"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/replace_dollar.ts
  var require_replace_dollar = __commonJS({
    "src/replace_dollar.ts"(exports, module) {
      function replace_dollar(text) {
        return text.replaceAll("$", "\uFF04");
      }
      module.exports = replace_dollar;
    }
  });
  require_replace_dollar();
})();
