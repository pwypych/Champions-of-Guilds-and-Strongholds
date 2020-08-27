'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/battleMovementPath',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('battleState'),

    // maneuver / verify
    middleware.readEntities,
    middleware.entityIdVerify,
    middleware.checkUnitOwner,
    middleware.checkUnitActive,
    middleware.checkUnitManeuverGreatherThenZero,

    // common / movement
    middleware.flagIsProcessingInspect,
    middleware.pathVerify,

    // battle / movement
    middleware.pathUnitMovementPointsVerify,
    middleware.walkPathInBattleVerify,
    middleware.flyPathInBattleVerify,
    middleware.isUnitRetreatFromEnemy,

    // commont / movement
    middleware.flagIsProcessingCreate,
    middleware.recentActivityOnMovement,
    middleware.pathSendResponse,
    middleware.movementTimeout,
    middleware.positionUpdate,

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
