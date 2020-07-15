// @format

'use strict';

const debug = require('debug')('cogs:buildFortificationPost.js');
const _ = require('lodash');

module.exports = (db, fortificationBlueprint) => {
  return (req, res) => {
    (function init() {
      debug('// Endpoint, build one fortification in castle by given name');
      debug('init: req.body:', req.body);
      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = res.locals.entities._id;
      ctx.playerId = res.locals.playerId;

      comparePlayerAndFortificationRace(ctx);
    })();

    // Check is fortificationName valid and such fortification exist

    function comparePlayerAndFortificationRace(ctx) {
      const playerId = ctx.playerId;
      const player = ctx.entities[playerId];
      const playerRace = player.playerData.race;
      const fortificationName = req.body.fortificationName;
      const fortification = fortificationBlueprint()[fortificationName];
      ctx.fortification = fortification;

      if (playerRace !== fortification.race) {
        res.status(503);
        res.send({
          error: 'This fortification is not from player race!'
        });
        debug('This fortification is not from player race:');
        debug(
          'comparePlayerAndFortificationRace: fortificationName:',
          fortificationName
        );
        debug('******************** error ********************');
        return;
      }

      debug('comparePlayerAndFortificationRace: playerRace:', playerRace);
      checkIsFortificationAlreadyBuild(ctx);
    }

    // Check is fortification already build
    function checkIsFortificationAlreadyBuild(ctx) {
      const fortificationName = ctx.fortification;
      const entities = ctx.entities;
      const playerId = ctx.playerId;
      let isBuild = false;

      _.forEach(entities, (entity) => {
        if (entity.goldIncome && entity.owner === playerId) {
          isBuild = true;
        }
      });

      if (isBuild) {
        res.status(503);
        res.send({
          error: 'This fortification is already build!'
        });
        debug('This fortification is already build!', fortificationName);
        debug('******************** error ********************');
        return;
      }

      checkPlayerAffordFortification(ctx);
    }

    // Check can player afford fortification
    function checkPlayerAffordFortification(ctx) {
      const fortification = ctx.fortification;
      const fortificationCost = fortification.buildingCost;
      const playerId = ctx.playerId;
      const player = ctx.entities[playerId];
      const playerResources = player.playerResources;
      let canPlayerAffordFortification = true;

      _.forEach(fortificationCost, (cost, resource) => {
        if (playerResources[resource] < cost) {
          canPlayerAffordFortification = false;
          debug('checkPlayerAffordFortification: Not enaugh:', resource);
        }
      });

      if (!canPlayerAffordFortification) {
        res.status(503);
        res.send({
          error: 'This fortification is too expensive!'
        });
        debug('This fortification is too expensive!', fortificationCost);
        debug('******************** error ********************');
        return;
      }

      debug(
        'checkPlayerAffordFortification: canPlayerAffordFortification:',
        canPlayerAffordFortification
      );
      const message = 'ok';
      res.send({
        error: 0,
        message: message
      });
    }
  };
};
