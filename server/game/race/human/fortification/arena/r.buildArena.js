'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/buildArena',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.sendResponseEarly
  );
};
