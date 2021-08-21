'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/buildMonastery',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.sendResponseEarly
  );
};
