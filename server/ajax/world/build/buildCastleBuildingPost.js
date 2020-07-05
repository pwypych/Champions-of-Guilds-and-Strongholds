// @format

'use strict';

const debug = require('debug')('cogs:buildCastleBuildingPost.js');

module.exports = () => {
  return (req, res) => {
    (function init() {
      debug(
        '// Endpoint, upgrade one building in castle by given buildingName'
      );
      const ctx = {};
      ctx.entities = res.locals.entities;
      ctx.gameId = res.locals.entities._id;
      ctx.playerId = res.locals.playerId;

      const message = 'ok';
      res.send({
        error: 0,
        message: message
      });
    })();
  };
};
