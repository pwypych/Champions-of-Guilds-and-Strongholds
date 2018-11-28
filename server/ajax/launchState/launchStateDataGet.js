// @format

'use strict';

const debug = require('debug')('nope:cogs:launchStateDataGet');

module.exports = () => {
  return (req, res, next) => {
    const state = res.locals.game.state;
    const playerIndex = res.locals.playerIndex;

    (function init() {
      debug('init');
      compareState();
    })();

    function compareState() {
      if (state !== 'launchState') {
        debug('compareState: not launchState!');
        next();
        return;
      }
      generateData();
    }

    function generateData() {
      debug('playerIndex', playerIndex);
      const launchStateData = {};
      launchStateData.state = state;
      launchStateData.playerIndex = playerIndex;

      launchStateData.playerArray = res.locals.game.playerArray.map(
        (player) => {
          return {
            name: player.name,
            color: player.color,
            race: player.race,
            ready: player.ready
          };
        }
      );

      debug(
        'generateData: launchStateData.playerArray.length',
        launchStateData.playerArray.length
      );
      sendStateData(launchStateData);
    }

    function sendStateData(stateData) {
      debug('sendStateData');
      res.send(stateData);
      debug('******************** ajax ********************');
    }
  };
};
