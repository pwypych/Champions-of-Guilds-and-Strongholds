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
      generateLaunch();
    })();

    function generateLaunch() {
      const path = environment.basepath + '/server/gameInstance/launch.ejs';
      templateToHtml(path, viewModel, (error, htmlLaunch) => {
        viewModel.htmlLaunch = htmlLaunch;
        debug('generateLaunch: htmlLaunch.length:', htmlLaunch.length);
        generateTemplate();
      });
    }

    function generateTemplate() {
      const path =
        environment.basepath + '/server/gameInstance/gameInstance.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('generateTemplate html.length:', html.length);
        sendResponce(html);
      });
    }

    function sendResponce(html) {
      debug('sendResponce():html.length:', html.length);
      debug('******************** send ********************');
      res.send(html);
    }
  };
};
