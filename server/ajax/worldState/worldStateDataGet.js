// @format

'use strict';

const debug = require('debug')('nope:cogs:worldStateDataGet');

module.exports = () => {
  return (req, res, next) => {
    const state = res.locals.game.state;

    (function init() {
      debug('init');
      compareState();
    })();

    function compareState() {
      if (state !== 'worldState') {
        debug('compareState: not worldState!');
        next();
        return;
      }
      generateData();
    }

    function generateData() {
      const worldStateData = {};
      worldStateData.state = state;
      worldStateData.playerIndex = res.locals.playerIndex;
      worldStateData.mapLayer = res.locals.game.mapLayer;

      debug(
        'generateData: worldStateData.mapLayer.length',
        worldStateData.mapLayer.length
      );
      sendStateData(worldStateData);
    }

    function sendStateData(stateData) {
      debug('sendStateData');
      res.send(stateData);
      debug('******************** ajax ********************');
    }
  };
};
