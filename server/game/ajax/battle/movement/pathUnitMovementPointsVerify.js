// @format

'use strict';

const debug = require('debug')('cogs:pathUnitMovementPointsVerify');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Verifies unit movement and slices path when in battleState');
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const path = res.locals.path;

      slicePathByUnitMovementPoints(entities, entityId, path);
    })();

    function slicePathByUnitMovementPoints(entities, entityId, pathOriginal) {
      const unit = entities[entityId];
      const stepAmount = pathOriginal.length - 1;
      const unitMovement = unit.unitStats.current.movement;

      let path;

      if (unitMovement < stepAmount) {
        path = pathOriginal.slice(0, unitMovement + 1);
        res.locals.path = path;
      } else {
        path = pathOriginal;
      }

      debug('slicePathByUnitMovementPoints', unitMovement, stepAmount);
      next();
    }
  };
};
