'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/worldEndTurn',
    // authenticate
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    // world / endTurn
    middleware.endTurnPost,
    middleware.zeroHeroMovementPoints,
    middleware.endTurnCountdown,
    middleware.readEntities,
    middleware.battleChecker,
    middleware.battleNpcCreate,
    middleware.battleClashCreate,
    middleware.newDay,
    middleware.readEntities,
    middleware.enchantmentIncomeDigest,
    middleware.refillHeroMovement,
    middleware.unsetEndTurnFlags
  );
};
