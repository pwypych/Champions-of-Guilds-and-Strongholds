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
      addEveryHeroFigure();
    })();

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
