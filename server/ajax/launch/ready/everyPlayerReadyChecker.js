// @format

'use strict';

const debug = require('debug')('cogs:everyPlayerReadyChecker');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Check is every player ready');
      const entities = res.locals.entities;

      checkEveryPlayerReady(entities);
    })();

    function checkEveryPlayerReady(entities) {
      let isEveryPlayerReady = true;

      _.forEach(entities, (entity) => {
        if (entity.playerData && entity.playerToken) {
          if (!entity.readyForLaunch) {
            isEveryPlayerReady = false;
          }
        }
      });

      debug('checkEveryPlayerReady', isEveryPlayerReady);

      if (isEveryPlayerReady) {
        next();
      }
    }
  };
};
