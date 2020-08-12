// @format

'use strict';

const debug = require('debug')('cogs:maneuverActivateUnit');
const _ = require('lodash');

module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Check if target unit can be activated, activate it, deactivate previous active unit'
      );

      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unitTargetId = res.locals.entityId;
      ctx.unitTarget = entities[ctx.unitTargetId];

      checkUnitTargetActive(ctx);
    })();

    function checkUnitTargetActive(ctx) {
      const unitTarget = ctx.unitTarget;
      if (unitTarget.active) {
        debug('checkUnitTargetActive: Target unit should be inactive!');
        return;
      }

      if (unitTarget.unitStats.current.maneuverPoints < 1) {
        debug(
          'checkUnitTargetActive: Target unit should have maneuver points!'
        );
        return;
      }

      debug('checkUnitSkill: Target unit can be activated!');
      findUnitActive(ctx);
    }

    function findUnitActive(ctx) {
      const entities = res.locals.entities;

      let unitActiveId;
      _.forEach(entities, (entity, id) => {
        if (
          entity.unitName &&
          entity.owner === ctx.playerId &&
          entity.active &&
          !entity.dead
        ) {
          unitActiveId = id;
        }
      });

      if (!unitActiveId) {
        debug('findUnitActive: Player does not own active unit!');
        return;
      }

      ctx.unitActiveId = unitActiveId;

      updateUnitActive(ctx);
    }

    function updateUnitActive(ctx) {
      const gameId = ctx.gameId;
      const unitActiveId = ctx.unitActiveId;

      const query = { _id: gameId };

      const fieldActive = unitActiveId + '.active';

      const $set = {};
      $set[fieldActive] = false;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateUnitActive: error: ', error);
          }

          debug('updateUnitActive: Active unit deactivated!', update);
          updateUnitTarget(ctx);
        }
      );
    }

    function updateUnitTarget(ctx) {
      const gameId = ctx.gameId;
      const unitTargetId = ctx.unitTargetId;

      const query = { _id: gameId };

      const fieldActive = unitTargetId + '.active';

      const $set = {};
      $set[fieldActive] = true;

      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateUnitTarget: error: ', error);
          }

          debug('updateUnitTarget: Target unit activated!', update);
          next();
        }
      );
    }
  };
};
