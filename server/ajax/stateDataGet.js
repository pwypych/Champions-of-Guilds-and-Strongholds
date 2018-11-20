// @format

'use strict';

const debug = require('debug')('cogs:stateDataGet');

module.exports = (db, stateNameVsLibraryMap) => {
  return (req, res) => {
    const game = res.locals.game;

    (function init() {
      debug('init');
      stateDataGetFromStateLibrary();
    })();

    function stateDataGetFromStateLibrary() {
      const state = game.state;

      stateNameVsLibraryMap[state](game, (error, stateData) => {
        if (error || !stateData) {
          debug('stateDataGetFromStateLibrary: error:', error);
          res.status(503);
          res.send('503 Service Unavailable - Cannot find state for the game');
          debug('******************** ajax error ********************');
          return;
        }

        debug(
          'stateDataGetFromStateLibrary',
          JSON.stringify(stateData).substr(0, 200)
        );
        sendStateData(stateData);
      });
    }

    function sendStateData(stateData) {
      debug('sendStateData');
      res.send(stateData);
      debug('******************** ajax ********************');
    }
  };
};
