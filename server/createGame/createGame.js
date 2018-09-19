// @format

'use strict';
var debug = require('debug')('cogs:home');

module.exports = (environment, templateToHtml) => {
  return (request, responce) => {
    const viewModel = {};
    viewModel.timestamp = Date.now();

    (function init() {
      sendResponce();
    })();

    function sendResponce() {
      templateToHtml('server/home/home.ejs', viewModel, (error, html) => {
        debug('sendResponce():html', viewModel, html);
        debug('*** send ***');
        responce.send(html);
      });
    }
  };
};
