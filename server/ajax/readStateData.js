// @format

'use strict';

const debug = require('debug')('cogs:readStateData');

module.exports = (db, stateNameVsLibraryMap) => {
  return (req, res) => {
    const gameId = res.locals.gameId;

    (function init() {
      debug('init');
      findState();
    })();

    function findState() {
      const query = { _id: gameId };
      const options = { projection: { state: 1 } };

      db.collection('gameCollection').findOne(query, options, (error, game) => {
        if (error || !game) {
          debug('findMapLayer: error:', error);
          res.status(503).send('503 Service Unavailable - Cannot find game');
          return;
        }

        debug('findGame: _id:', game._id);
        debug('findGame: state:', game.state);
        readStateDataFromStateLibrary(game);
      });
    }

    function readStateDataFromStateLibrary(game) {
      const state = game.state;
      const _id = game._id;

      stateNameVsLibraryMap[state](_id, (error, stateData) => {
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
