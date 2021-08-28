'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/beastTownhallBuild',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.buildBeastTownhall
  );
};
