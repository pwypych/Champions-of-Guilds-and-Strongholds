'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/battleActivateUnit',
    // authenticate
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),

    // common / movement
    middleware.readEntities,
    middleware.entityIdVerify,

    // maneuver / verify
    middleware.checkUnitOwner,
    middleware.sendResponseEarly,

    middleware.maneuverActivateUnit
  );
};
