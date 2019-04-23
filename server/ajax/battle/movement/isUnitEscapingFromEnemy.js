// @format

'use strict';

const debug = require('debug')('cogs:isUnitEscapingFromEnemy');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Checks if unit is standing by enemy, and sets isManeuverEnding turn flag then'
      );
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;

      forEachPositionAroundUnit(entities, entityId);
    })();

    function forEachPositionAroundUnit(entities, entityId) {
      let enemyPosition;
      const unit = entities[entityId];
      [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
      ].forEach((offset) => {
        const position = {};
        position.x = unit.position.x + offset.x;
        position.y = unit.position.y + offset.y;
        // debug('forEachPositionAroundUnit:unitPosition:', unit.position);
        // debug('forEachPositionAroundUnit:position:', position);
        if (toolIsEnemyOnPosition(entities, unit, position)) {
          enemyPosition = position;
        }
      });

      if (enemyPosition) {
        debug(
          'forEachPositionAroundUnit: Yes, enemy found nearby!',
          enemyPosition
        );
        res.locals.isManeuverEndingTurn = true;
      } else {
        debug('forEachPositionAroundUnit: No enemy to escape!');
      }

      next();
    }

    function toolIsEnemyOnPosition(entities, unit, position) {
      let isEnemy;

      _.forEach(entities, (entity) => {
        if (unit.boss !== entity.boss) {
          if (entity.unitName && entity.unitStats && !entity.dead) {
            if (
              entity.position.x === position.x &&
              entity.position.y === position.y
            ) {
              isEnemy = true;
            }
          }
        }
      });

      return isEnemy;
    }
  };
};
