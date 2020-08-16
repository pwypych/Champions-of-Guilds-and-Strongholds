'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/launchNamePost',
    // authenticate
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('launchState'),

    middleware.launchNamePost
  );
};
