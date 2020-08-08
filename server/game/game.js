// @format

'use strict';

const debug = require('debug')('cogs:game');

module.exports = (environment, db, blueprint, spriteFilenameArray, templateToHtml) => {
  return (req, res) => {
    const viewModel = {};
    viewModel.baseurl = environment.baseurl;
    viewModel.timestamp = Date.now();
    viewModel.blueprint = JSON.stringify(blueprint);
    viewModel.spriteFilenameArray = JSON.stringify(spriteFilenameArray);

    (function init() {
      debug('// Generates html from .ejs files for game');

      generateCheat();
    })();

    function generateCheat() {
      const path = environment.basepath + '/server/game/ejs/cheat.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlCheat = html;
        debug('generateCheat: html.length:', html.length);
        generateInterfaceWorld();
      });
    }

    function generateInterfaceWorld() {
      const path = environment.basepath + '/server/game/ejs/worldInterface.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlInterfaceWorld = html;
        debug('generateInterfaceWorld: html.length:', html.length);
        generateHeroDead();
      });
    }

    function generateHeroDead() {
      const path = environment.basepath + '/server/game/ejs/heroDead.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlHeroDead = html;
        debug('generateHeroDead: html.length:', html.length);
        generateInterfaceBattle();
      });
    }

    function generateInterfaceBattle() {
      const path = environment.basepath + '/server/game/ejs/battleInterface.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlInterfaceBattle = html;
        debug('generateInterfaceBattle: html.length:', html.length);
        generateSummary();
      });
    }

    function generateSummary() {
      const path = environment.basepath + '/server/game/ejs/summary.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlSummary = html;
        debug('generateSummary: html.length:', html.length);
        generateChat();
      });
    }

    function generateChat() {
      const path = environment.basepath + '/server/game/ejs/chat.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlChat = html;
        debug('generateChat: html.length:', html.length);
        generateLaunch();
      });
    }

    function generateLaunch() {
      const path = environment.basepath + '/server/game/ejs/launch.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlLaunch = html;
        debug('generateLaunch: html.length:', html.length);
        generatePreload();
      });
    }

    function generatePreload() {
      const path = environment.basepath + '/server/game/ejs/preload.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        viewModel.htmlPreload = html;
        debug('generatePreload: html.length:', html.length);
        generateTemplate();
      });
    }

    function generateTemplate() {
      const path = environment.basepath + '/server/game/ejs/game.ejs';
      templateToHtml(path, viewModel, (error, html) => {
        debug('generateTemplate html.length:', html.length);
        sendResponse(html);
      });
    }

    function sendResponse(html) {
      debug('sendResponse():html.length:', html.length);
      debug('******************** send ********************');
      res.send(html);
    }
  };
};
