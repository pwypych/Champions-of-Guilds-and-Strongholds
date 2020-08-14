'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/cheatEntitiesGet',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.cheatEntitiesGet
  );
};
