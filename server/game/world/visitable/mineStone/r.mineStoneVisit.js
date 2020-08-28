'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/mineStoneVisit',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),
    middleware.sendResponseEarly,

    middleware.entityIdVerify,

    middleware.mineStoneVisit
  );
};
