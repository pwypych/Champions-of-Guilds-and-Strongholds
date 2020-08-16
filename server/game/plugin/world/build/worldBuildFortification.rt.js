'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/worldBuildFortification',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost
  );
};
