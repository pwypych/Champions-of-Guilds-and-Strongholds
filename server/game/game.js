// @format

'use strict';

const debug = require('debug')('cogs:game');

// What does this module do?
//
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
      const path = environment.basepath + '/server/game/canvasWrapper.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlCanvasWrapper = html;
        debug('generateWorld: html.length:', html.length);
        generateCheat();
      });
    }

    function generateCheat() {
      const path = environment.basepath + '/server/game/cheat.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlCheat = html;
        debug('generateCheat: html.length:', html.length);
        generateInterfaceWorld();
      });
    }

    function generateInterfaceWorld() {
      const path = environment.basepath + '/server/game/interfaceWorld.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlInterfaceWorld = html;
        debug('generateInterfaceWorld: html.length:', html.length);
        generateSummary();
      });
    }

    function generateSummary() {
      const path = environment.basepath + '/server/game/summary.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlSummary = html;
        debug('generateSummary: html.length:', html.length);
        generateChat();
      });
    }

    function generateChat() {
      const path = environment.basepath + '/server/game/chat.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlChat = html;
        debug('generateChat: html.length:', html.length);
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
