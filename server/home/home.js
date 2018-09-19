// @format

'use strict';
var debug = require('debug')('cogs:home');

module.exports = (environment, templateToHtml) => {
  return (request, responce) => {
    const viewModel = {};

    (function init() {
      sendResponce();
    })();

    function sendResponce() {
      templateToHtml('server/home/home.ejs', viewModel, (error, html) => {
        debug('sendResponce():html', html.length);
        responce.send(html);
      });
    }
  };
};
