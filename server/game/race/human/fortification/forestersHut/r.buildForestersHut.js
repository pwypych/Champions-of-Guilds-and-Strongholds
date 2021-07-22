'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/buildForestersHut',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.sendResponseEarly
  );
};
