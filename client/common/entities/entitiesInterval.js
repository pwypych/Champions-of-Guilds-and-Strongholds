// @format

'use strict';

g.common.entitiesInterval = (walkie, auth) => {
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
    $.post('/ajax/entitiesGet' + auth.uri, (entities) => {
      walkie.triggerEvent(
        'entitiesGet_',
        'entitiesInterval.js',
        entities,
        false
      );
    });
  }
};
