'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/worldFortificationBuild',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost
  );
};
