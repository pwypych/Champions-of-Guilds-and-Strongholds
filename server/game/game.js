// @format

'use strict';

const debug = require('debug')('cogs:game');

module.exports = (environment, db, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();

    (function init() {
      debug('init');
      generateWorld();
    })();

    function generateWorld() {
      const path = environment.basepath + '/server/game/world.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlWorld = html;
        debug('generateWorld: html.length:', html.length);
        generateLaunch();
      });
    }

    function generateLaunch() {
      const path = environment.basepath + '/server/game/launch.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlLaunch = html;
        debug('generateLaunch: html.length:', html.length);
        generatePreload();
      });
    }

    function generatePreload() {
      const path = environment.basepath + '/server/game/preload.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlPreload = html;
        debug('generatePreload: html.length:', html.length);
        generateTemplate();
      });
    }

    function generateTemplate() {
      const path = environment.basepath + '/server/game/game.ejs';
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
