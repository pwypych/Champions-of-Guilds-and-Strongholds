// @format

'use strict';

const debug = require('debug')('cogs:pathIfBattleSlice');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Verifies if battle is initiated on path and slices path');
      const entities = res.locals.entities;
      const path = res.locals.path;

      checkBattleAtIndex(entities, path);
    })();

    function checkBattleAtIndex(entities, path) {
      let battleAtIndex;

      _.forEach(path, (position, index) => {
        if (battleAtIndex) {
          return;
        }

        _.forEach(entities, (entity) => {
          if (entity.unitCounts && !entity.heroStats) {
            [
              { x: 0, y: -1 },
              { x: 1, y: 0 },
              { x: 0, y: 1 },
              { x: -1, y: 0 }
            ].forEach((offset) => {
              if (
                entity.position.x === position.x + offset.x &&
                entity.position.y === position.y + offset.y
              ) {
                debug('checkBattleAtIndex: Battle found!: position:', position);
                battleAtIndex = index;
              }
            });
          }
        });
      });

      if (!battleAtIndex) {
        debug('checkBattleAtIndex: No battle found!');
        next();
        return;
      }

      slicePath(path, battleAtIndex);
    }

    function slicePath(pathOriginal, battleAtIndex) {
      const path = pathOriginal.slice(0, battleAtIndex + 1);
      res.locals.path = path;

      debug('slicePath: index:', battleAtIndex + 1);
      next();
    }
  };
};
