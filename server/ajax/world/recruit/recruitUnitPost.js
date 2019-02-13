// @format

'use strict';

const debug = require('debug')('cogs:recruitUnitPost.js');

module.exports = (db, unitStats) => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Endpoint, set endTurn flag to true on player entitty and send early response'
      );
      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.playerId = res.locals.playerId;

      findRecruitUnitStats(ctx);
    })();

    function findRecruitUnitStats(ctx) {
      const unitName = req.body.unitName;
      const recruitUnit = unitStats[unitName];

      if (!recruitUnit) {
        res.status(400);
        res.send({
          error: 'Wrong recruit name!'
        });
        debug('******************** error ********************');
        return;
      }

      ctx.recruitUnit = recruitUnit;
      debug('findRecruitUnitStats: recruitUnit.cost', recruitUnit.cost);
      checkCanPlayerRecruitUnit(ctx);
    }

    function checkCanPlayerRecruitUnit(ctx) {
      const playerId = ctx.playerId;
      const entities = ctx.entities;
      const player = entities[playerId];
      const playerGold = player.playerResources.gold;
    }
  };
};
