// @format

'use strict';

const debug = require('debug')('cogs:pathHeroMovementPointsVerify');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Verifies hero movement and slices path when in battleState');
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const path = res.locals.path;

      slicePathByUnitMovementPoints(entities, entityId, path);
    })();

    function slicePathByUnitMovementPoints(entities, entityId, pathOriginal) {
      const hero = entities[entityId];
      const stepAmount = pathOriginal.length - 1;
      const heroMovement = hero.heroStats.current.movement;

      let path;

      if (heroMovement < stepAmount) {
        path = pathOriginal.slice(0, heroMovement + 1);
        res.locals.path = path;
      } else {
        path = pathOriginal;
      }

      debug('slicePathByUnitMovementPoints', heroMovement, stepAmount);
      next();
    }
  };
};
