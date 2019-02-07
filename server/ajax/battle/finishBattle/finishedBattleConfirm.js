// @format

'use strict';

const debug = require('debug')('cogs:finishedBattleConfirm');
const _ = require('lodash');

// What does this module do?
// Exept
module.exports = (db) => {
  return (req, res, next) => {
    (function init() {
      const ctx = {};
      const entities = res.locals.entities;
      ctx.gameId = entities._id;
      ctx.playerId = res.locals.playerId;
      ctx.unitId = res.locals.unitId;
      ctx.unit = entities[ctx.unitId];

      debug('init: ctx.unitId:', ctx.unitId);
      checkIsWinner(ctx);
    })();

    function checkIsWinner() {}
  };
};
