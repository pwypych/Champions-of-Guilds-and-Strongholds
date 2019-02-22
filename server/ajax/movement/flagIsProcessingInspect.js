// @format

'use strict';

const debug = require('debug')('cogs:flagIsProcessingInspect');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Prevents route from doing new movement if entity is allready moving'
      );
      const entityId = res.locals.entityId;
      const entities = res.locals.entities;

      const entity = entities[entityId];

      flagInspect(entity);
    })();

    function flagInspect(entity) {
      if (entity.isProcessingMovementUntilTimestamp > Date.now()) {
        debug('flagInspect: Present, aborting!');
        return;
      }

      debug('flagInspect: Not present, good to go!');
      next();
    }
  };
};
