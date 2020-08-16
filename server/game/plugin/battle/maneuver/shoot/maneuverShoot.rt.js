'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/maneuverShoot',
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

    middleware.maneuverShoot,

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
    // commont / movement
  );
};
