// @format

'use strict';

const dot = require('dot');
const fs = require('fs');
const debug = require('debug')('cogs:templateToHtml');

/* eslint-disable no-useless-escape */
dot.templateSettings = {
  evaluate: /\<\%([\s\S]+?)\%\>/g,
  encode: /\<\%=([\s\S]+?)\%\>/g,
  interpolate: /\<\%-([\s\S]+?)\%\>/g,
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

module.exports = () => {
  return (filename, viewModel, callback) => {
    let error = false;
    let html;

    (function init() {
      // debug('init()', filename);
      loadFile();
    })();

    function loadFile() {
      // const path = environment.basepath + '/' + templatePath;
      let path;

      if (filename.substr(-3, 3) === '.js') {
        path = filename.substr(0, filename.length - 3) + '.ejs';
      } else {
        path = filename;
      }

      debug('loadFile', path);

      fs.readFile(path, (errorReadFile, templateBuffer) => {
        if (errorReadFile) {
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
