// @format

'use strict';

const debug = require('debug')('cogs:everyPlayerReadyChecker');
const _ = require('lodash');

// What does this module do?
// Check is every player ready
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;

      debug('init');
      checkEveryPlayerReady(entities);
    })();

    function checkEveryPlayerReady(entities) {
      let isEveryPlayerReady = true;

      _.forEach(entities, (entity) => {
        if (entity.playerData && entity.playerToken) {
          if (!entity.playerData.readyForLaunch) {
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
