// @format

'use strict';

const debug = require('debug')('cogs:prepareGameAfterLaunch');
const _ = require('lodash');

module.exports = (db) => {
  return (game, callback) => {
    const errorArray = [];
    const raceResourceMap = {
      human: {
        wood: 15,
        stone: 5,
        gold: 2000,
        crystal: 7
      },
      orc: {
        wood: 5,
        stone: 15,
        gold: 4000,
        crystal: 2
      }
    };

    (function init() {
      debug('init');
      forEachPlayer();
    })();

    function forEachPlayer() {
      const done = _.after(game.playerArray.length, () => {
        debug('forEachPlayer: done!');
        checkForEachErrorArray();
      });

      game.playerArray.forEach((player, playerIndex) => {
        debug('forEachPlayer', player);
        updatePlayerResources(player, playerIndex, done);
      });
    }

    function updatePlayerResources(player, playerIndex, done) {
      const query = { _id: game._id };

      const mongoFieldToSet = 'playerArray.' + playerIndex + '.resources';
      const $set = {};
      $set[mongoFieldToSet] = raceResourceMap[player.race];
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            errorArray.push(
              player.name +
                ': ERROR: insert mongo error:' +
                JSON.stringify(error)
            );
          }

          done();
        }
      );
    }

    function checkForEachErrorArray() {
      debug('checkForEachErrorArray');
      if (!_.isEmpty(errorArray)) {
        callback('\n ' + errorArray.join(' \n '));
        return;
      }

      addEveryHeroFigure();
    }

    function addEveryHeroFigure() {
      const heroStartPositionArray = [];
      game.mapLayer.forEach((row, y) => {
        row.forEach((figure, x) => {
          if (figure.name === 'castleRandom') {
            const heroStartPosition = {};
            heroStartPosition.x = x;
            heroStartPosition.y = y + 1;
            heroStartPositionArray.push(heroStartPosition);
          }
        });
      });
      debug('heroStartPositionArray.length', heroStartPositionArray.length);

      debug('addEveryHeroFigure');
      callback(null);
    }
  };
};
