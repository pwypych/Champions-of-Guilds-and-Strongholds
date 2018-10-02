// @format

'use strict';

const debug = require('debug')('cogs:home');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();

    (function init() {
      findMaps(db);
    })();

    function findMaps(db) {
      sendResponce();
    }

    function sendResponce() {
      templateToHtml(__filename, viewModel, (error, html) => {
        debug('sendResponce():html', viewModel, html);
        debug('*** send ***');
        res.send(html);
      });
    }
  };
};
