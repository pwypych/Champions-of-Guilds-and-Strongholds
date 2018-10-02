// @format

'use strict';

const debug = require('debug')('cogs:landing');

module.exports = (environment, templateToHtml) => {
  return (request, responce) => {
    const viewModel = {};
    viewModel.timestamp = Date.now();
    viewModel.baseurl = environment.baseurl;

    (function init() {
      sendResponce();
    })();

    function sendResponce() {
      templateToHtml(__filename, viewModel, (error, html) => {
        debug('sendResponce():html', viewModel, html);
        debug('******************** send ********************');
        responce.send(html);
      });
    }
  };
};
