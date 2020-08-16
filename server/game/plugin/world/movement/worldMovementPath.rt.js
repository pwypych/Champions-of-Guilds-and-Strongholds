'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/worldMovementPath',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    // common / movement
    middleware.entityIdVerify,
    middleware.flagIsProcessingInspect,
    middleware.pathVerify,

    // world / movement
    middleware.pathHeroMovementPointsSlice,
    middleware.pathIfBattleSlice,
    middleware.pathIfResourceSlice,
    middleware.pathCollisionInWorldVerify,
    middleware.heroMovementPointsDecrement,

    // common / movement
    middleware.flagIsProcessingCreate,
    middleware.recentActivityOnMovement,
    middleware.pathSendResponse,
    middleware.movementTimeout,
    middleware.positionUpdate,

    // world / movement
    middleware.collectResource,
    middleware.battleNpcInitiate,
    middleware.battleClashInitiate,

    // save
    middleware.readEntities,
    middleware.saveGame
  );
};
