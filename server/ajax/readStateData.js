// @format

'use strict';

const debug = require('debug')('cogs:readStateData');

module.exports = (db, stateNameVsLibraryMap) => {
  return (req, res) => {
    const game = res.locals.game;

    (function init() {
      debug('init');
      readStateDataFromStateLibrary();
    })();

    function readStateDataFromStateLibrary() {
      const state = game.state;

      stateNameVsLibraryMap[state](game, (error, stateData) => {
        if (error || !stateData) {
          debug('readStateDataFromStateLibrary: error:', error);
          res
            .status(503)
            .send('503 Service Unavailable - Cannot find state for the game');
          return;
        }

        debug(
          'readStateDataFromStateLibrary',
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
