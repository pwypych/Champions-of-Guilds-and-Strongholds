// @format

'use strict';

const debug = require('debug')('cogs:home');

module.exports = (environment, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();

    (function init() {
      sendResponce();
    })();

    function sendResponce() {
      templateToHtml(__filename, viewModel, (error, html) => {
        debug('sendResponce():html', viewModel, html);
        debug('*** send ***');
        res.send(html);
      });
    }
  };
};
