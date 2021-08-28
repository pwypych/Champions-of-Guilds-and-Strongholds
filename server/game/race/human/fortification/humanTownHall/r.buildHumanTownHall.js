'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/humanTownhallBuild',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.buildHumanTownhall
  );
};
