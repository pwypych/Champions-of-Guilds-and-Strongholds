// @format

'use strict';

g.autoload.entitiesInterval = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

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
