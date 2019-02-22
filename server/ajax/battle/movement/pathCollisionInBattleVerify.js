// @format

'use strict';

const debug = require('debug')('cogs:pathCollisionInBattleVerify');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Verifies collisions when in battleState');
      const entities = res.locals.entities;
      const entityId = res.locals.entityId;
      const path = res.locals.path;

      verifyCollision(entities, entityId, path);
    })();

    function verifyCollision(entities, entityId, path) {
      let isCollision = false;
      _.forEach(path, (position, index) => {
        if (index === 0) {
          return;
        }

        _.forEach(entities, (entity) => {
          // filter for only battle units here
          if (entity.unitName && entity.collision && entity.position) {
            if (
              entity.position.x === position.x &&
              entity.position.y === position.y
            ) {
              isCollision = index;
            }
          }
        });
      });

      if (isCollision) {
        debug('verifyCollision: Collistion on path!');
        res.send({ error: 1, message: 'Collistion on chosen path' });
        return;
      }

      if (!isCollision) {
        debug('verifyCollision: No collistions!');
      }

      next();
    }
  };
};
