'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/launchRacePost',
    // authenticate
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('launchState'),

    middleware.launchRacePost
  );
};
