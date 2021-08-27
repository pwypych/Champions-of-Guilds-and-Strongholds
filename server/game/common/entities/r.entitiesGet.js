'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/entitiesGet',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.launchEntitiesFilter,
    middleware.worldEntitiesFilter,
    middleware.worldEntitiesFogOfWar,
    middleware.battleEntitiesFilter,
    middleware.summaryEntitiesFilter,
    middleware.entitiesFilterSendResponse
  );
};
