// @format

'use strict';

const debug = require('debug')('cogs:game');

module.exports = (environment, db, blueprint, spriteFilenameArray, htmlArray, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();
    viewModel.htmlArray = htmlArray;
    viewModel.blueprint = JSON.stringify(blueprint);
    viewModel.spriteFilenameArray = JSON.stringify(spriteFilenameArray);

    (function init() {
      debug('// Generates main html for /game route from .ejs files for whole game, based on game.ejs');

      generateTemplate();
    })();

    function generateTemplate() {
      const path = environment.basepath + '/server/game.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('generateTemplate html.length:', html.length);
        sendResponse(html);
      });
    }

    function sendResponse(html) {
      debug('sendResponse():html.length:', html.length);
      debug('******************** send ********************');
      res.send(html);
    }
  };
};
