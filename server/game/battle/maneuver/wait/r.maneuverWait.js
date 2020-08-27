'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/maneuverWait',
    // authenticate
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),
    middleware.sendResponseEarly,

    // maneuver / verify
    middleware.readEntities,
    middleware.entityIdVerify,
    middleware.checkUnitOwner,
    middleware.checkUnitActive,
    middleware.checkUnitManeuverGreatherThenZero,

    middleware.maneuverWait,

    // maneuver / digest
    middleware.readEntities,
    middleware.decrementUnitManeuver,
    middleware.ifBattleFinishedChangeState,
    middleware.readEntities,
    middleware.checkIsUnitManeuverZero,
    middleware.ifEveryUnitManeuverZeroRefill,
    middleware.readEntities,
    middleware.nominateNewActiveUnit,

    // save
    middleware.readEntities,
    middleware.saveGame
  );
};
