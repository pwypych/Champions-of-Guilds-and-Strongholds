'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/undeadTownHallBuild',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.buildUndeadTownHall
  );
};
