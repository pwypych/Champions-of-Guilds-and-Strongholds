'use strict';

module.exports = (app, middleware) => {
  app.post(
    '/ajax/worldRecruitUnit',
    middleware.readEntities,
    middleware.authenticateToken,
    middleware.authenticateState('worldState'),

    middleware.recruitUnitPost
  );
};
