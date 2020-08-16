'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/summaryConfirm',
    // authenticate
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('summaryState'),

    // summary / confirm
    middleware.summaryConfirm,
    middleware.readEntities,
    middleware.worldChecker,

    // world / endTurn
    middleware.battleChecker,
    middleware.battleNpcCreate,
    middleware.battleClashCreate,
    middleware.newDay,
    middleware.refillHeroMovement,
    middleware.unsetEndTurnFlags
  );
};
