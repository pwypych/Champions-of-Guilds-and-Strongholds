// @format

'use strict';

const debug = require('debug')('cogs:cheatEntitiesGet');
const _ = require('lodash');

module.exports = () => {
  return (req, res) => {
    (function init() {
      debug('// Sends all entities to a player without filtering');

      const entities = res.locals.entities;
      const playerId = res.locals.playerId;

      findCheatEntities(entities, playerId);
    })();

    function findCheatEntities(entities, playerId) {
      const cheatEntities = {};

      _.forEach(entities, (entity, id) => {
        cheatEntities[id] = entity;

        if (entity.playerToken && entity.playerData) {
          // Cheat current
          if (id === playerId) {
            cheatEntities[id].playerCurrent = true;
          }
        }
      });

      debug('findCheatEntities', cheatEntities._id);
      sendCheatEntities(cheatEntities);
    }

    function sendCheatEntities(cheatEntities) {
      debug('sendCheatEntities');
      res.send(cheatEntities);
      debug('******************** ajax ********************');
    }
  };
};
