'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/undeadTownhallBuild',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.buildUndeadTownhall
  );
};
