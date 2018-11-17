// @format

'use strict';

const debug = require('debug')('cogs:readStateData');

module.exports = (db, stateNameVsLibraryMap) => {
  return (req, res) => {
    const gameInstanceId = res.locals.gameInstanceId;

    (function init() {
      debug('init');
      findState();
    })();

    function findState() {
      const query = { _id: gameInstanceId };
      const options = { projection: { state: 1 } };

      db.collection('gameInstanceCollection').findOne(
        query,
        options,
        (error, gameInstanceObject) => {
          if (error || !gameInstanceObject) {
            debug('findMapLayer: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot find gameInstance');
            return;
          }

          debug('findGameInstance: _id:', gameInstanceObject._id);
          debug('findGameInstance: state:', gameInstanceObject.state);
          readStateDataFromStateLibrary(gameInstanceObject);
        }
      );
    }

    function readStateDataFromStateLibrary(gameInstanceObject) {
      const state = gameInstanceObject.state;
      const _id = gameInstanceObject._id;

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
