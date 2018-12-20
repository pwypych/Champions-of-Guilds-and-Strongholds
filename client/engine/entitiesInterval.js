// @format

'use strict';

g.engine.entitiesInterval = (walkie, auth) => {
  const every = 500;

  (function init() {
    createInterval();
  })();

  function createInterval() {
    entitiesGet(); // first run

    setInterval(() => {
      entitiesGet();
    }, every);
  }

  function entitiesGet() {
    $.get('/ajax/entitiesGet' + auth.uri, (entities) => {
      walkie.triggerEvent(
        'entitiesGet_',
        'entitiesInterval.js',
        entities,
        false
      );
    });
  }
};
