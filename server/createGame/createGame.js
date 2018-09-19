// @format

'use strict';
var debug = require('debug')('cogs:home');

module.exports = (environment, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.timestamp = Date.now();

    (function init() {
      sendResponce();
    })();

    function sendResponce() {
      templateToHtml(
        'server/createGame/createGame.ejs',
        viewModel,
        (error, html) => {
          debug('sendResponce():html', viewModel, html);
          debug('*** send ***');
          res.send(html);
        }
      );
    }
  };
};
