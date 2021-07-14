'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/buildSuburbs',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.sendResponseEarly
  );
};
