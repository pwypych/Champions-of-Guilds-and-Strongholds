'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/mineVisit',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.entityIdVerify,

    middleware.mineVisit
  );
};
