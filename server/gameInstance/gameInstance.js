// @format

'use strict';

const debug = require('debug')('cogs:gameInstance');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();

    (function init() {
      debug('init');
      sendResponce();
    })();

    function sendResponce() {
      templateToHtml(__filename, viewModel, (error, html) => {
        debug('sendResponce():html', viewModel, html.length);
        debug('******************** send ********************');
        res.send(html);
      });
    }
  };
};
