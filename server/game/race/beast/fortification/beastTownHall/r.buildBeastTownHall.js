'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/beastTownHallBuild',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.buildBeastTownHall
  );
};
