'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/launchReadyPost',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('launchState'),
    middleware.launchReadyPost,
    middleware.readEntities,
    middleware.everyPlayerReadyChecker,
    middleware.preparePlayerResource,
    middleware.prepareHeroFigure,
    middleware.launchCountdown,
    middleware.unsetReadyForLaunch,

    // save
    middleware.readEntities,
    middleware.saveGame
  );
};
