// @format

'use strict';

const debug = require('debug')('nope:cogs:worldStateDataGet');

module.exports = () => {
  return (req, res, next) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;

    (function init() {
      debug('init');
      compareState();
    })();

    function compareState() {
      if (game.state !== 'worldState') {
        debug('compareState: not worldState!');
        next();
        return;
      }
      generateData();
    }

    function generateData() {
      const worldStateData = {};
      worldStateData.state = game.state;
      worldStateData.playerIndex = playerIndex;
      worldStateData.mapLayer = game.mapLayer;

      worldStateData.playerArray = res.locals.game.playerArray.map(
        (player, index) => {
          if (index === playerIndex) {
            return {
              name: player.name,
              color: player.color,
              race: player.race,
              resources: player.resources,
              hero: player.hero
            };
          }

          const enemy = {
            name: player.name,
            color: player.color,
            race: player.race,
            hero: player.hero
          };
          return enemy;
        }
      );

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
