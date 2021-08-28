'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/humanTownHallBuild',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.buildFortificationPost,
    middleware.buildHumanTownHall
  );
};
