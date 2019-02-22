// @format

'use strict';

const debug = require('debug')('cogs:flagIsProcessingInspect');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Prevents route from doing new unitMovement if unit is allready moving'
      );
      const entityId = res.locals.entityId;
      const entities = res.locals.entities;

      const unit = entities[entityId];

      flagInspect(unit);
    })();

    function flagInspect(unit) {
      if (unit.isProcessingMovementUntilTimestamp > Date.now()) {
        debug('flagInspect: Present, aborting!');
        return;
      }

      debug('flagInspect: Not present, good to go!');
      next();
    }
  };
};
