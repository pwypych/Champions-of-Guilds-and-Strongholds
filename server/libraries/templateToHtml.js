// @format

'use strict';

const dot = require('dot');
const fs = require('fs');
var debug = require('debug')('cogs:templateToHtml');

/* eslint-disable no-useless-escape */
dot.templateSettings = {
  evaluate: /\<\%([\s\S]+?)\%\>/g,
  interpolate: /\<\%=([\s\S]+?)\%\>/g,
  encode: /\<\%-([\s\S]+?)\%\>/g,
  use: /\<\%#([\s\S]+?)\%\>/g,
  define: /\<\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\>/g,
  conditional: /\<\%\?(\?)?\s*([\s\S]*?)\s*\%\>/g,
  iterate: /\<\%~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\>)/g,
  varname: 'viewModel',
  strip: true,
  append: true,
  selfcontained: false
};
/* eslint-enable no-useless-escape */

module.exports = (environment) => {
  return (templatePath, viewModel, callback) => {
    let error = false;
    let html;

    (function init() {
      debug('init()', templatePath, viewModel);
      loadFile();
    })();

    function loadFile() {
      const path = environment.basepath + '/' + templatePath;

      debug('loadFile', path);

      fs.readFile(path, (error, templateBuffer) => {
        if (error) {
          debug('!!! TEMPLATE ERROR !!! - Cannot load file: ', path);
          callback(error);
        }

        const templateString = templateBuffer.toString();

        tryToCompile(templateString);
      });
    }

    function tryToCompile(templateString) {
      try {
        const compiled = dot.template(templateString);
        const htmlWithoutSlashes = compiled(viewModel);
        html = htmlWithoutSlashes.split('&#47;').join('/'); // dot escapes slashes by default
      } catch (errorCompile) {
        error = errorCompile;
      }

      if (error) {
        debug('!!! TEMPLATE ERROR !!! ', error.message);
        debug('!!! TEMPLATE ERROR !!! ', error.stack);

        callback(error);
        return;
      }

      callback(null, html);
    }
  };
};
